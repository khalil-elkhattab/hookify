import { NextResponse } from 'next/server';
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// Initialize Convex Client for server-side calls
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req) {
    try {
        const payload = await req.json();
        
        // Paddle event types: transaction.completed is the success event
        const eventType = payload.event_type;
        
        if (eventType === "transaction.completed") {
            // Extract custom data sent during checkout
            // custom_data is a JSON object in Paddle
            const userId = payload.data.custom_data.userId; 
            const creditsAmount = parseInt(payload.data.custom_data.amount);

            if (userId && creditsAmount) {
                // Call Convex Mutation to update the credits
                await convex.mutation(api.users.addCredits, {
                    userId: userId,
                    amount: creditsAmount
                });
                console.log(`Success: Added ${creditsAmount} credits to ${userId}`);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error("Paddle Webhook Error:", error);
        return NextResponse.json({ status: 'error' }, { status: 400 });
    }
}
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { priceId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // يدعم جميع البطاقات العالمية
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
  });

  return Response.json({ url: session.url });
}
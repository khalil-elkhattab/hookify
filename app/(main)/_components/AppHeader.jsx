"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

export default function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-14 border-b px-4 flex items-center bg-background justify-between">
      {/* زر إظهار / إخفاء الـ Sidebar */}
      <button onClick={toggleSidebar} className="md:hidden">
        <PanelLeft className="w-6 h-6" />
      </button>

      <h1 className="font-bold text-lg md:hidden">Hookify Dashboard</h1>
    </header>
  );
}


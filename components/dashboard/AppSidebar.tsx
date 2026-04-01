// components/dashboard/AppSidebar.tsx
"use client";

import { 
  Users, Grid2X2, ShoppingCart, Package, 
  Truck, DollarSign, BookmarkPlus, History, 
  LayoutDashboard, Zap 
} from "lucide-react";
import { 
  Sidebar, SidebarContent, SidebarGroup, 
  SidebarGroupContent, SidebarGroupLabel, 
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader 
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const menuItems = {
    ADMIN: [
      { title: "User Directory", url: "/admin-dashboard/users", icon: Users },
      { title: "All Parcels", url: "/admin-dashboard/all-parcels", icon: Package },
      { title: "Rider Approvals", url: "/admin-dashboard/rider-applications", icon: Truck },
      { title: "Withdrawals", url: "/admin-dashboard/withdraw-requests", icon: DollarSign },
    ],
    RIDER: [
      { title: "Assigned Parcels", url: "/rider-dashboard/assigned-parcels", icon: Package },
      { title: "Active Deliveries", url: "/rider-dashboard/active-deliveries", icon: Truck },
      { title: "My Earnings", url: "/rider-dashboard/my-earnings", icon: DollarSign },
    ],
    USER: [
      { title: "Book A Parcel", url: "/sender-dashboard/book-parcel", icon: BookmarkPlus },
      { title: "My Parcels", url: "/sender-dashboard/my-parcels", icon: History },
      { title: "Payments", url: "/sender-dashboard/payment-history", icon: ShoppingCart },
      { title: "Apply Rider", url: "/sender-dashboard/apply-rider", icon: Truck },
    ]
  };

  const currentMenu = menuItems[role as keyof typeof menuItems] || [];

  return (
    <Sidebar className="border-r border-white/5 bg-[#06060b]">
      <SidebarHeader className="p-6 border-b border-white/5">
        <Link href="/" className="block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F5A0] to-[#00D9F5]">
              <Zap className="h-5 w-5 text-[#06060b] fill-current" />
            </div>
            <span className="font-black tracking-tighter text-white text-xl uppercase italic">
              NEXUS
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">
            Navigation Console
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {currentMenu.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={cn(
                      "group flex items-center gap-3 px-4 py-6 rounded-xl transition-all border border-transparent",
                      isActive ? "bg-white/5 border-white/10 text-[#00F5A0]" : "text-white/40 hover:text-white"
                    )}>
                      <Link href={item.url}>
                        <item.icon size={20} className={isActive ? "text-[#00F5A0]" : "text-white/20"} />
                        <span className="font-bold text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
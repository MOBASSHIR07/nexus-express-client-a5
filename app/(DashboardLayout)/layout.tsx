import { getServerSessionAction } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Zap } from "lucide-react";

export default async function DashboardLayout({
  children,
  admin,
  rider,
  sender,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  rider: React.ReactNode;
  sender: React.ReactNode;
}) {
  const session = await getServerSessionAction();

  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  return (
    <SidebarProvider>
     
      <AppSidebar role={role} />

      <SidebarInset className="bg-[#06060b] min-h-screen flex flex-col">
        
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-4 md:hidden">
          <SidebarTrigger className="text-[#00F5A0]" />
          <div className="flex items-center gap-2 ml-2">
            <Zap className="h-5 w-5 text-[#00F5A0] fill-current" />
            <span className="font-black text-white italic uppercase text-sm tracking-tighter">
              NEXUS <span className="text-[#00F5A0]">EXP.</span>
            </span>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {/* Parallel Routes Logic */}
          {role === "ADMIN" && admin}
          {role === "RIDER" && rider}
          {role === "USER" && sender}

          {/* Fallback children */}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
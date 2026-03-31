import { getServerSessionAction } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

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
      <SidebarInset className="bg-[#06060b] min-h-screen">
        <main className="p-4 md:p-8 overflow-y-auto">
          {/* Parallel Routes Logic */}
          {role === "ADMIN" && admin}
          {role === "RIDER" && rider}
          {role === "USER" && sender}

          {/* Fallback children if needed */}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
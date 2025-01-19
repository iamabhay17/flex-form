import { Toaster } from "sonner";
import { Dashboard } from "@/pages/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <Dashboard />
      <Toaster />
    </SidebarProvider>
  );
}

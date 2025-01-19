import { SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropProvider } from "@/provider/dnd";
import { Canvas } from "@/components/blocks/canvas";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Dashboard = () => {
  return (
    <DragDropProvider>
      <SidebarProvider>
        <AppSidebar />
        <MainContent>
          <Canvas />
        </MainContent>
      </SidebarProvider>
    </DragDropProvider>
  );
};

export const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background z-20 h-12 shrink-0 items-center gap-2 border-b px-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-lg font-medium">FlexForm</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full">
              <SunIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="rounded-full">
              Github
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    </SidebarInset>
  );
};

export default Dashboard;

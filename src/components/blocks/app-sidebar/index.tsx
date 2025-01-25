"use client";

import { motion } from "framer-motion";
import { sidebarItems } from "./sidebar-const";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { IdCard, LayoutTemplate } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <HeaderTitle />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup title="Layout">
          <SidebarGroupLabel>Layout</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Field icon={IdCard} title={"Card"} id="card" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup title="Components">
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            {sidebarItems.map((item) => (
              <SidebarMenu key={item.title}>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Field icon={item.icon} title={item.title} id={item.id} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export const HeaderTitle = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <LayoutTemplate className="size-4" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold text-sm">Components</span>
        <span className="text-xs">Drag to add in canvas</span>
      </div>
    </div>
  );
};

export const Field = (item: { icon: any; title: string; id: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.id === "card" ? "card" : "field",
    item: { title: item.title, type: item.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        toast("Block added", {
          description: "Modify the block to your needs",
        });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <motion.div
      initial={false}
      animate={
        isDragging
          ? {
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              cursor: "grabbing",
            }
          : {
              scale: 1,
              boxShadow: "none",
              cursor: "grab",
            }
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Button
        ref={drag as any}
        variant="outline"
        className={cn(
          "w-full mb-2 justify-start transition-colors duration-200",
          isDragging && "opacity-80 border-primary/50 bg-accent"
        )}
      >
        <item.icon
          className={cn(
            "transition-transform duration-200",
            isDragging && "scale-110"
          )}
        />
        {item.title}
      </Button>
    </motion.div>
  );
};

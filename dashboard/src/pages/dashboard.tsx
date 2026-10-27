import {SidebarProvider, SidebarInset, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {Outlet} from "react-router";

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 items-center border-b px-4">
                    <SidebarTrigger />
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

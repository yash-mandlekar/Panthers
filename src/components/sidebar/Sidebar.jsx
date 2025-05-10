import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronUp,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { axiosI } from "../../hooks/useAxios";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Inbox,
  },
  {
    title: "Scan",
    url: "/scan",
    icon: Search,
  },
  {
    title: "History",
    url: "/history",
    icon: Calendar,
  },
  // {
  //   title: "Check Emails",
  //   url: "/check-emails",
  //   icon: Mail,
  // },
];

export function AppSidebar() {
  const useAuth = () => useContext(AuthContext);
  const { logout } = useAuth();
  const handleLogout = async () => {
    await axiosI.get("/logout");
    localStorage.removeItem("user");
    logout();
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center">
              <img
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                className="w-32"
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="mb-4 mt-2 w-full border-b"></div>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 w-full">
                  <Settings className="w-5 h-5" />
                  Settings
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-60 bg-white dark:bg-gray-800 shadow-lg rounded-md"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

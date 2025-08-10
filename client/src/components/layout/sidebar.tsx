import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Heart, TrendingUp, Users, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();

  const navigationItems = [
    {
      name: "Dashboard",
      icon: BarChart3,
      href: "/",
      current: true,
    },
    {
      name: "Wellbeing",
      icon: Heart,
      href: "/wellbeing",
      current: false,
    },
    {
      name: "Productivity",
      icon: TrendingUp,
      href: "/productivity",
      current: false,
    },
    {
      name: "Team Analytics",
      icon: Users,
      href: "/team",
      current: false,
      requiresRole: ["manager", "hr_admin"],
    },
    {
      name: "Reports",
      icon: FileText,
      href: "/reports",
      current: false,
    },
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.requiresRole || item.requiresRole.includes(user?.role || "employee")
  );

  return (
    <aside className={cn("w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col", className)}>
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">WellnessHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                item.current
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-gray-400 hover:text-gray-500"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

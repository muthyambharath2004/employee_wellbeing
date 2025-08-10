import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle: string;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
}

export function Header({ title, subtitle, selectedRole, onRoleChange }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Role Selector - only show for demo purposes */}
          {user?.role === 'hr_admin' && onRoleChange && (
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee View</SelectItem>
                <SelectItem value="manager">Manager View</SelectItem>
                <SelectItem value="hr_admin">HR Admin View</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}

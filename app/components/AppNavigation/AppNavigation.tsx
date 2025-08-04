import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";
import { DesktopNavItems } from "../DesktopNavItems";
import { AvatarDropdown } from "../AvatarDropdown";
import { MobileMenu } from "../MobileMenu";
import { useScrollDirection } from "@/shared/hooks/useScrollDirection";

const AppNavigation = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const scrollDirection = useScrollDirection();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-gray-800/50",
        "border-b border-purple-800/30 backdrop-blur-xs",
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="md:hidden">
              <MobileMenu
                user={user}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </div>
            <Logo />
          </div>

          <DesktopNavItems />

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <AvatarDropdown
                user={user}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;

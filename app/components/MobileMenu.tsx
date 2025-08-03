import { useState } from "react";
import { Menu, User, LogIn, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@components/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/Sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@components/Avatar";
import { MobileNavItems } from "./MobileNavItems";

interface MobileMenuProps {
  user: any;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const MobileMenu = ({
  user,
  onLogout,
  isLoggingOut,
}: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleNavigate = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 rounded-full text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 p-0 bg-gray-800/50 backdrop-blur-xs border-purple-800/30 [&>button]:text-white/70"
      >
        <SheetHeader className="border-b border-purple-800/30 p-6 bg-gray-800/50 backdrop-blur-xs">
          <SheetTitle className="text-left">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-lg font-bold text-white">Pokedex</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full bg-gray-800/50 backdrop-blur-xs">
          <div className="flex-1 px-6">
            <MobileNavItems onNavigate={handleNavigate} />
          </div>

          <div className="border-t border-purple-800/30 p-6 space-y-4 bg-gray-800/50 backdrop-blur-xs">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.photoURL || ""}
                      alt={user?.displayName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                      {user?.displayName ? (
                        user.displayName.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">
                      {user.displayName || "Pokemon Trainer"}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full justify-start"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full bg-blue-600 flex items-center justify-center text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

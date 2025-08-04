import { User, LogIn, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/Avatar";

interface AvatarDropdownProps {
  user: any;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const AvatarDropdown = ({
  user,
  onLogout,
  isLoggingOut,
}: AvatarDropdownProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-9 w-9 rounded-full ring-2 ring-transparent bg-transparent hover:bg-transparent hover:ring-white/30 transition-all duration-200">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.photoURL || ""}
              alt={user?.displayName || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold text-sm">
              {user?.displayName ? (
                user.displayName.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-gray-800/95 backdrop-blur-sm border-purple-800/30 text-white"
        align="end"
        forceMount
      >
        {user ? (
          <>
            <div className="flex flex-col space-y-1 p-3">
              <p className="text-sm font-semibold leading-none text-white">
                {user.displayName || "Pokemon Trainer"}
              </p>
              <p className="text-xs leading-none text-white/60">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-purple-800/30" />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-white focus:text-white focus:bg-gray-800/70"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => navigate("/login")}
            className="cursor-pointer text-white focus:text-white focus:bg-gray-800/70"
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

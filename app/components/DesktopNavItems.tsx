import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/NavigationMenu";
import { navigationItems } from "@/shared/config/navigationItem.config";

export const DesktopNavItems = () => (
  <div className="hidden md:flex">
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => {
          return (
            <NavigationMenuItem className="flex items-center" key={item.label}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.href}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white disabled:pointer-events-none disabled:opacity-50 transition-colors"
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);

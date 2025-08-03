import { Home, Search, Heart } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  protected?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Pokemon",
    href: "/pokemon",
    icon: Search,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
    protected: true,
  },
];

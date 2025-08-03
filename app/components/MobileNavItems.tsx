import { Link } from "react-router";
import { Button } from "@components/Button";
import { navigationItems } from "@/shared/config/navigationItem.config";

interface MobileNavItemsProps {
  onNavigate: () => void;
}

export const MobileNavItems = ({ onNavigate }: MobileNavItemsProps) => (
  <div className="flex flex-col space-y-1 mt-6">
    {navigationItems.map((item) => {
      const Icon = item.icon;
      return (
        <Button
          key={item.label}
          asChild
          variant="ghost"
          className="justify-start h-12 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Link to={item.href} onClick={onNavigate}>
            <Icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        </Button>
      );
    })}
  </div>
);

import { AppNavigation } from "@/components/AppNavigation";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <AppNavigation />
      <Outlet />
    </div>
  );
}

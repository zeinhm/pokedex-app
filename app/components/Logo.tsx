import { Link } from "react-router";

export const Logo = () => (
  <Link to="/" className="flex items-center space-x-3 group">
    <div className="relative">
      <div className="h-9 w-9 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
        <span className="text-white font-bold text-lg">P</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>
    <span className="text-lg font-bold text-white">Pokedex</span>
  </Link>
);

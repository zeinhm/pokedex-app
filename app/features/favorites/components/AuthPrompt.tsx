import { User, LogIn } from "lucide-react";
import { Link } from "react-router";

export function AuthPrompt() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700/50">
        <div className="text-center mb-6">
          <User className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Login to save favorites
          </h3>
          <p className="text-gray-400 text-sm">
            Create an account or Login to start building your Pokemon collection
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/login"
            className="w-full bg-blue-600 flex items-center justify-center text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

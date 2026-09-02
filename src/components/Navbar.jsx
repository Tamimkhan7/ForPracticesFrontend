import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-gray-900">
        ForPractices
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <>
            <span className="text-gray-500">
              {user?.email || user?.unique_name || user?.name || "Logged in"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

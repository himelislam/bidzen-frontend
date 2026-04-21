import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-white tracking-tight"
          >
            <span className="text-purple-400">Bid</span>Zen
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">

            {isAuthenticated && (
              <Link className="nav-item" to="/auctions">
                Explore
              </Link>
            )}

            {isAuthenticated && user?.role === "buyer" && (
              <>
                <Link className="nav-item" to="/buyer/dashboard">Dashboard</Link>
                <Link className="nav-item" to="/my-bids">My Bids</Link>
              </>
            )}

            {isAuthenticated && user?.role === "seller" && (
              <>
                <Link className="nav-item" to="/seller/dashboard">Dashboard</Link>
                <Link className="nav-item" to="/seller/create">Create</Link>
                <Link className="nav-item" to="/seller/listings">Listings</Link>
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link className="nav-item" to="/admin/dashboard">Admin</Link>
                <Link className="nav-item" to="/admin/users">Users</Link>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-slate-300">
                  {user?.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-md border border-white/10
                             text-slate-300 hover:text-red-400 hover:border-red-500
                             transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-item" to="/login">Login</Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:opacity-90 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* styles */}
      <style>{`
        .nav-item {
          font-size: 14px;
          color: #cbd5e1;
          transition: 0.2s;
        }
        .nav-item:hover {
          color: #a78bfa;
        }
      `}</style>
    </nav>
  );
}
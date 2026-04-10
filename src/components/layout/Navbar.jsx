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
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              BidZen
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/auctions" 
                  className="text-muted-foreground hover:text-foreground"
                >
                  Explore
                </Link>
                
                {user?.role === "buyer" && (
                  <Link 
                    to="/my-bids" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    My Bids
                  </Link>
                )}
                
                {user?.role === "seller" && (
                  <Link 
                    to="/dashboard" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                )}
                
                {user?.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleRoute from "./components/layout/RoleRoute";

// Pages
import HomePage from "./pages/public/HomePage";
import ExploreAuctionsPage from "./pages/public/ExploreAuctionsPage";
import AuctionDetailsPage from "./pages/public/AuctionDetailsPage";
import SellerProfilePage from "./pages/public/SellerProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MyBidsPage from "./pages/buyer/MyBidsPage";
import FeedbackFormPage from "./pages/buyer/FeedbackFormPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import CreateListingPage from "./pages/seller/CreateListingPage";
import EditListingPage from "./pages/seller/EditListingPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: "auctions", element: <ExploreAuctionsPage /> },
      { path: "auctions/:id", element: <AuctionDetailsPage /> },
      { path: "sellers/:id", element: <SellerProfilePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      // Authenticated — any role
      {
        element: <ProtectedRoute />,
        children: [
          // Buyer only
          {
            element: <RoleRoute allowedRoles={["buyer"]} />,
            children: [
              { path: "my-bids", element: <MyBidsPage /> },
              { path: "auctions/:id/feedback", element: <FeedbackFormPage /> },
            ],
          },
          // Seller only
          {
            element: <RoleRoute allowedRoles={["seller"]} />,
            children: [
              { path: "dashboard", element: <SellerDashboardPage /> },
              { path: "listings/create", element: <CreateListingPage /> },
              { path: "listings/:id/edit", element: <EditListingPage /> },
              // Sellers also access feedback route
              { path: "auctions/:id/feedback", element: <FeedbackFormPage /> },
            ],
          },
          // Admin only
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              { path: "admin", element: <AdminDashboardPage /> },
              { path: "admin/users", element: <UserManagementPage /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleRoute from "./components/layout/RoleRoute";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import App from "./App";

// Lazy loaded pages for better performance
const HomePage = lazy(() => import("./pages/public/HomePage"));
const ExploreAuctionsPage = lazy(() => import("./pages/public/ExploreAuctionsPage"));
const AuctionDetailsPage = lazy(() => import("./pages/public/AuctionDetailsPage"));
const SellerProfilePage = lazy(() => import("./pages/public/SellerProfilePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const MyBidsPage = lazy(() => import("./pages/buyer/MyBidsPage"));
const BuyerDashboardPage = lazy(() => import("./pages/buyer/BuyerDashboardPage"));
const FeedbackFormPage = lazy(() => import("./pages/buyer/FeedbackFormPage"));
const SellerDashboardPage = lazy(() => import("./pages/seller/SellerDashboardPage"));
const CreateListingPage = lazy(() => import("./pages/seller/CreateAuctionV2"));
const EditListingPage = lazy(() => import("./pages/seller/EditListingPage"));
const SellerListingsPage = lazy(() => import("./pages/seller/SellerListingsPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { index: true, element: <Suspense fallback={<LoadingSpinner />}><HomePage /></Suspense> },
      { path: "auctions", element: <Suspense fallback={<LoadingSpinner />}><ExploreAuctionsPage /></Suspense> },
      { path: "sellers/:id", element: <Suspense fallback={<LoadingSpinner />}><SellerProfilePage /></Suspense> },
      { path: "login", element: <Suspense fallback={<LoadingSpinner />}><LoginPage /></Suspense> },
      { path: "register", element: <Suspense fallback={<LoadingSpinner />}><RegisterPage /></Suspense> },

      // Authenticated -- any role
      {
        element: <ProtectedRoute />,
        children: [
          // Buyer only
          {
            element: <RoleRoute allowedRoles={["buyer"]} />,
            children: [
              { path: "buyer/dashboard", element: <Suspense fallback={<LoadingSpinner />}><BuyerDashboardPage /></Suspense> },
              { path: "my-bids", element: <Suspense fallback={<LoadingSpinner />}><MyBidsPage /></Suspense> },
              { path: "auctions/:id/feedback", element: <Suspense fallback={<LoadingSpinner />}><FeedbackFormPage /></Suspense> },
            ],
          },
          // Seller only
          {
            element: <RoleRoute allowedRoles={["seller"]} />,
            children: [
              { path: "seller/dashboard", element: <Suspense fallback={<LoadingSpinner />}><SellerDashboardPage /></Suspense> },
              { path: "seller/create", element: <Suspense fallback={<LoadingSpinner />}><CreateListingPage /></Suspense> },
              { path: "seller/listings", element: <Suspense fallback={<LoadingSpinner />}><SellerDashboardPage /></Suspense> },
              { path: "seller/listings/:id/edit", element: <Suspense fallback={<LoadingSpinner />}><EditListingPage /></Suspense> },
              // Sellers also access feedback route
              { path: "auctions/:id/feedback", element: <Suspense fallback={<LoadingSpinner />}><FeedbackFormPage /></Suspense> },
            ],
          },
          // Admin only
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              { path: "admin/dashboard", element: <Suspense fallback={<LoadingSpinner />}><AdminDashboardPage /></Suspense> },
              { path: "admin/users", element: <Suspense fallback={<LoadingSpinner />}><UserManagementPage /></Suspense> },
            ],
          },
        ],
      },

      // Public auction details route (must come after protected routes)
      { path: "auctions/:id", element: <Suspense fallback={<LoadingSpinner />}><AuctionDetailsPage /></Suspense> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

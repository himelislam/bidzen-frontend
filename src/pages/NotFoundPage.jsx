import { useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  // Set page title
  useEffect(() => {
    document.title = "Page Not Found - BidZen";
  }, []);

  return (
    <PageWrapper>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </PageWrapper>
  );
}

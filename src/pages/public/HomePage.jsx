import PageWrapper from "@/components/layout/PageWrapper";

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to BidZen
        </h1>
        <p className="text-lg text-muted-foreground">
          Your premier online auction platform
        </p>
      </div>
    </PageWrapper>
  );
}

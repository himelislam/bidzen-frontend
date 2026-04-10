import PageWrapper from "@/components/layout/PageWrapper";

export default function AdminDashboardPage() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="text-muted-foreground">Manage flagged auctions and users</p>
    </PageWrapper>
  );
}

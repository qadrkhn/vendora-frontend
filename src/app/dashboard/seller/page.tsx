import UserMenu from "@/components/user/UserMenu";

export default function SellerDashboardPage() {
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <UserMenu />
      </div>

      <h1 className="text-2xl font-bold">Seller Page</h1>
    </div>
  );
}

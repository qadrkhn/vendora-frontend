import UserMenu from '@/components/User/UserMenu';

export default function DashboardPage() {
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <UserMenu />
      </div>

      <h1 className="text-2xl font-bold">Dashboard Page</h1>
    </div>
  );
}

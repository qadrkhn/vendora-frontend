import ThemeToggle from '@/components/shared/theme-toggle';
import UserMenu from '@/components/user/UserMenu';

export default function Home() {
  return (
    <div className="p-5">
      {/* Top bar container */}
      <div className="flex items-center justify-end gap-x-4 mb-4">
        <UserMenu />
        <ThemeToggle />
      </div>
    </div>
  );
}

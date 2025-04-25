// React, Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Components
import Header from "@/components/dashboard/header/header";
import UserProvider from "@/components/user/UserProvider";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

// Constants
import userRoles from "@/constants/userRoles";

// Helpers
import { getServerUser } from "@/lib/auth/getServerUser";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerUser();
  if (!user || user.role !== userRoles.user.ADMIN) redirect("/");

  return (
    <UserProvider user={user}>
      <div className="w-full h-full">
        <Sidebar isAdmin />
        <div className="ml-[300px]">
          <Header />
          <div className="w-full mt-[75px] p-4">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}

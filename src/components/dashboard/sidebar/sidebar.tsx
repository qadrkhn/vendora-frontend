import { FC } from "react";

import { getServerUser } from "@/lib/auth/getServerUser";

import Logo from "@/components/shared/logo";

import UserInfo from "./user-info";
import SidebarNavAdmin from "./nav-admin";

// Menu links
import { adminDashboardSidebarOptions } from "@/constants/data";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await getServerUser();

  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 lefr-0 bottom-0">
      <Logo width="100%" height="100px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin && <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />}
    </div>
  );
};

export default Sidebar;

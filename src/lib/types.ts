export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export interface CategoryInterface {
  id: number;
  name: string;
  url?: string | null;
  image?: string | null;
  featured: boolean;
}

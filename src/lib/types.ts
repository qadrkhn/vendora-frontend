export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export interface CategoryInterface {
  id?: number;
  name?: string;
  url?: string;
  file?: { id: number; url: string } | null;
  featured?: boolean;
}

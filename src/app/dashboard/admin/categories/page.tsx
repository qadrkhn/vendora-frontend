import { Plus } from "lucide-react";

import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";

import apiRoutes from "@/constants/apiRoutes";
import { apiServer } from "@/lib/apiServer";

import { CategoryInterface } from "@/lib/types";

export default async function AdminCategoriesPage() {
  // Fetch all categories from API
  const response = await apiServer<{ data: CategoryInterface[] }>(
    apiRoutes.category.list,
    {
      query: {
        order: "desc",
        column: "name",
        phrase: "",
        per_page_items: "100",
      },
    }
  );

  const allCategories = response?.data ?? [];

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      heading="Create"
      modalChildren={<CategoryDetails />}
      filterValue="name"
      data={allCategories}
      searchPlaceholder="Search category name"
      columns={columns}
    />
  );
}

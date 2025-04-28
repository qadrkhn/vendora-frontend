"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom components
import CategoryDetails from "@/components/dashboard/forms/category-details";
import CustomModal from "@/components/dashboard/shared/custom-modal";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Types and API
import { CategoryInterface } from "@/lib/types";
import API from "@/lib/api";
import apiRoutes from "@/constants/apiRoutes";

// Toast notifications
import { toast } from "sonner";

// -----------------------------------------------
// DataTable Columns
// -----------------------------------------------
export const columns: ColumnDef<CategoryInterface>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.file?.url;

      return (
        <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Category image"
              width={1000}
              height={1000}
              className="w-40 h-40 rounded-full object-cover shadow-2xl"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-extrabold text-lg capitalize">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => <span>/{row.original.url}</span>,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <span className="text-muted-foreground flex justify-center">
        {row.original.featured ? (
          <BadgeCheck className="stroke-green-300" />
        ) : (
          <BadgeMinus />
        )}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

// -----------------------------------------------
// CellActions component
// -----------------------------------------------
interface CellActionsProps {
  rowData: CategoryInterface;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!rowData || !rowData.id) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await API.delete(`${apiRoutes.category.delete}${rowData.id}`);
      toast.success("The category has been deleted.");

      router.refresh();
      setClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open actions menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              setOpen(
                <CustomModal heading="Update">
                  <CategoryDetails data={{ ...rowData }} />
                </CustomModal>,
                async () => ({
                  rowData: await API.get(
                    `${apiRoutes.category.get}${rowData.id}`
                  ),
                })
              )
            }
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Trash size={15} />
              Delete category
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

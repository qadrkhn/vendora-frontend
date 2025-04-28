"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { CategoryInterface } from "@/lib/types";
import { CategoryFormSchema } from "@/lib/schemas";

import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import apiRoutes from "@/constants/apiRoutes";
import API from "@/lib/api";

interface CategoryDetailsProps {
  data?: CategoryInterface;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      file: data?.file ? [data.file] : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? "",
        file: data.file ? [data.file] : [],
        url: data.url ?? "",
        featured: data.featured ?? false,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    const raw = form.getValues();

    const parsed = CategoryFormSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        messages?.forEach((msg) => {
          toast.error(`${field}: ${msg}`);
        });
      });
      return;
    }

    try {
      const payload = parsed.data;

      // API call
      const response = await API.post(apiRoutes.category.create, payload, {
        headers: { Accept: "application/json" },
      });

      // Displaying success message
      toast(
        data?.id
          ? "Category has been updated."
          : `Congratulations! '${response?.data?.data?.name}' is now created.`
      );

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (err: any) {
      if (err?.response?.status === 422 && err.response.data?.errors) {
        const errors = err.response.data.errors;
        Object.entries(errors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error("Failed to save category. Please try again.");
      }
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} information`
              : "Let's create a category"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value}
                        disabled={isLoading}
                        onChange={(file) => field.onChange([file])}
                        onRemove={(url) =>
                          field.onChange(
                            field.value.filter((current) => current.url !== url)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;

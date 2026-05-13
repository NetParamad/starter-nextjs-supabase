"use client";

import { Suspense, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  searchParams: Promise<{ success?: string; error?: string; page?: string }>;
};

function NotesPageContent({ searchParams }: Props) {
  useEffect(() => {
    searchParams.then((params) => {
      if (params.success === "add") {
        toast.success("Note added successfully");
      } else if (params.success === "edit") {
        toast.success("Note updated successfully");
      } else if (params.success === "delete") {
        toast.success("Note deleted successfully");
      } else if (params.success === "login") {
        toast.success("Welcome back! Login successful.");
      } else if (params.error) {
        toast.error(params.error);
      }
    });
  }, [searchParams]);

  return null;
}

export default function NotesPageClient({ searchParams }: Props) {
  return (
    <Suspense fallback={null}>
      <NotesPageContent searchParams={searchParams} />
    </Suspense>
  );
}
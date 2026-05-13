import { Suspense } from "react";
import EditNoteContent from "./edit-note-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <EditNoteContent params={params} />
    </Suspense>
  );
}
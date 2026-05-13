import { Suspense } from "react";
import NotesList from "./notes-list";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

function NotesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            </div>
            <div className="aspect-video rounded-md bg-muted animate-pulse" />
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-0">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function NotesListContent({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  return <NotesList page={page} />;
}

export default function NotesListWrapper({ searchParams }: Props) {
  return (
    <Suspense fallback={<NotesListSkeleton />}>
      <NotesListContent searchParams={searchParams} />
    </Suspense>
  );
}
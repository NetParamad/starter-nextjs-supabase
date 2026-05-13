import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { deleteNote } from "@/lib/notes/delete";
import { Calendar, ImageIcon, Trash2, Pencil } from "lucide-react";

export default async function NotesList({
  page,
}: {
  page?: number;
}) {
  const supabase = await createClient();
  const currentPage = page || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: true })
    .range(offset, offset + limit - 1);

  const { count } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true });

  const totalPages = count ? Math.ceil(count / limit) : 1;

  if (error) {
    return (
      <p className="text-red-500">
        Failed to load notes: {error.message}
      </p>
    );
  }

  return (
    <div>
      {notes?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No notes yet. Create your first note!</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes?.map((note) => (
              <Card key={note.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">
                    {note.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content}
                  </p>

                  {note.image ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                      <Image
                        src={note.image}
                        alt={note.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>No. {note.id}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/notes/${note.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Button>
                    </Link>

                    <form action={deleteNote.bind(null, String(note.id))}>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="submit"
                        className="gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link href={`/notes?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}

              <span className="px-4 py-2 text-sm bg-muted rounded-md">
                {currentPage} / {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link href={`/notes?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { editNote } from "@/lib/notes/edite";
import { ArrowLeft, ImageIcon } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

async function getNote(id: string) {
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select()
    .eq("id", id)
    .single();

  if (error || !note) {
    return null;
  }
  return note;
}

export default async function EditNoteContent({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    redirect("/notes");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Notes
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={editNote.bind(null, id)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Enter note title"
                defaultValue={note.title}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your note here..."
                rows={6}
                defaultValue={note.content}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image
              </label>
              {note.image ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted max-w-md">
                    <img
                      src={note.image}
                      alt={note.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to keep current image. Select a new image to replace it.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="aspect-video rounded-md bg-muted flex items-center justify-center max-w-md">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No image currently. Select an image to add.
                  </p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" size="lg">
                Update Note
              </Button>
              <Link href="/notes">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
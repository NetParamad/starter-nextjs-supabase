import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { addNote } from "@/lib/notes/add";
import NotesPageClient from "./notes-page-client";
import NotesListWrapper from "./notes-list-wrapper";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; page?: string }>;
}) {
  const notesSearchParams = searchParams.then((p) => ({ page: p.page }));

  return (
    <>
      <NotesPageClient searchParams={searchParams} />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">My Notes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Add New Note</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={addNote} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Enter note title"
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
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Image (optional)
                    </label>
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      className="cursor-pointer"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Add Note
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <NotesListWrapper searchParams={notesSearchParams} />
          </div>
        </div>
      </div>
    </>
  );
}
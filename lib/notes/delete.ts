"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    redirect("/notes?error=Failed to delete note");
  }

  revalidatePath("/notes");
  redirect("/notes?success=delete");
}
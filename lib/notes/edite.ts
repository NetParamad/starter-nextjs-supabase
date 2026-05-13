"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editNote(noteId: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const newImage = formData.get("image") as File;

  const { data: existingNote } = await supabase
    .from("notes")
    .select("image")
    .eq("id", noteId)
    .single();

  let imageUrl = existingNote?.image || "";

  if (newImage && newImage.size > 0) {
    if (existingNote?.image) {
      const oldImagePath = existingNote.image.split("/").pop();
      if (oldImagePath) {
        await supabase.storage.from("images").remove([oldImagePath]);
      }
    }

    const fileName = `${randomUUID()}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, newImage);

    if (uploadError) {
      redirect(`/notes/${noteId}?error=Failed to upload image`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      image: imageUrl,
    })
    .eq("id", noteId);

  if (error) {
    redirect(`/notes/${noteId}?error=Failed to update note`);
  }

  revalidatePath("/notes");
  redirect("/notes?success=edit");
}
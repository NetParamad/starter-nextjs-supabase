"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addNote(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const image = formData.get("image") as File;

  let imageUrl = "";

  if (image && image.size > 0) {
    const fileName = `${randomUUID()}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, image);

    if (uploadError) {
      redirect("/notes?error=Failed to upload image");
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
    .insert({
      title,
      content,
      image: imageUrl,
    });

  if (error) {
    redirect("/notes?error=Failed to add note");
  }

  revalidatePath("/notes");
  redirect("/notes?success=add");
}
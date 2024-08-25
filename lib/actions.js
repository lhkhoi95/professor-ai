"use server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchBookmarks() {
  const userEmail = (await currentUser()).primaryEmailAddress?.emailAddress;

  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    const data = await sql`SELECT * FROM professors WHERE email = ${userEmail}`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function saveProfessor(professorData, formData) {
  const {
    id: professorId,
    name,
    department,
    school,
    wouldTakeAgain,
    difficultyLevel,
    analysis,
  } = professorData;
  const { summary, pros, cons, recommendation } = analysis;
  const userEmail = (await currentUser()).primaryEmailAddress?.emailAddress;
  const sanitizedDifficultyLevel = difficultyLevel
    ? difficultyLevel + " / 5"
    : "N/A";

  try {
    // Check if professor already exists
    const existingProfessor = await sql`
      SELECT * FROM professors WHERE professor_id = ${professorId} AND email = ${userEmail};
    `;
    if (existingProfessor.rowCount > 0) {
      // Update existing professor
      await sql`UPDATE professors SET summary = ${summary}, pros = ${pros}, cons = ${cons}, recommendation = ${recommendation} WHERE professor_id = ${professorId} AND email = ${userEmail};`;
    } else {
      // Insert new professor
      await sql`
      INSERT INTO professors (professor_id, name, department, school, would_take_again, difficulty_level, summary, pros, cons, recommendation, email)
      VALUES (${professorId}, ${name}, ${department}, ${school}, ${wouldTakeAgain}, ${sanitizedDifficultyLevel}, ${summary}, ${pros}, ${cons}, ${recommendation}, ${userEmail});
    `;
    }

    revalidatePath("/bookmarks");
    return { message: "Professor inserted" };
  } catch (err) {
    console.error(err);
    throw new Error("Error saving professor");
  }
}

export async function deleteProfessor(rowId, formData) {
  const userEmail = (await currentUser()).primaryEmailAddress?.emailAddress;
  try {
    await sql`DELETE FROM professors WHERE id = ${rowId} AND email = ${userEmail}`;
    revalidatePath("/bookmarks");
    return { message: "Professor deleted" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete professor.");
  }
}

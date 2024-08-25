import { columns } from "./columns";
import { DataTable } from "./data-table";
import { fetchBookmarks } from "@/lib/actions";

export default async function Bookmarks() {
  const bookmarks = await fetchBookmarks();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Bookmarks</h1>
      <DataTable columns={columns} data={bookmarks} />
    </div>
  );
}

import NotesFilter, { NotesFilterType } from "./notes-filters";
import { notesGetGroupsService } from "@/service/notes/noteService";

export default async function NotesFilterGroups() {
  const groups: NotesFilterType[] = await notesGetGroupsService();

  return (
    <div>
      <NotesFilter groups={groups} />
    </div>
  );
}

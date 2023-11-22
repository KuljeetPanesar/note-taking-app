import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

/* types are for the ref info for the notes, defines everything included in each type  */
export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

// RawNote just storing the id, not the tags - incase the tags are changed
// tagIds are array of strings, stored id of tags. check tag array and will get correct value

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
  /* storing state for notes and tags, called notes and tags*/

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note, // all of the note object
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      }; // loop through notes, keep all info and get tags related to each note by id
    });
  }, [notes, tags]); // only running each time notes/tags are updated
  // converting raw note into actual note

  function onCreateNote({ tags, ...data }: NoteData) {
    // taking in note data to create a note
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) }, // uuid is library that is installed - created string based id thats always unique
      ]; // converting to raw note and keeping all old notes and new one created
    });
  } // saves inside note array (first const)

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      {/*bootstap spacing for margins*/}
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        {/*functinality of submitting new note*/}
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          {/* specific id in url eg /1 or /2 */}
          <Route index element={<Note onDelete={onDeleteNote} />} />{" "}
          {/* show page for the added element (note)*/}
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />{" "}
          {/*edit page for the specific note*/}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/*this will navigate to home page when url is not already defined*/}
      </Routes>
    </Container>
  );
}

export default App;

import { useRef, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { format, formatDistance } from "date-fns";
import { NoteTypes } from "../../types/types";

export default function Notes({ getUserid }: { getUserid: string }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState({
    edit: false,
    id: "",
    content: "",
    title: "",
  });
  const [parent] = useAutoAnimate();

  const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (res.status === 401) {
      const error = new Error("Not authorized");
      throw error;
    }

    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    `http://localhost:3000/api/getuser/${getUserid}`,
    fetcher
  );

  function handlePostNote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = titleRef.current?.value;
    const content = contentRef.current?.value;

    axios
      .post(`http://localhost:3000/api/notes_routes/post/${getUserid}`, {
        title,
        content,
      })
      .then((res) => {
        mutate();
      });
  }

  function handleDelete(noteId: string) {
    axios
      .delete(`http://localhost:3000/api/notes_routes/delete/${noteId}`)
      .then(() => {
        mutate();
      });
  }

  function handleEdit(id: string, title: string, content: string) {
    axios
      .put(`http://localhost:3000/api/notes_routes/put/${id}`, {
        title,
        content,
      })
      .then(() => {
        mutate();
        setIsEditing({ edit: false, id: "", content: "", title: "" });
      });
  }

  if (isLoading) return <div>loading...</div>;
  if (error)
    return (
      <div>
        error:
        {error.message}
      </div>
    );
  return (
    <div className="container">
      <header
        style={{
          textAlign: "center",
          marginTop: "1rem",
          fontSize: "2rem",
        }}
      >
        Display Notes
      </header>
      <div ref={parent} className="grid">
        {data.notes.length > 0 ? (
          data.notes.map((note: NoteTypes) => (
            <article key={note.id}>
              <hgroup>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </hgroup>
              <div>
                Created At: {format(new Date(note.createdAt), "yyyy-MM-dd")}
              </div>

              <div
                onClick={() => {
                  handleDelete(note.id as string);
                }}
              >
                Delete
              </div>
              <div
                onClick={() => {
                  setIsEditing({
                    edit: true,
                    id: note.id as string,
                    content: note.content,
                    title: note.title,
                  });
                }}
              >
                Edit
              </div>
              {note.updatedAt && (
                <small>
                  Last Update:{" "}
                  {formatDistance(new Date(note.updatedAt), new Date())}
                </small>
              )}
            </article>
          ))
        ) : (
          <h4>Not Notes Yet</h4>
        )}
      </div>
      <div className="grid">
        <form onSubmit={handlePostNote}>
          <input type="text" placeholder="Title" ref={titleRef} />
          <input type="text" placeholder="Content" ref={contentRef} />
          <button type="submit">Submit</button>
        </form>
        {isEditing.edit && (
          <div>
            <input
              type="text"
              placeholder="Title"
              value={isEditing.title}
              onChange={(e) => {
                setIsEditing({ ...isEditing, title: e.target.value });
              }}
            />
            <input
              type="text"
              placeholder="Content"
              value={isEditing.content}
              onChange={(e) => {
                setIsEditing({ ...isEditing, content: e.target.value });
              }}
            />
            <div className="grid">
              <button
                onClick={() =>
                  handleEdit(isEditing.id, isEditing.title, isEditing.content)
                }
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setIsEditing({ edit: false, id: "", content: "", title: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const { user_url } = ctx.query;

  return {
    props: { getUserid: user_url },
  };
}

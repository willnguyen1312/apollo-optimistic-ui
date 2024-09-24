import { gql, useMutation, useQuery } from "@apollo/client";
import { Post } from "./types";
import { useState } from "react";

const query = gql`
  query ListPosts {
    posts {
      id
      title
    }
  }
`;

const mutation = gql`
  mutation EditPost($id: ID!, $title: String!) {
    editPost(id: $id, title: $title) {
      id
      title
    }
  }
`;

function EditablePost({
  post,
  refetch,
}: {
  post: Post;
  refetch: ReturnType<typeof useQuery>["refetch"];
}) {
  const [editPost, { loading }] = useMutation(mutation);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <p>Value: {post.title}</p>

      {!isEditing && (
        <button
          onClick={() => {
            setIsEditing(true);
          }}
          disabled={loading}
        >
          Edit
        </button>
      )}

      {isEditing && (
        <input
          autoFocus
          className="border border-gray-300 rounded p-1"
          type="text"
          defaultValue={post.title}
          onKeyDown={async (event) => {
            const newTitle = (event.target as HTMLInputElement).value;
            if (event.key !== "Enter" || !newTitle) return;

            setIsEditing(false);

            await editPost({
              variables: { id: post.id, title: newTitle },
            });

            // refetch();
          }}
        />
      )}

      {loading && <p>Updating...</p>}
    </div>
  );
}

function App() {
  const { data, refetch } = useQuery<{ posts: Post[] }>(query);

  return (
    <main className="p-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Post</h1>
        <div className="flex flex-col">
          {data?.posts.map((post) => (
            <EditablePost key={post.id} post={post} refetch={refetch} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;

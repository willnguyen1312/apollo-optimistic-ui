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

function EditablePost({ post }: { post: Post }) {
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
              // refetchQueries: [query],
              variables: { id: post.id, title: newTitle },
              // update: (cache, { data }) => {
              // cache.writeQuery({
              //   query,
              //   data: {
              //     posts: [
              //       {
              //         ...post,
              //         title: newTitle,
              //       },
              //     ],
              //   },
              // });
              //   const id = cache.identify(post);
              //   cache.modify({
              //     id,
              //     fields: {
              //       title() {
              //         return newTitle;
              //       },
              //     },
              //   });
              // },
              // optimisticResponse: (_: any, context: any) => {
              //   if (newTitle === "ignore") {
              //     return context.IGNORE;
              //   }

              //   return {
              //     editPost: {
              //       id: post.id,
              //       title: newTitle,
              //       __typename: "Post",
              //     },
              //   };
              // },
            });
          }}
        />
      )}

      {loading && <p>Updating...</p>}
    </div>
  );
}

function App() {
  const { data } = useQuery<{ posts: Post[] }>(query);

  return (
    <main className="p-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Post</h1>
        <div className="flex flex-col">
          {data?.posts.map((post) => (
            <EditablePost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;

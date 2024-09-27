import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Post } from "./types";
import { useState } from "react";

const query = gql`
  query ListPosts {
    posts {
      title
      star
    }
  }
`;

const mutation = gql`
  mutation EditPost($id: ID!, $title: String!, $star: Int!) {
    editPost(id: $id, title: $title, star: $star) {
      title
      star
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
  const apolloClient = useApolloClient();
  const [editPost, { loading }] = useMutation(mutation, {
    refetchQueries: [query],
  });
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <p>Title: {post.title}</p>
      <p>Star: {post.star}</p>

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

            // const existingPosts = apollOClient.readQuery<{ posts: Post[] }>({
            //   query,
            // });

            const posts = [
              {
                ...post,
                title: newTitle,
              },
            ];

            // const updatedPosts = existingPosts?.posts.map((p) => {
            //   if (p.id === post.id) {
            //     return { ...p, title: newTitle };
            //   }
            //   return p;
            // });

            // apolloClient.writeQuery({
            //   query,
            //   data: {
            //     posts,
            //   },
            // });

            const result = await editPost({
              variables: { id: post.id, title: newTitle, star: post.star },
              // optimisticResponse: {
              //   editPost: {
              //     id: post.id,
              //     title: newTitle,
              //     __typename: "Post",
              //   },
              // },
            });

            apolloClient.writeQuery({
              query,
              data: {
                posts: [result.data.editPost],
              },
            });

            // refetch();
          }}
        />
      )}

      {/* {loading && <p>Updating...</p>} */}
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
            <EditablePost key={post.title} post={post} refetch={refetch} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;

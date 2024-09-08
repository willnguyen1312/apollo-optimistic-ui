import { gql, useQuery } from "@apollo/client";
import { Post } from "./types";

const query = gql`
  query ListPosts {
    posts {
      id
      title
    }
  }
`;

function App() {
  const { data } = useQuery<{ posts: Post[] }>(query);

  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {data?.posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;

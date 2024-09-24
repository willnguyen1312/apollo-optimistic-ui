import { graphql as executeGraphQL, buildSchema } from "graphql";
import { graphql, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

import { Post } from "../types";

const schema = buildSchema(`
  type Post {
    id: ID!
    title: String!
  }
 
  type Query {
    posts: [Post!]
  }
`);

const allPosts: Post[] = Array.from({ length: 1 }, () => ({
  id: faker.string.uuid(),
  title: faker.lorem.word(),
}));

let waitTime = 3000;

export const handlers = [
  // query
  graphql.query("ListPosts", async ({ query, variables }) => {
    // Wait 1s
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
    const { errors, data } = await executeGraphQL({
      schema,
      source: query,
      variableValues: variables,
      rootValue: {
        posts: Array.from(allPosts.values()),
      },
    });

    return HttpResponse.json({ errors, data });
  }),
  //   mutation
  graphql.mutation("EditPost", async ({ variables }) => {
    const { id, title } = variables as Post;
    const post = allPosts.find((post) => post.id === id);

    if (!post) {
      return HttpResponse.json(
        { errors: [{ message: `Post with ID "${id}" not found.` }] },
        { status: 404 }
      );
    }

    await new Promise((resolve) => {
      setTimeout(resolve, waitTime);
      waitTime -= 1500;
    });

    if (title.includes("error")) {
      return HttpResponse.json(
        { errors: [{ message: "Failed to update the post." }] },
        { status: 500 }
      );
    }

    post.title = title;
    return HttpResponse.json({
      data: {
        editPost: {
          // id: post.id,
          title: post.title,
          __typename: "Post",
        },
      },
    });
  }),
];

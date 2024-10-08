import { graphql as executeGraphQL, buildSchema } from "graphql";
import { graphql, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

import { Post } from "../types";

const schema = buildSchema(`
  type Post {
    title: String!
    star: Int!
  }
 
  type Query {
    posts: [Post!]
  }
`);

const allPosts: Post[] = Array.from({ length: 1 }, () => ({
  id: faker.string.uuid(),
  title: faker.lorem.word(),
  star: faker.number.int({ min: 1, max: 5 }),
}));

let waitTime = 2000;

export const handlers = [
  // query
  graphql.query("ListPosts", async ({ query, variables }) => {
    // Wait 1s
    await new Promise((resolve) => {
      setTimeout(resolve, waitTime);
    });
    const { errors, data } = await executeGraphQL({
      schema,
      source: query,
      variableValues: variables,
      rootValue: {
        posts: Array.from(allPosts.values()).map((p) => {
          return {
            // id: p.id,
            title: p.title,
            star: p.star,
            __typename: "Post",
          };
        }),
      },
    });

    return HttpResponse.json({ errors, data });
  }),
  //   mutation
  graphql.mutation("EditPost", async ({ variables }) => {
    const { id, title, star } = variables as Post;
    const post = allPosts.find((post) => post.id === id);

    await new Promise((resolve) => {
      setTimeout(resolve, waitTime);
      waitTime -= 1500;
    });

    return HttpResponse.json({
      data: {
        editPost: {
          // id: post.id,
          title,
          star,
          __typename: "Post",
        },
      },
    });

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
    post.star += 1;
    return HttpResponse.json({
      data: {
        editPost: {
          // id: post.id,
          title: post.title,
          star: post.star,
          __typename: "Post",
        },
      },
    });
  }),
];

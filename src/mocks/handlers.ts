import { faker } from "@faker-js/faker";
import { graphql, HttpResponse } from "msw";
import { Post } from "../types";

const allPosts: Post[] = Array.from({ length: 2 }, () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
}));

export const handlers = [
  graphql.query("ListPosts", async () => {
    return HttpResponse.json({ data: { posts: allPosts } });
  }),
];

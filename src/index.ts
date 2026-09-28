import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Schema: describes the shape of your API
const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;

// Fake in-memory data for now (we'll swap in Prisma later)
const books = [
  { id: "1", title: "The Pragmatic Programmer", author: "Andrew Hunt" },
  { id: "2", title: "Clean Code", author: "Robert C. Martin" },
];

// Resolvers: the functions that produce the data for each field
const resolvers = {
  Query: {
    books: () => books,
    book: (_: unknown, args: { id: string }) =>
      books.find((b) => b.id === args.id),
  },
  Mutation: {
    addBook: (_: unknown, args: { title: string; author: string }) => {
      const book = { id: String(books.length + 1), ...args };
      books.push(book);
      return book;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Server ready at ${url}`);

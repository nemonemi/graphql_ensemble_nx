import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {loadSchemaSync} from "@graphql-tools/load";
import {addResolversToSchema} from "@graphql-tools/schema";
import {datatype} from "faker";

const schemaDef = loadSchemaSync('./apps/author/src/app/authors.graphql', {
  loaders: [new GraphQLFileLoader()],
});

// Data store //
let authors = [
  { id: '1', name: "Robert Jordan", booksIds: [1, 2] },
  { id: '2', name: "Stephen King", booksIds: [10, 11, 12] },
];

const resolvers = {
  Query: {
    authors: () => {
      return authors.map(({ booksIds, ...rest }) => rest);
    },
    author: (_, { id }) => {
      if (!id) throw new Error(`Missing mandatory property id: ${id}`);

      // @ts-ignore // booksIds might be accessed from undefined due to the find method, but at the moment we don't care about it
      const { booksIds, ...rest } = authors.find(
        (author) => Number(author.id) === Number(id)
      );

      console.log("Author ID: ", id);
      console.log("Authors: ", authors);
      console.log("Found author: ", rest);

      return rest;
    },
  },

  Mutation: {
    createAuthor: (_, { authorCreateInput }) => {
      if (!authorCreateInput)
        throw new Error(`Missing authorCreateInput: ${authorCreateInput}`);

      const newAuthor = {
        id: datatype.uuid(),
        name: authorCreateInput.name,
        booksIds: authorCreateInput.booksIds,
      };
      console.log("Author create input: ", authorCreateInput);
      console.log("New author: ", newAuthor);
      authors.push(newAuthor);
      return newAuthor;
    },

    updateAuthor: (_, { id, authorUpdateInput }) => {
      if (!id) throw new Error(`Missing mandatory property id: ${id}`);
      console.log("updateAuthor: ", id, authorUpdateInput);

      authors = authors.map((author) => {
        if (Number(author.id) === Number(id)) {
          return { ...author, ...authorUpdateInput };
        }
        return author;
      });

      return authors.find((author) => Number(author.id) === Number(id));
    },
  },
};

export default addResolversToSchema({
  schema: schemaDef,
  resolvers,
});

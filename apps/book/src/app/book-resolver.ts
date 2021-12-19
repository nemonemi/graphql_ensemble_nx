import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {loadSchemaSync} from "@graphql-tools/load";
import {addResolversToSchema} from "@graphql-tools/schema";

const schemaDef = loadSchemaSync("./apps/book/src/app/books.graphql", {
  loaders: [new GraphQLFileLoader()],
});


// Data store
const books = [
  {
    __typename: "Book",
    id: 1,
    authorId: 1,
    title: "The Conan Chronicles",
    numberOfPages: 500,
    coverType: "Soft",
    releaseYear: "2021-06-17T08:32:11.163Z",
    itemsSold: 2039123,
    size: "A5",
  },
  {
    __typename: "Book",
    id: 2,
    authorId: 1,
    title: "The Wheel of Time",
    numberOfPages: 500,
    coverType: "Soft",
    releaseYear: "2021-06-17T08:32:11.163Z",
    itemsSold: 2039123,
    size: "A5",
  },
  {
    __typename: "Book",
    id: 10,
    authorId: 2,
    title: "IT",
    numberOfPages: 500,
    coverType: "Soft",
    releaseYear: "2021-06-17T08:32:11.163Z",
    itemsSold: 2039123,
    size: "A5",
  },
  {
    __typename: "Book",
    id: 11,
    authorId: 2,
    title: "The Stand",
    numberOfPages: 500,
    coverType: "Soft",
    releaseYear: "2021-06-17T08:32:11.163Z",
    itemsSold: 2039123,
    size: "A5",
  },
  {
    __typename: "Book",
    id: 12,
    authorId: 2,
    title: "11/22/63",
    numberOfPages: 500,
    coverType: "Soft",
    releaseYear: "2021-06-17T08:32:11.163Z",
    itemsSold: 2039123,
    size: "A5",
  },
] as const;

const resolvers = {
  Query: {
    books: () => books.map(({ authorId, ...rest }) => rest),

    book: (_, { id }) => {
      console.log("Book Id: ", id);
      const bookSearchResult = books.find((book) => book.id === Number(id));

      console.log("Book search result: ", bookSearchResult);
      if (!bookSearchResult) {
        return {
          __typename: "BookDoesNotExistError",
          message: "Well fuck",
        };
      }

      return bookSearchResult;
    },
    author: (_, { id }) => {
      console.log("Author Id: ", id);
      console.log(
        "Found books: ",
        books.filter((book) => book.authorId === Number(id))
      );

      return {
        id,
        books: books.filter((book) => book.authorId === Number(id)),
      };
    },
  },
};

export default addResolversToSchema({
  schema: schemaDef,
  resolvers,
});


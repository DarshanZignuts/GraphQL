/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful,
 * such as when you deploy to a server, or a PaaS like Heroku.
 *
 * For example:
 *   => `node app.js`
 *   => `npm start`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *
 * The same command-line arguments and env vars are supported, e.g.:
 * `NODE_ENV=production node app.js --port=80 --verbose`
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/app.js
 */

// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

const { ApolloServer, gql } = require("apollo-server");
const {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  buildSchema,
} = require("graphql");

// Attempt to import `sails` dependency, as well as `rc` (for loading `.sailsrc` files).
var sails;
var rc;
try {
  sails = require("sails");
  rc = require("sails/accessible/rc");

  const typeDefs = `
  type Query {
    author(id: String, populate: CustomJson): author
    authors(where: CustomJson, sort: String, skip: Int, limit: Int, populate: CustomJson, aggregate: CustomJson): [author]
    book(id: String!, populate: CustomJson): book
    books(where: CustomJson, sort: String, skip: Int, limit: Int, populate: CustomJson, aggregate: CustomJson): [book]
    count(modelName: String!, where: CustomJson): count
    sum(modelName: String!, where: CustomJson, field: String!): sum
    avg(modelName: String!, where: CustomJson, field: String!): avg
  }
  
  type author {
    createdAt: Float
    updatedAt: Float
    id: String
    name: String!
    country: String
  }
  
  """CustomJson scalar type"""
  scalar CustomJson
  
  type book {
    createdAt: Float
    updatedAt: Float
    id: String
    title: String!
    yearPublished: String!
    genre: String
    author: author
    }

  type count {
    """return count of specific fields"""
    count: Int
  }

  type sum {
    """return sum of specific fields"""
    sum: Int
  }

  type avg {
    """return avg of specific fields"""
    avg: Int
  }
  
  type Mutation {
    createAuthor(createdAt: Float, updatedAt: Float, name: String!, country: String): author
    updateAuthor(createdAt: Float, updatedAt: Float, id: String!, name: String, country: String): author
    deleteAuthor(id: String!): author
    createBook(createdAt: Float, updatedAt: Float, title: String!, yearPublished: String!, genre: String!, author: String!): book
    updateBook(createdAt: Float, updatedAt: Float, id: String!, title: String, yearPublished: String, genre: String): book
    deleteBook(id: String!): book
  }`;

  const resolvers = {
    Query: {
      async author(parent, args, context, info) {
        const data = await Author.findOne({ id: args.id }).populate("books");
        return data;
      },
      async authors(parent, args, context, info) {
        const data = await Author.find().populate("books");
        return data;
      },
      async book(parent, args, context, info) {
        const data = await Book.findOne({ id: args.id }).populate("author");
        return data;
      },
      async books(parent, args, context, info) {
        const data = await Book.find().populate("author");
        return data;
      }
    },
    Mutation: {

      async createAuthor(parent, args, context, info) {
        const createNew = await Author.create({
          name : args.name,
          country: args.country,
        }).fetch();
        return createNew;
      },

      async updateAuthor(parent, args, context, info) {
        console.log('UPATE::: ', args.id);
        const update = await Author.updateOne({id: args.id},{
          name : args.name,
          country: args.country,
        });

        return update;
      },
      
      async deleteAuthor(parent, args, context, info) {
        console.log('delete::: ', args.id);
        const deleteData = await Author.destroy({id: args.id});

        return deleteData;
      },
      async createBook(parent, args, context, info) {
        const createNew = await Book.create({
          title : args.title,
          yearPublished : args.yearPublished,
          genre : args.genre,
          author: args.author,
        }).fetch();
        return createNew;
      },
    }
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen({ port: 9000 }).then(({ url }) =>
    console.log(`
    Server Running on ${url}
    █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ 
    `)
  );
} catch (err) {
  // console.error("Encountered an error when attempting to require('sails'):");
  // console.error(err.stack);
  console.error(err);
  // console.error("--");
  // console.error(
  //   "To run an app using `node app.js`, you need to have Sails installed"
  // );
  // console.error(
  //   "locally (`./node_modules/sails`).  To do that, just make sure you're"
  // );
  // console.error("in the same directory as your app and run `npm install`.");
  // console.error();
  // console.error(
  //   "If Sails is installed globally (i.e. `npm install -g sails`) you can"
  // );
  // console.error(
  //   "also run this app with `sails lift`.  Running with `sails lift` will"
  // );
  // console.error(
  //   "not run this file (`app.js`), but it will do exactly the same thing."
  // );
  // console.error(
  //   "(It even uses your app directory's local Sails install, if possible.)"
  // );
  return;
} //-•

// Start server
sails.lift(rc("sails"));

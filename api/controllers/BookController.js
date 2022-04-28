/**
 * BookController
 * query{
    message,
    author{
        name,country
    }
}
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

// const data = Author.find();

/**
 * @param {*} req
 * @param {*} res
 * @description
 * @author `DARSHAN ZignutsTechnolab`
 */
const data = async function (req, res) {
  try {
    const data = await Book.find().populate("author");
    // const data = await Author.find();
    return data;
  } catch (err) {
    return res.status(400).json({
      msg: "Something went wrong!",
    });
  }
};

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "helloWorld",
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "HeeloWorld",
//       },
//     }),
//   }),
// });

const authType = new GraphQLObjectType({
  name: "DATAauthor",
  description: "this have Info WIth name And age",
  fields: () => ({
    name: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
});

const InfoType = new GraphQLObjectType({
  name: "DATA",
  description: "this have Info WIth name And age",
  fields: () => ({
    title: { type: GraphQLString },
    yearPublished: { type: GraphQLInt },
    genre: { type: GraphQLString },
    author: {
      type: authType,
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "FULLDATA",
  description: "Detail About Person",
  fields: () => ({
    message: {
      type: GraphQLString,
      resolve: () => "HeeloWorld",
    },
    author: {
      type: new GraphQLList(InfoType),
      description: "deatil aboutall person",
      resolve: () => data(),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = {
  /**
   * @param {*} req
   * @param {*} res
   * @description
   * @author `DARSHAN ZignutsTechnolab`
   */
  check: expressGraphQL({
    schema: schema,
    graphiql: true,
  }),

  /**
   * @param {*} req
   * @param {*} res
   * @description
   * @author `DARSHAN ZignutsTechnolab`
   */
  createbook: async function (req, res) {
    try {
      console.log(":::");
      const { title, yearPublished, genre } = req.body;

      let author = "62693b2e8f23b861f1e470d8";
      //   let data  = await Author.find();

      const createNew = await Book.create({
        title,
        yearPublished,
        genre,
        // author: data[0].id,
        author,
      }).fetch();
      return res.json({
        data: createNew,
      });
    } catch (err) {
      console.log("errr:: ", err);
      return res.status(400).json({
        msg: "Something went wrong!",
      });
    }
  },
  /**
   * @param {*} req
   * @param {*} res
   * @description
   * @author `DARSHAN ZignutsTechnolab`
   */
  createauthor: async function (req, res) {
    try {
      const { name, country } = req.body;
      const createNew = await Author.create({
        name,
        country,
      }).fetch();
      return res.json({
        data: createNew,
      });
    } catch (err) {
      return res.status(400).json({
        msg: "Something went wrong!",
      });
    }
  },
};

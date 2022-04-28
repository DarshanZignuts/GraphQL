module.exports = {
  friendlyName: "Graphql POST endpoint",

  description: "All Graphql",

  inputs: {},

  exits: {
    success: {
      description: "All Graphql",
    },
  },

  fn: async function (inputs, exits) {
    sails.config.graphql(this.req, this.res); //<<< Important part
  },
};

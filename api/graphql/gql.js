/**
 * GQLController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async getAuthor(id) {
    console.log("heyyy");
    console.log("inside ::: ", id);
    const data = await Author.find({ id }).populate("books");
    return data;
  },

  async createAuthor(name, country) {
    const createNew = await Book.create({
      title,
      yearPublished,
      genre,
      // author: data[0].id,
      author,
    }).fetch();

    return createNew;
  },

  updateAuthor(id, name, country) {},

  deleteAuthor(id) {},

  createBook(title, yearPublished, genre) {},

  updateBook(id, title, yearPublished, genre) {},

  deleteBook(id) {},
};

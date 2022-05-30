import { Factory } from "miragejs";

export default Factory.extend({
  name() {
    return "Test";
  },

  image() {
    return "perception";
  },

  afterCreate(artPiece, server) {
    server.createList("art-edition", 2, { artPiece: artPiece });
  },
});

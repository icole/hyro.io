import { Factory } from "miragejs";

export default Factory.extend({
  name() {
    return "Test";
  },

  image() {
    return "perception";
  },

  afterCreate(artPiece, server) {
    server.create("art-edition", { artPiece: artPiece });
  },
});

export default function (server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  let gallery = server.create("gallery");
  server.create("art-piece", { gallery: gallery });
  server.create("user");
}

import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "hyro/config/environment";

class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
  // engines: {
  //   galleryDisplay: {
  //     dependencies: {
  //       services: ["layout", "current-user", "store", "asset-map", "socket-io"],
  //     },
  //   },
  // },
}

loadInitializers(App, config.modulePrefix);

export default App;

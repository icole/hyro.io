import { Factory } from "miragejs";

export default Factory.extend({
  name() {
    return "Test Gallery";
  },
  location() {
    return "Seattle, WA";
  },
  description() {
    return "This is a test gallery";
  },
});

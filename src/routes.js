
import Objects from "./views/Objects/index.js";
import Schemas from "./views/Schemas/index.js";

var routes = [
  {
    path: "/",
    hidden: true,
    layout: "/home",
    component: Schemas,
  },
  {
    path: "/scores",
    layout: "/home",
    name: "Schemas",
    component: Schemas,
    icon: "tim-icons icon-atom",
  },
  {
    path: "/objects",
    layout: "/home",
    name: "Objects",
    component: Objects,
    icon: "tim-icons icon-atom",
  }
];

export default routes;
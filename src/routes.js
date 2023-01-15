
import Objects from "./views/Objects/index.js";
import Dashboard from "./views/Dashboard/index.js";

var routes = [
  {
    path: "/",
    hidden: true,
    layout: "/home",
    component: Dashboard,
  },
  {
    path: "/scores",
    layout: "/home",
    name: "Dashboard",
    component: Dashboard,
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
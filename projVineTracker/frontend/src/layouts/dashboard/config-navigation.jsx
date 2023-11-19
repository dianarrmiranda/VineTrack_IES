import { Route } from "react-router-dom";
import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const user = JSON.parse(localStorage.getItem("user"));
console.log(user);

const navConfig = [
  {
    title: "Overview",
    path: "/",
    icon: icon("ic_analytics"),
  },
  // {
  //   title: "user",
  //   path: "/user",
  //   icon: icon("ic_user"),
  // },
  {
    title: "Vines",
    path: "/vines",
    icon: icon("ic_vine"),
  },

];


if (user != null && user.length !== 0) {
  navConfig.push({
    title: "logout",
    path: "/login",
    icon: icon("ic_lock"),
  });
}

export default navConfig;

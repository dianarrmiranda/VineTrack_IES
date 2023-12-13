import { Route } from "react-router-dom";
import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

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

export default navConfig;

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
  {
    title: "login",
    path: "/login",
    icon: icon("ic_lock"),
  },
  {
    title: "Not found",
    path: "/404",
    icon: icon("ic_disabled"),
  },
];

export default navConfig;
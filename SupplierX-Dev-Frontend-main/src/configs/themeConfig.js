// Logo Import
import logo from "../assets/logo.png";

// You can customize the template with the help of this file

//Template config options
const env = "pro"; // dev,pro
const themeConfig = {
  app: {
    appName: "SupplierX",
    appLogoImage: logo,
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "boxed", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: "white", // BS color options [primary, success, etc]
    },
    footer: {
      type: "static", // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-right", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
  },

  backendUrl: `${
    env == "pro"
      ? "https://dev.supplierx.aeonx.digital/api/"
      : "http://localhost:3001/api/"
  }`,
  // backendUrl: `${"http://10.201.1.181:3001/api/"}`,

  // backendUrl: `${"http://localhost:5000/api/"}`,
  // backendUrl: `${"http://10.201.0.168:5000/api/"}`,
  // backendUrl: `${"https://ashapura.supplierx.aeonx.digital/api"}`,
  // backendUrl: `${"http://10.201.0.176:3000/api/"}`,
  // backendUrl: `${"http://10.201.0.198:3000/api/"}`,
  // backendUrl: "https://supplierx-alb-dev-1499994128.ap-south-1.elb.amazonaws.com/api/"
};

export default themeConfig;

// ** Icons Import
import { LocalShippingOutlined, Toll } from "@mui/icons-material";
import { FileText, GitPullRequest, Home, Maximize2, Settings, Truck, User } from "react-feather";
export default [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "supplier",
    title: "Suppliers",
    icon: <LocalShippingOutlined size={20} />,
    navLink: "/suppliers",
  },
  {
    id: "formfield",
    title: "Form Field",
    icon: <FileText size={20} />,
    children: [
      {
        id: "Create Field",
        title: "Create Field",
        icon: <Toll size={12} />,
        navLink: "/approver/createField",
      },
      {
        id: "Field Selection",
        title: "Field Selection",
        icon: <Toll size={12} />,
        navLink: "/approver/fieldSelection",
      },
    ],
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <Settings size={20} />,
    children: [
      {
        id: "profile",
        title: "Profile",
        icon: <User size={12} />,
        navLink: "profile",
      }
    ],
  },
  // {
  //   id: "purchaseRequisitions",
  //   title: "Purchase Req",
  //   icon: <GitPullRequest size={20} />,
  //   navLink: "/purchase_requisitions",
  // },
  // {
  //   id: "Req.. Quotation",
  //   title: "Req.. Quotation",
  //   icon: <Maximize2 size={20} />,
  //   navLink: "/rfq",
  // },
];

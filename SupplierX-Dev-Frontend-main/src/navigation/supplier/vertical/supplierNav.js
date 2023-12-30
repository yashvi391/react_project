// ** Icons Import
import {
  Camera,
  CameraAlt,
  DonutSmall,
  Inventory,
  PointOfSale,
  Receipt,
  Settings,
  ShoppingBag,
} from "@mui/icons-material";
import { Home, User } from "react-feather";
import { Toll } from "@mui/icons-material";
import { GoContainer } from "react-icons/go";

export default [
  {
    id: "Details",
    title: "Details",
    icon: <DonutSmall size={20} />,
    navLink: "/supplier/details",
  },
  {
    id: "Purchase Order",
    title: "Purchase Order",
    icon: <Inventory size={20} />,
    navLink: "/supplier/purchase-order",
  },
  {
    id: "ASN",
    title: "ASN",
    icon: <PointOfSale size={20} />,
    navLink: "/supplier/asn",
  },
  {
    id: "scanQr",
    title: "Scan Qr",
    icon: <CameraAlt size={20} />,
    navLink: "/supplier/scanqr",
  },
  {
    id: "Invoice",
    title: "Invoice",
    icon: <Receipt size={20} />,
    children: [
      {
        id: "Add Invoice",
        title: "Add Invoice",
        icon: <Toll size={12} />,
        navLink: "supplier/invoice",
      },
      {
        id: "List Invoice",
        title: "List Invoice",
        icon: <Toll size={12} />,
        navLink: "/supplier/list-invoice",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings size={20} />,
    children: [
      {
        id: "profile",
        title: "Profile",
        icon: <User size={12} />,
        navLink: "/profile",
      },
    ],
  },
];

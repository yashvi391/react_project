import { lazy } from "react";

// const DashboardSupplier = lazy(() => import("../../views/supplier/dashboard"));
const SupplierPO = lazy(() => import("../../views/supplier/PR/purchaseOrder"));
const Details = lazy(() =>
  import("../../views/supplier/Details/SupplierView.js")
);
const Invoice = lazy(() => import("../../views/invoice/Invoice"));
const ListInvoice = lazy(() => import("../../views/invoice/InvoiceList"));
const ASN = lazy(() => import("../../views/asn/Asn"));
const AddASN = lazy(() => import("../../views/asn/AddAsn"));
const ViewAsn = lazy(() => import("../../views/asn/ViewAsn.jsx"));
const ScanQr = lazy(() => import("../../views/asn/ScanQr.jsx"));

const Profile = lazy(() => import("../../views/admin/settings/profile.jsx"));

const SupplierRoutes = [
  // {
  //   path: "/supplier/details",
  //   element: <DashboardSupplier />,
  // },
  {
    path: "/supplier/details",
    element: <Details />,
  },
  {
    path: "/supplier/invoice",
    element: <Invoice />,
  },
  {
    path: "/supplier/list-invoice",
    element: <ListInvoice />,
  },
  {
    path: "/supplier/purchase-order",
    element: <SupplierPO />,
  },
  {
    path: "/supplier/asn",
    element: <ASN />,
  },
  {
    path: "/supplier/addasn",
    element: <AddASN />,
  },
  {
    path: "/supplier/viewasn/:id",
    element: <ViewAsn />,
  },
  {
    path: "/supplier/scanqr",
    element: <ScanQr />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default SupplierRoutes;

import { lazy } from "react";
// import CreateFormField from "../../views/admin/formfields/createField";
// import FieldSettings from "../../views/admin/formfields/fieldSelection";
const DashboardApprover = lazy(() =>
  import("../../views/Analytics/AnalyticsDash")
);
const Supplier = lazy(() =>
  import("../../views/approver/suppliers/ApproverSuppliers")
);
const SupplierDetails = lazy(() =>
  import("../../views/approver/supplier_details/SupplierDetails")
);
const PurchaseRequisition = lazy(() =>
  import("../../views/approver/purchase_requisitions")
);
const Rfq = lazy(() => import("../../views/approver/rfq"));
const CreateFormField = lazy(() =>
  import("../../views/admin/formfields/createField")
);
const FieldSettings = lazy(() =>
  import("../../views/admin/formfields/fieldSelection")
);
const Profile= lazy(() =>
  import("../../views/admin/settings/profile")
);

const ApproverRoutes = [
  {
    path: "/dashboard",
    element: <DashboardApprover />,
  },
  {
    path: "/suppliers",
    element: <Supplier />,
  },
  {
    path: "/suppliers-details",
    element: <SupplierDetails />,
  },
  {
    path: "/purchase_requisitions",
    element: <PurchaseRequisition />,
  },
  {
    path: "/rfq",
    element: <Rfq />,
  },
  {
    path: "/approver/createField",
    element: <CreateFormField />,
  },
  {
    path: "/approver/fieldSelection",
    element: <FieldSettings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default ApproverRoutes;

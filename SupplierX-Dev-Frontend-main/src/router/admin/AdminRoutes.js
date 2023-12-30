import { lazy } from "react";
const DashboardAdmin = lazy(() =>
  import("../../views/Analytics/AnalyticsDash")
);
const BusinessGroup = lazy(() =>
  import("../../views/admin/configuration/business-group")
);
const BusinessType = lazy(() =>
  import("../../views/admin/configuration/business-type")
);
const ComapnyType = lazy(() =>
  import("../../views/admin/configuration/company-type")
);
const Payment = lazy(() => import("../../views/admin/configuration/payment"));
const FormView = lazy(() => import("../../views/admin/formfields/formview"));
const FieldSettings = lazy(() =>
  import("../../views/admin/formfields/fieldSelection")
);
const CreateFormField = lazy(() =>
  import("../../views/admin/formfields/createField")
);
const Profile = lazy(() =>
  import("../../views/admin/settings/profile")
);
const Companies = lazy(() => import("../../views/admin/companies"));
const Department = lazy(() =>
  import("../../views/admin/departments/department")
);
const DepartmentApprover = lazy(() =>
  import("../../views/admin/departments/approver")
);
const Plants = lazy(() => import("../../views/admin/plants"));
const Roles = lazy(() => import("../../views/admin/rolespermission/roles"));
const User = lazy(() => import("../../views/admin/rolespermission/user"));
const ApproverLevel = lazy(() =>
  import("../../views/admin/rolespermission/approverLevel")
);
const Invoice = lazy(() => import("../../views/invoice/Invoice"));
const Countries = lazy(() => import("../../views/admin/settings/countries"));
const Currency = lazy(() => import("../../views/admin/settings/currency"));
const Onboarding = lazy(() =>
  import("../../views/forms/wizard/SupplierRegister")
);
const Login = lazy(() => import("../../views/pages/authentication/Login"));
const Supplier = lazy(() =>
  import("../../views/admin/supplier/AdminSuppliers")
);
const VendorClass = lazy(() => import("../../views/admin/vendor/vendor-class"));
const VendorSchema = lazy(() =>
  import("../../views/admin/vendor/vendor-schema")
);
const PurchaseSchema = lazy(() =>
  import("../../views/admin/vendor/purchase-group")
);
const Tds = lazy(() => import("../../views/admin/vendor/tds"));
const CalSchema = lazy(() => import("../../views/admin/vendor/cal-schema"));
const PaymentTerm = lazy(() => import("../../views/admin/vendor/payment-term"));
const StorageLocation = lazy(() =>
  import("../../views/admin/material/storageLocation")
);
const Materials = lazy(() => import("../../views/admin/material/materials"));
const MaterialGroup = lazy(() =>
  import("../../views/admin/material/materialGroup")
);
const Reconciliation = lazy(() =>
  import("../../views/admin/vendor/reconciliation")
);
const AdminRoutes = [
  {
    element: <Onboarding />,
    path: "/supplier/register",
    meta: {
      layout: "blank",
      publicRoute: true,
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/admin/dashboard",
    element: <DashboardAdmin />,
  },
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/admin/storage-location",
    element: <StorageLocation />,
  },
  {
    path: "/admin/materials",
    element: <Materials />,
  },
  {
    path: "/admin/material-group",
    element: <MaterialGroup />,
  },
  {
    path: "/admin/supplier",
    element: <Supplier />,
  },
  {
    path: "/admin/vendor-class",
    element: <VendorClass />,
  },
  {
    path: "/admin/purchase-group",
    element: <PurchaseSchema />,
  },
  {
    path: "/admin/cal-schema",
    element: <CalSchema />,
  },
  {
    path: "/admin/payment-term",
    element: <PaymentTerm />,
  },
  {
    path: "/admin/vendor-schema",
    element: <VendorSchema />,
  },
  {
    path: "/admin/reconciliation",
    element: <Reconciliation />,
  },
  {
    path: "/admin/tds",
    element: <Tds />,
  },
  {
    path: "/admin/business-group",
    element: <BusinessGroup />,
  },
  {
    path: "/admin/business-type",
    element: <BusinessType />,
  },
  {
    path: "/admin/company-type",
    element: <ComapnyType />,
  },
  {
    path: "/admin/payment",
    element: <Payment />,
  },
  {
    path: "/admin/createField",
    element: <CreateFormField />,
  },
  {
    path: "/admin/fieldSelection",
    element: <FieldSettings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin/formview",
    element: <FormView />,
  },
  
  {
    path: "/admin/departments/department",
    element: <Department />,
  },

  {
    path: "/admin/department/approver",
    element: <DepartmentApprover />,
  },
  {
    path: "/admin/plants",
    element: <Plants />,
  },
  {
    path: "/admin/roles",
    element: <Roles />,
  },
  {
    path: "/admin/user",
    element: <User />,
  },
  {
    path: "/admin/approver-level",
    element: <ApproverLevel />,
  },
  {
    path: "/admin/invoice",
    element: <Invoice />,
  },
  {
    path: "/admin/countries",
    element: <Countries />,
  },
  {
    path: "/admin/currency",
    element: <Currency />,
  },
];

export default AdminRoutes;

// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/admin/vertical";
import suppliernavigation from "@src/navigation/supplier/vertical";
import approvernavigation from "@src/navigation/approver/vertical";

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  const user = JSON.parse(localStorage.getItem("userData"));

  if (
    (user && user.role_name == "Approver") ||
    (user && user.role_name == "Verifier")
  ) {
    return (
      <Layout menuData={approvernavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "Admin") {
    return (
      <Layout menuData={navigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "Supplier") {
    return (
      <Layout menuData={suppliernavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
};

export default VerticalLayout;

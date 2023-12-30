// ** React Imports
import axios from "axios";
import { Fragment, useState } from "react";
import logo from "@src/assets/images/logo/logo.png";
// import dummy from "@src/assets/images/dummy.jpg";
import { HelpCircle } from "react-feather";
import Select, { components } from "react-select";
import classnames from "classnames";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import { useNavigate } from "react-router-dom";

// ** Images
import { Table, Badge } from "reactstrap";

// ** Third Party Components
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Modal,
  Alert,
  Input,
  Button,
  CardBody,
  CardText,
  Label,
  CardTitle,
  Form,
  ModalBody,
  ModalHeader,
  CardHeader,
} from "reactstrap";

//** Use Redux Toolkit */
import { useSelector } from "react-redux";
import themeConfig from "../../../configs/themeConfig";

// ** Reactstrap Imports
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// resData?
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "light-success";
    case "queried":
      return "light-primary";
    case "completed":
      return "light-info";
    case "pending":
      return "light-warning";
    case "rejected":
      return "light-primary";
    default:
      return "light-secondary";
  }
};

const SupplierForm = ({ stepper }) => {
  const [resData, setResData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const storedValue = localStorage.getItem("supplierId");
  const id = storedValue;
  const [supplierData, setSupplierData] = useState();
  const [show, setShow] = useState(false);
  const [queryShow, setQueryShow] = useState(false);
  const [rejectShow, setRejectShow] = useState(false);
  const [approveShow, setApproveShow] = useState(false);
  //getting additional company details list from api
  const [additionalData, setAdditionalCoData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [schemaData, setSchemaData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [businesspartnerData, setBusinessPartnerData] = useState([]);
  const [reconciliationOptions, setReconciliationOptions] = useState([]);
  const [addCompanyData, setAddCompanyData] = useState([]);

  //save company details
  const [companies, setCompanies] = useState([]);
  const [reconciliation, setReconciliation] = useState();
  const [vendor, setVendor] = useState();
  const [vendorlabel, setVendorLabel] = useState({});
  const [reconciliationLable, setReconciliationLable] = useState({});

  const [vendorschemalabel, setVendorSchemaLabel] = useState({});
  const [businesspartnerlabel, setBusinessPartnerLabel] = useState({});
  const [vendorschema, setVendorSchema] = useState();
  const [businesspartner, setBusinessPartner] = useState();
  //
  const [imgSrc, setImgSrc] = useState();

  const msmeImage = supplierData ? supplierData.tax_details.msmeImage : "";
  const panImage = supplierData ? supplierData.tax_details.panCardImage : "";
  const gstImage = supplierData ? supplierData.tax_details.gstImage : "";
  const chequeImage = supplierData
    ? supplierData.tax_details.cancelledChequeImage
    : "";

  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleCompanyChange = (selected) => {
    setSelectedCompanies(selected);
    const selectedValues = selected.map((item) => item.id);
    const selectedLabels = selected.map((item) => item.label);
    setCompanies(selectedValues);
    getReconDetails(selectedLabels);
  };

  const isSelectEmpty = (selectedValue) => {
    return !selectedValue || selectedValue.length === 0;
  };

  const handleReconciliationChange = (selected) => {
    setReconciliation(selected.id);
    setReconciliationLable({ label: selected.label, value: selected.label });
  };

  const handleVendorChange = (selected) => {
    setVendor(selected.id);
    setVendorLabel({ label: selected.label, value: selected.label });
  };

  const handleSchemaChange = (selected) => {
    setVendorSchema(selected.id);
    setVendorSchemaLabel({ label: selected.label, value: selected.label });
  };

  const handleBusinessPartnerChange = (selected) => {
    setBusinessPartner(selected.id);
    setBusinessPartnerLabel({ label: selected.label, value: selected.label });
  };

  const supplierRegistration = useSelector(
    (state) => state.supplierRegistration
  );
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [showcard, setShowcard] = useState(false);
  const [showsavebutton, setShowsavebutton] = useState(true);
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);

  const submitAdData = () => {
    const adData = {
      supplier_id: supplierID,
      companies: companies,
      reconciliationAc: reconciliation,
      vendor_class: vendor,
      vendor_schema: vendorschema,
      business_partner_group: businesspartner,
    };
    axios
      .post(themeConfig.backendUrl + "v1/supplier/addCoDetails/create", adData)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          return toast.error(res.data.message);
        }
        toast.success(res.data.message);
        setShowApproveButton(true);
        setShowcard(true);
        setShowsavebutton(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveAdditionalInfo = () => {
    // Check each select input individually and display alerts

    if (isSelectEmpty(selectedCompanies)) {
      toast.error("Name of Company field is empty.");
    } else if (isSelectEmpty(reconciliation)) {
      toast.error("Reconciliation Account field is empty.");
    } else if (isSelectEmpty(vendor)) {
      toast.error("Vendor Class field is empty.");
    } else if (isSelectEmpty(vendorschema)) {
      toast.error("Vendor Schema field is empty.");
    } else if (isSelectEmpty(businesspartner)) {
      toast.error("Business Partner Grouping field is empty.");
    } else {
      console.log("saveAdditionalInfo");
      submitAdData();
    }
  };

  const selectedCompanyValues = selectedCompanies.map(
    (company) => company.value
  );
  const formatGroupLabel = (data) => (
    <div className="d-flex justify-content-between align-center">
      <strong>
        <span>{data.label}</span>
      </strong>
      <span>{data.options.length}</span>
    </div>
  );

  const font600 = { fontSize: "600" };
  const headerText = {
    fontWeight: "bold",
    color: "#000",
  };
  const getSupplierData = () => {
    axios
      .post(
        new URL(`/api/v1/supplier/supplier/view/${id}`, themeConfig.backendUrl)
      )
      .then((res) => {
        console.log(res.data);

        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setSupplierData(res.data.data);
        }
      });
  };
  const getReconDetails = (data) => {
    const query = {
      company_names: data ? data : ["all"],
    };
    axios
      .post(
        new URL("/api/v1/supplier/addCoDetails/list", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        const reconciliationlist = res.data.data.ReconAccDetails.map(
          (item) => ({
            id: item.id,
            value: item.name,
            label: item.name,
          })
        );
        setReconciliationOptions(reconciliationlist);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const getAddCoDetails = (data) => {
    const query = {
      company_names: ["all"],
    };

    axios
      .post(
        new URL("/api/v1/supplier/addCoDetails/list", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        const vendorList = res.data.data.getVendorClass.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.name,
          code: item.code,
        }));
        const companyList = res.data.data.getCompanies.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.name,
          code: item.code,
        }));

        const schemaList = res.data.data.getVendorSchema.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.name,
          code: item.code,
        }));
        const businesspartnerList = res.data.data.getBusinessPartnerGroup.map(
          (item) => ({
            id: item.id,
            value: item.name,
            label: item.name,
            code: item.code,
          })
        );
        setVendorData(vendorList);
        setCompanyData(companyList);
        setSchemaData(schemaList);
        setBusinessPartnerData(businesspartnerList);
        setAdditionalCoData(res.data.data);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const getWorkflowInfo = () => {
    const sendData = {
      supplier_id: id,
    };
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/supplierChangeStatusList",
          themeConfig.backendUrl
        ),
        sendData
      )
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.message);
          // toast.error(res.data.message);
        }
        console.log(res.data);
        setTableData(res.data.data);
      });
  };
  useEffect(() => {}, [reconciliationOptions, reconciliationLable]);

  const getAddtionalDetails = () => {
    axios
      .post(
        new URL(
          `/api/v1/supplier/addCoDetails/list/${id}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        if (res.data.error) {
          // toast.error(res.data.message);
          setShowsavebutton(false);
        } else {
          setShowApproveButton(true);
          setShowcard(true);
          setAddCompanyData(res.data.data);
          setShowsavebutton(true);
        }
      });
  };

  const sendStatus = (e) => {
    let userData = localStorage.getItem("userData");
    const data = JSON.parse(userData);
    const sendData = {
      supplier_id: supplierID,
      status: e.status,
      user_id: data.id,
      user_role: data.role,
      approver_level: data.approver_level_name,
      comment: value,
      approver_hr_level: data.hierarchy_level,
      subscriber_id: data.subscriber_id,
    };
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/changestatus",
          themeConfig.backendUrl
        ),
        sendData
      )
      .then((res) => {
        setApproveShow(false);
        setRejectShow(false);
        setQueryShow(false);
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setResData(res.data);
          getWorkflowInfo();
          // setTimeout(() => {
          //   navigate("/source/suppliers");
          // }, 1000);
        }
      });
  };

  useEffect(() => {
    getSupplierData();
    getAddCoDetails();
    getAddtionalDetails();
    getReconDetails();
    getWorkflowInfo();
  }, []);
  return (
    <Fragment>
      <div className="content-header">
        <h3 style={{ padding: "10px 0px" }} className="mb-0">
          Supplier Details
        </h3>
      </div>
      {supplierData ? (
        <>
          <CardBody>
            <Row>
              <Col md="12" className="mb-1">
                <Input
                  style={{
                    padding: "15px",
                    backgroundColor:
                      supplierData && supplierData.status === "approved"
                        ? "#28c76f"
                        : supplierData.status === "pending"
                        ? "#7367f0"
                        : supplierData.status === "queried"
                        ? "#e06522"
                        : supplierData.status === "rejected"
                        ? "#ea5455"
                        : "white",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  type="text"
                  name="name"
                  id="nameVertical"
                  value={
                    supplierData
                      ? supplierData.status?.charAt(0).toUpperCase() +
                        supplierData.status?.slice(1).toLowerCase()
                      : ""
                  }
                />
              </Col>
            </Row>
          </CardBody>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "15px",
            }}
          >
            <CardBody>
              <Row>
                <Col md="6" className="mb-1">
                  <label class="pb-0 mb-1" style={headerText}>
                    Supplier Name
                  </label>
                  {console.log(supplierData)}
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={supplierData ? supplierData.supplier_name : ""}
                    placeholder="---"
                  />
                </Col>
                <Col md="3" className="mb-1">
                  <label class="pb-0 mb-1" style={headerText}>
                    Business Type
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={
                      supplierData
                        ? supplierData.business_details.businessType
                        : ""
                    }
                    placeholder="---"
                  />
                </Col>
                <Col md="3" className="mb-1">
                  <label class="pb-0 mb-1" style={headerText}>
                    GST No
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={supplierData ? supplierData.gstNo : ""}
                    placeholder="---"
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col md="12" sm="12" className="mb-1">
              <div
                className="row"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "20px",
                }}
              >
                <div className="supply-heading">
                  <h3 class="card-title py-2" style={{ color: "#E06522" }}>
                    Company Details
                  </h3>
                </div>
                <div class="col-md-3  py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Source
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    value={supplierData ? supplierData.source : ""}
                    placeholder="---"
                  />
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Street Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="streetNo"
                      id="streetNoVertical"
                      value={supplierData ? supplierData.streetNo : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Address 1
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address1"
                      id="address1Vertical"
                      value={supplierData ? supplierData.address1 : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Address 2
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address2"
                      id="address2Vertical"
                      value={supplierData ? supplierData.address2 : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Address 3
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address3"
                      id="address3Vertical"
                      value={supplierData ? supplierData.address3 : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Country
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="country"
                      id="countryVertical"
                      value={supplierData ? supplierData.country : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    State
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="state"
                      id="stateVertical"
                      value={supplierData ? supplierData.state : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    City
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="city"
                      id="cityVertical"
                      value={supplierData ? supplierData.city : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Pin / Zip Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="pin"
                      id="pinVertical"
                      value={supplierData ? supplierData.pin : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Phone Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="phoneNo"
                      id="phoneNoVertical"
                      value={supplierData ? supplierData.phoneNo : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Website
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="website"
                      id="websiteVertical"
                      value={supplierData ? supplierData.website : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Payment Method
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="paymentMethod"
                      id="paymentMethodVertical"
                      value={supplierData ? supplierData.paymentMethod : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Overseas office details(if any)
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="officeDetails"
                      id="officeDetailsVertical"
                      value={supplierData ? supplierData.officeDetails : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Aadhar Card
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="aadharNo"
                      id="aadharNoVertical"
                      value={supplierData ? supplierData.aadharNo : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    CIN Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="cinNo"
                      id="cinNoVertical"
                      value={supplierData ? supplierData.cinNo : ""}
                      placeholder="---"
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <div
                className="row"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "20px",
                }}
              >
                <div className="supply-heading">
                  <h3 class="card-title py-2" style={{ color: "#E06522" }}>
                    Business Details
                  </h3>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    MSME No.
                  </label>
                  <div style={font600} id="msme_no">
                    <Input
                      type="text"
                      name="msme_no"
                      id="msme_no"
                      value={
                        supplierData
                          ? supplierData.business_details.msme_no
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Company Founded Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="companyFoundYear"
                      id="companyFoundYearVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.companyFoundYear
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Promoter / Director Name
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="promoterName"
                      id="promoterNameVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.promoterName
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Company Type
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="companyType"
                      id="companyTypeVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.companyType
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Name of Business / Corporate Group
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="nameOfBusiness"
                      id="nameOfBusinessVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.nameOfBusiness
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Business Type
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="businessType"
                      id="businessTypeVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.businessType
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Address of Plant / Workshop
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="addressOfPlant"
                      id="addressOfPlantVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.addressOfPlant
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Name of Other Group Companies / Sister Concern
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="nameOfOtherGroupCompanies"
                      id="nameOfOtherGroupCompaniesVertical"
                      value={
                        supplierData
                          ? supplierData.business_details
                              .nameOfOtherGroupCompanies
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    List of Major Customers
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="listOfMajorCustomers"
                      id="listOfMajorCustomersVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.listOfMajorCustomers
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Details of Major Orders Undertaken in Last 5 Years
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="detailsOfMajorLastYear"
                      id="detailsOfMajorLastYearVertical"
                      value={
                        supplierData
                          ? supplierData.business_details.detailsOfMajorLastYear
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <div
                className="row"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "20px",
                }}
              >
                <div className="supply-heading">
                  <h3 class="card-title py-2" style={{ color: "#E06522" }}>
                    Financial Details
                  </h3>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Currency
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="currency"
                      id="currencyVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.currency
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Annual Turnover of 1st Year
                  </label>
                  <div style={font600} id="review_country">
                    {console.log(supplierData)}
                    <Input
                      type="text"
                      name="turnover"
                      id="turnoverVertical"
                      value={
                        supplierData
                          ? supplierData?.finance_details?.turnover
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Annual Turnover of 2nd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="turnover2"
                      id="turnover2Vertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.turnover2
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Annual Turnover of 3rd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="turnover3"
                      id="turnover3Vertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.turnover3
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit Before Tax of 1st Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="first"
                      id="firstVertical"
                      value={
                        supplierData ? supplierData.finance_details?.first : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit Before Tax of 2nd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="second"
                      id="secondVertical"
                      value={
                        supplierData ? supplierData.finance_details?.second : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit Before Tax of 3rd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="third"
                      id="thirdVertical"
                      value={
                        supplierData ? supplierData.finance_details?.third : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit After Tax of 1st Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="afterfirst"
                      id="afterfirstVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.afterfirst
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit After Tax of 2nd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="aftersecond"
                      id="aftersecondVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.aftersecond
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Profit After Tax of 3rd Year
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="afterthird"
                      id="afterthirdVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.afterthird
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Present Order Booking Value
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="presentorder"
                      id="presentorderVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.presentorder
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Further Order Booking Value
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="furtherorder"
                      id="furtherorderVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.furtherorder
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Market Capital
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="market"
                      id="marketVertical"
                      value={
                        supplierData ? supplierData.finance_details?.market : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Networth
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="networth"
                      id="networthVertical"
                      value={
                        supplierData
                          ? supplierData.finance_details?.networth
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="supply-heading">
                  <h3 class="card-title py-2">
                    <u>Primary Bank Details</u>
                  </h3>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Name
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_name"
                      id="p_bank_name"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_name
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Account Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_account_number"
                      id="p_bank_account_number"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_account_number
                          : ""
                      }
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Holder Name
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_account_holder_name"
                      id="p_bank_account_holder_name"
                      value={
                        supplierData
                          ? supplierData.finance_details
                              ?.p_bank_account_holder_name
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank state
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_state"
                      id="p_bank_state"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_state
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Address
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_address"
                      id="p_bank_address"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_address
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Branch
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_branch"
                      id="p_bank_branch"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_branch
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    IFSC Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_ifsc_code"
                      id="p_ifsc_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_ifsc_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    MICR Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_micr_code"
                      id="p_micr_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_micr_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    MICR Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_micr_code"
                      id="p_micr_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_micr_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Guarantee Limit
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_bank_guarantee_limit"
                      id="p_bank_guarantee_limit"
                      value={
                        supplierData
                          ? supplierData.finance_details?.p_bank_guarantee_limit
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Over Draft / Cash Credit Limit
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="p_overdraft_cash_credit_limit"
                      id="p_overdraft_cash_credit_limit"
                      value={
                        supplierData
                          ? supplierData.finance_details
                              ?.p_overdraft_cash_credit_limit
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="supply-heading">
                  <h3 class="card-title py-2">
                    <u>Secondary Bank Details</u>
                  </h3>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Name
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_name"
                      id="s_bank_name"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_name
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Account Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_account_number"
                      id="s_bank_account_number"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_account_number
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Holder Name
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_account_holder_name"
                      id="s_bank_account_holder_name"
                      value={
                        supplierData
                          ? supplierData.finance_details
                              ?.s_bank_account_holder_name
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank state
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_state"
                      id="s_bank_state"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_state
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Address
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_address"
                      id="s_bank_address"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_address
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Branch
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_branch"
                      id="s_bank_branch"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_branch
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    IFSC Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_ifsc_code"
                      id="s_ifsc_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_ifsc_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    MICR Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_micr_code"
                      id="s_micr_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_micr_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    MICR Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_micr_code"
                      id="s_micr_code"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_micr_code
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Bank Guarantee Limit
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_bank_guarantee_limit"
                      id="s_bank_guarantee_limit"
                      value={
                        supplierData
                          ? supplierData.finance_details?.s_bank_guarantee_limit
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    Over Draft / Cash Credit Limit
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="s_overdraft_cash_credit_limit"
                      id="s_overdraft_cash_credit_limit"
                      value={
                        supplierData
                          ? supplierData.finance_details
                              ?.s_overdraft_cash_credit_limit
                          : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <div
                className="row"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "20px",
                }}
              >
                <div className="supply-heading">
                  <h3 class="card-title py-2" style={{ color: "#E06522" }}>
                    Tax Details
                  </h3>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    GST Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="gstno"
                      id="gstnoVertical"
                      value={supplierData ? supplierData.tax_details.gstno : ""}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    GST Registration Date
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="gstRegDate"
                      id="gstRegDateVertical"
                      value={
                        supplierData ? supplierData.tax_details.gstRegDate : ""
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div class="col-md-3 py-2">
                  <label class="pb-0 mb-1" style={headerText}>
                    PAN Card
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="panCard"
                      id="panCardVertical"
                      value={supplierData ? supplierData.panNo : ""}
                      placeholder="---"
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md="12" sm="12" className="mb-1">
              <div
                className="row"
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  marginTop: "20px",
                }}
              >
                <div className="supply-heading">
                  <h3 class="card-title py-2" style={{ color: "#E06522" }}>
                    File Attachments
                  </h3>
                </div>
                <div class="col-md-3  py-2">
                  <label class="pb-0" style={headerText}>
                    PAN card
                  </label>
                  <br />
                  {panImage.includes(".pdf") ? (
                    <a href={panImage} target="_blank">
                      Open PAN
                    </a>
                  ) : (
                    <img
                      src={panImage}
                      style={{ width: "100px", marginTop: "5px" }}
                      alt="Pan card"
                      onClick={() => {
                        setShow(true);
                        setImgSrc(panImage);
                      }}
                    />
                  )}
                </div>

                <div class="col-md-3  py-2">
                  <label class="pb-0" style={headerText}>
                    MSME
                  </label>
                  <br />
                  {msmeImage.includes(".pdf") ? (
                    <a href={msmeImage} target="_blank">
                      Open MSME
                    </a>
                  ) : (
                    <img
                      src={msmeImage}
                      style={{ width: "100px", marginTop: "5px" }}
                      alt="MSME"
                      onClick={() => {
                        setShow(true);
                        setImgSrc(msmeImage);
                      }}
                    />
                  )}
                </div>

                <div class="col-md-3  py-2">
                  <label class="pb-0" style={headerText}>
                    GST Certificate
                  </label>
                  <br />
                  {gstImage.includes(".pdf") ? (
                    <div>
                      <a href={gstImage} target="_blank">
                        Open GST
                      </a>
                    </div>
                  ) : (
                    <>
                      <img
                        src={gstImage}
                        style={{ width: "100px", marginTop: "5px" }}
                        alt="GST"
                        onClick={() => {
                          setShow(true);
                          setImgSrc(gstImage);
                        }}
                      />
                    </>
                  )}
                </div>

                <div class="col-md-3  py-2">
                  <label class="pb-0" style={headerText}>
                    Cancelled Cheque:
                  </label>
                  <br />
                  {chequeImage.includes(".pdf") ? (
                    <a href={chequeImage} target="_blankAdditional Details">
                      Open Cheque
                    </a>
                  ) : (
                    <>
                      <img
                        src={chequeImage}
                        style={{ width: "100px", marginTop: "5px" }}
                        alt="Cheque"
                        onClick={() => {
                          setShow(true);
                          setImgSrc(chequeImage);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Card
            style={{
              // display: showcard ? "block" : "none",
              backgroundColor: "white",
              borderRadius: "5px",
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "20px",
            }}
          >
            <CardHeader>
              <CardTitle>
                <h3 style={{ color: "#E06522" }}>Approval Information</h3>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table size="sm" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Approver Level</th>
                    <th>Approver Level Name</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData ? (
                    tableData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <span className="align-middle fw-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <span className="align-middle fw-bold">
                            {"Level " + "- " + row.approver_level}
                          </span>
                        </td>
                        <td>
                          <span className="align-middle fw-bold">
                            {row.approver_level_name}
                          </span>
                        </td>
                        <td>{row.user_name}</td>
                        <td>
                          <Badge
                            pill
                            color={getStatusColor(row.status)}
                            className="me-1"
                          >
                            {row.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td>{row.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No data available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* <Row>
                <Col md={6}>
                  <div className="form-floating mb-0 mt-3">
                    <Input
                      name="text"
                      value={value}
                      type="textarea"
                      id="exampleText"
                      placeholder="---"
                      style={{ minHeight: "100px" }}
                      onChange={(e) => setValue(e.target.value)}
                      className={classnames({
                        "text-danger": value.length > 200,
                      })}
                    />
                    <Label className="form-label" for="textarea-counter">
                      Remarks
                    </Label>
                  </div>
                </Col>
              </Row> */}
              <span
                className={classnames("textarea-counter-value float-end", {
                  "bg-danger": value.length > 200,
                })}
              >
                {`${value.length}/200`}
              </span>
            </CardBody>
          </Card>

          {/* <div className="d-flex justify-content-start">
            <Button
              disabled={approveButtonDisabled}
              style={{
                display: showApproveButton ? "block" : "none",
                marginRight: "20px",
                marginLeft: "10px",
              }}
              color="primary"
              className="btn-prev"
              onClick={() => setQueryShow(true)}
            >
              <span className="align-middle d-sm-inline-block d-none">
                Query
              </span>
            </Button>
            <Button
              disabled={approveButtonDisabled}
              style={{
                display: showApproveButton ? "block" : "none",
                marginRight: "20px",
                marginLeft: "10px",
              }}
              color="danger"
              className="btn-prev"
              onClick={() => setRejectShow(true)}
            >
              <span className="align-middle d-sm-inline-block d-none">
                Reject
              </span>
            </Button>
            <Button
              // style={{ marginRight: "20px" }}
              type="submit"
              color="success"
              className="btn-submit"
              // disabled={showsavebutton}

              disabled={approveButtonDisabled}
              onClick={() => setApproveShow(true)}
              style={{ display: showApproveButton ? "block" : "none" }}
            >
              Approve
            </Button>
          </div> */}
          <Modal
            isOpen={show}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered modal-lg"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setShow(!show)}
            ></ModalHeader>
            <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
              <img src={imgSrc} className="img-fluid" alt="" />
            </ModalBody>
          </Modal>

          {/* Query modal */}
          {/* <Modal
            isOpen={queryShow}
            toggle={() => setQueryShow(!queryShow)}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setQueryShow(!queryShow)}
            ></ModalHeader>
            <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
              <span>
                <HelpCircle
                  color="orange"
                  className="font-large-2 me-sm-2 mb-2 mb-sm-0"
                />
              </span>
              <h3 className="text-center mb-1 mt-1">Are you sure ?</h3>
              <h5 className="text-center mb-3">
                This will reset approval process of this supplier and allow the
                supplier to edit the form.
              </h5>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button
                  type="submit"
                  onClick={() => {
                    const data = { status: "queried" };
                    sendStatus(data);
                  }}
                  className="me-1"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => setQueryShow(false)}
                >
                  Discard
                </Button>
              </Col>
            </ModalBody>
          </Modal> */}

          {/* Reject modal */}
          {/* <Modal
            isOpen={rejectShow}
            toggle={() => setRejectShow(!rejectShow)}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setRejectShow(!rejectShow)}
            ></ModalHeader>
            <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
              <span>
                <HelpCircle
                  color="orange"
                  className="font-large-2 me-sm-2 mb-2 mb-sm-0"
                />
              </span>
              <h3 className="text-center mb-1 mt-1">Are you sure ?</h3>
              <h5 className="text-center mb-3">
                This will reject approval process of this supplier.
              </h5>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button
                  type="submit"
                  onClick={() => {
                    const data = { status: "rejected" };
                    sendStatus(data);
                  }}
                  className="me-1"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => setRejectShow(false)}
                >
                  Discard
                </Button>
              </Col>
            </ModalBody>
          </Modal> */}

          {/* Approve modal */}
          {/* <Modal
            isOpen={approveShow}
            toggle={() => setApproveShow(!approveShow)}
            className="modal-dialog-centered modal-md"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setApproveShow(!approveShow)}
            ></ModalHeader>
            <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
              <span>
                <HelpCircle
                  color="orange"
                  className="font-large-2 me-sm-2 mb-2 mb-sm-0"
                />
              </span>
              <h3 className="text-center mb-1 mt-1">Are you sure ?</h3>
              <h5 className="text-center mb-3">
                This will approve the process of this supplier.
              </h5>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button
                  onClick={() => {
                    const data = { status: "approved" };
                    sendStatus(data);
                    setApproveButtonDisabled(true);
                  }}
                  type="submit"
                  className="me-1"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => setApproveShow(false)}
                >
                  Discard
                </Button>
              </Col>
            </ModalBody>
          </Modal> */}
        </>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "400px" }}
        >
          <Spinner />
        </div>
      )}
    </Fragment>
  );
};

export default SupplierForm;

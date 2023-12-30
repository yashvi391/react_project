// ** React Imports
import axios from "axios";
import { Fragment, useState } from "react";
import NoImage from "@src/assets/images/noImage.jpg";
// import dummy from "@src/assets/images/dummy.jpg";
import { HelpCircle, Truck } from "react-feather";
import Select, { components } from "react-select";
import classnames from "classnames";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import { useNavigate } from "react-router-dom";
import Repeater from "@components/repeater";
import { X, Plus } from "react-feather";
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
import { Checkbox } from "@mui/material";
import {
  AccountBalance,
  AccountBalanceTwoTone,
  AssignmentInd,
  AttachFile,
  AttachMoney,
  Attachment,
  Business,
  BusinessCenter,
  BusinessCenterOutlined,
  Edit,
  EditAttributes,
  Key,
  LocationCityOutlined,
  Loupe,
  Phone,
  PhoneAndroid,
  PointOfSale,
  Preview,
  Reviews,
  Upgrade,
} from "@mui/icons-material";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

// resData?
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "light-success";
    case "verified":
      return "light-info";
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
const cardStyle = {
  borderRadius: "5px",
  marginLeft: "5px",
  marginRight: "5px",
  // marginTop: "20px",
  // backgroundColor: "white",
};

const SupplierDetails = ({ stepper }) => {
  let user_data = localStorage.getItem("userData");
  const userData = JSON.parse(user_data);
  const approverLevel = userData.level;
  const [resData, setResData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState();
  const [value, setValue] = useState(null);
  const [status, setStatus] = useState("");
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
  const [purchaseGroupData, setPurchaseGroupData] = useState([]);
  const [schemaData, setSchemaData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [businesspartnerData, setBusinessPartnerData] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);

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
  const [payment, setPayment] = useState();
  const [paymentLabel, setPaymentLabel] = useState();
  const [purchaseGroupLabel, setPurchaseGroupLabel] = useState();
  const [purchaseGroup, setPurchaseGroup] = useState();

  //
  const [imgSrc, setImgSrc] = useState();
  const supplierID = supplierData ? supplierData.id : "";
  const msmeImage = supplierData?.tax_details?.msmeImage
    ? supplierData.tax_details.msmeImage
    : NoImage;
  const panImage = supplierData?.tax_details?.panCardImage
    ? supplierData?.tax_details?.panCardImage
    : NoImage;
  const gstImage = supplierData?.tax_details?.gstImage
    ? supplierData.tax_details.gstImage
    : NoImage;
  const chequeImage = supplierData?.tax_details?.cancelledChequeImage
    ? supplierData.tax_details.cancelledChequeImage
    : NoImage;

  //edit
  const [toggle, setToggle] = useState(false);

  const [editData, setEditData] = useState();
  const [editBusinessData, setEditBusinessData] = useState();
  const [editFinancialData, setEditFinancialData] = useState();

  console.log(editData);

  const editedData = {
    company_details: {
      aadharNo: editData?.aadharNo,
      address1: editData?.address1,
      address2: editData?.address2,
      address3: editData?.address3,
      cinNo: editData?.cinNo,
      city: editData?.city,
      contactPersonName: editData?.contactPersonName,
      country: editData?.country,
      designation: editData?.designation,
      emailID: editData?.emailID,
      mobile: editData?.mobile,
      officeDetails: editData?.officeDetails,
      paymentMethod: editData?.paymentMethod,
      phoneNo: editData?.phoneNo,
      pin: editData?.pin,
      source: editData?.source,
      state: editData?.state,
      streetNo: editData?.streetNo,
      website: editData?.website,
      telephone: editData?.telephone,
    },
    business_details: editBusinessData,
    finance_details: editFinancialData,
  };

  console.log("data", editedData);

  const [showApproveButton, setShowApproveButton] = useState(false);
  const [showcard, setShowcard] = useState(false);
  const [showsavebutton, setShowsavebutton] = useState(true);
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);
  const displayValue = value ? `${value.length}/200` : `0/200`;
  const submitAdData = () => {
    const adData = {
      supplier_id: supplierID,
      companies: companies,
      reconciliationAc: reconciliation,
      vendor_class: vendor,
      vendor_schema: vendorschema,
      business_partner_group: businesspartner,
      payment_terms: payment,
      purchase_group: purchaseGroup,
      itWitholding: [
        {
          taxType: selectedTax.value ? selectedTax.value : null,
          wtSubjct: selectedSubject ? "X" : null,
          taxCode: selectedCode.value ? selectedCode.value : null,
          recipientType: selectedRecepient.value
            ? selectedRecepient.value
            : null,
        },
      ],
    };
    axios
      .post(
        themeConfig.backendUrl +
          "v1/supplier/addCoDetails/create",
        adData
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setShowApproveButton(true);
          setShowcard(true);
          setShowsavebutton(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
    fontSize: "15px",
    fontWeight: "500",
  };
  const [taxType, setTaxType] = useState();
  const [taxCode, setTaxCode] = useState();
  const [recepient, setRecepient] = useState();

  const getTds = () => {
    axios
      .post(new URL("/api/v1/admin/tds/tax_types", themeConfig.backendUrl))
      .then((res) => {
        setTaxType(res.data.data);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
    axios
      .post(
        new URL("/api/v1/supplier/typeOfRecipient/list", themeConfig.backendUrl)
      )
      .then((res) => {
        setRecepient(res.data.data.rows);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const TaxCode = (type) => {
    const params = {
      type: type.value,
    };
    axios
      .post(
        new URL("/api/v1/admin/tds/filtered_list", themeConfig.backendUrl),
        params
      )
      .then((res) => {
        setTaxCode(res.data.data);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const getSupplierData = () => {
    axios
      .post(
        new URL(
          // "/api/v1/supplier/supplier/listsupplier",
          // themeConfig.backendUrl
          `/api/v1/supplier/supplier/view/${id}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        setSupplierData(res.data.data);
        setEditData(res.data.data);
        setEditBusinessData(res.data.data.business_details);
        setEditFinancialData(res.data.data.finance_details);
        console.log(res);
        const status = res.data.data.status;
        status === "approved"
          ? setApproveButtonDisabled(true)
          : setApproveButtonDisabled(false);
        if (res.data.error) {
          toast.error(res.data.message);
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
            label: item.code + " - " + item.name,
          })
        );
        setReconciliationOptions(reconciliationlist);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };

  const getPayment = (data) => {
    axios
      .post(new URL("/api/v1/admin/paymentTerms/list", themeConfig.backendUrl))
      .then((res) => {
        const paymentTermlist = res.data.data.rows?.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.code + " - " + item.name,
          code: item.code,
        }));

        setPaymentTermData(paymentTermlist);
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
          label: item.code === null ? item.name : item.code + " - " + item.name,
          code: item.code,
        }));
        const companyList = res.data.data.getCompanies.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.code === null ? item.name : item.code + " - " + item.name,
          code: item.code,
        }));

        const schemaList = res.data.data.getVendorSchema.map((item) => ({
          id: item.id,
          value: item.name,
          label: item.code === null ? item.name : item.code + " - " + item.name,
          code: item.code,
        }));
        const businesspartnerList = res.data.data.getBusinessPartnerGroup.map(
          (item) => ({
            id: item.id,
            value: item.name,
            label:
              item.code === null ? item.name : item.code + " - " + item.name,
            code: item.code,
          })
        );
        const purchaseGroupList = res.data.data.getPurchaseGroup.map(
          (item) => ({
            id: item.id,
            value: item.name,
            label:
              item.code === null ? item.name : item.code + " - " + item.name,
            code: item.code,
          })
        );
        setVendorData(vendorList);
        setPurchaseGroupData(purchaseGroupList);
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
      // user_id: userData.id,
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
        setTableData(res.data.data);
      });
  };
  useEffect(() => {}, [reconciliationOptions, reconciliationLable]);

  const getAddtionalDetails = () => {
    axios
      .post(
        new URL(
          `/api/v1/supplier/addCoDetails/view/${id}`,
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
    if (value) {
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
          }
        });
    } else {
      toast.error("Enter Remarks");
      setApproveShow(false);
      setRejectShow(false);
      setQueryShow(false);
    }
  };

  useEffect(() => {
    getSupplierData();
    getAddCoDetails();
    getAddtionalDetails();
    getReconDetails();
    getWorkflowInfo();
    getPayment();
    getTds();
    // getUpdateTds();
  }, []);
  const [count, setCount] = useState(1);

  const increaseCount = () => {
    setCount(count + 1);
  };

  const deleteForm = (e) => {
    e.preventDefault();
    e.target.closest("form").remove();
  };
  const headerStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
  const AdditionalHeader = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#6610f2",
    color: "rgb(255, 255, 255)",
  };

  const handleEdit = () => {
    setToggle(true);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };
  const handleBusinessOnChange = (e) => {
    const { name, value } = e.target;
    setEditBusinessData({ ...editBusinessData, [name]: value });
  };
  const handleFinancialOnChange = (e) => {
    const { name, value } = e.target;
    setEditFinancialData({ ...editFinancialData, [name]: value });
  };

  const handleUpdate = () => {
    // console.log(editedData);
    setToggle(false);
  };

  return (
    <Fragment>
      <div className="content-header">
        <h3
          style={{
            padding: "20px 0px",
            // fontWeight: "bold",
          }}
          className="mb-0"
        >
          {/* {editData ? editData.supplier_name + "’ Details" : ""} */}
        </h3>
      </div>
      {supplierData ? (
        <>
          <CardBody>
            <Row>
              <Col md="12" className="mb-1">
                <Input
                  disabled
                  style={{
                    padding: "15px",
                    backgroundColor:
                      supplierData && supplierData.status === "approved"
                        ? "#28c76f"
                        : supplierData.status === "pending"
                        ? "#7367f0"
                        : supplierData.status === "verified"
                        ? "#00cfe8"
                        : supplierData.status === "queried"
                        ? "#e06522"
                        : supplierData.status === "rejected"
                        ? "#ea5455"
                        : "white",

                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  type="text"
                  name="name"
                  id="nameVertical"
                  value={
                    supplierData
                      ? supplierData?.status?.charAt(0).toUpperCase() +
                        supplierData?.status?.slice(1).toLowerCase()
                      : ""
                  }
                />
              </Col>
            </Row>
          </CardBody>
          <div className="mb-2 d-flex justify-content-end">
            <Button color="primary" onClick={handleEdit}>
              <Edit size={14} className="me-75" />
              Edit
            </Button>
          </div>
          <Card
            className="border-primary"
            style={{
              backgroundColor: "",
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
                <Col md="3" className="mb-1">
                  <label class="pb-0 mb-1" style={headerText}>
                    Pan No.
                  </label>
                  <Input
                    type="text"
                    name="panCard"
                    id="panCardVertical"
                    disabled
                    value={supplierData ? supplierData.panNo : ""}
                    placeholder="---"
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col md="12" sm="12" className="mb-1">
              <Card className={toggle ? "border-success" : "border-primary"}>
                <h4 color="primary" style={headerStyle}>
                  <Business fontSize="large" /> Company Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4  py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Source
                    </label>
                    <Input
                      disabled={toggle ? false : true}
                      type="text"
                      name="source"
                      id="nameVertical"
                      value={editData ? editData.source : " "}
                      placeholder="---"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Street Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="streetNo"
                        id="streetNoVertical"
                        value={editData ? editData.streetNo : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 1
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="address1"
                        id="address1Vertical"
                        value={editData ? editData.address1 : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 2
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="address2"
                        id="address2Vertical"
                        value={editData ? editData.address2 : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 3
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="address3"
                        id="address3Vertical"
                        value={editData ? editData.address3 : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Country
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="country"
                        id="countryVertical"
                        value={editData ? editData.country : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      State
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="state"
                        id="stateVertical"
                        value={editData ? editData.state : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      City
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="city"
                        id="cityVertical"
                        value={editData ? editData.city : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Pin / Zip Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="pin"
                        id="pinVertical"
                        value={editData ? editData.pin : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Phone Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="phoneNo"
                        id="phoneNoVertical"
                        value={editData ? editData.phoneNo : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Website
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="website"
                        id="websiteVertical"
                        value={editData ? editData.website : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Payment Method
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="paymentMethod"
                        id="paymentMethodVertical"
                        value={editData ? editData.paymentMethod : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Overseas office details(if any)
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="officeDetails"
                        id="officeDetailsVertical"
                        value={editData ? editData.officeDetails : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Aadhar Card
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="aadharNo"
                        id="aadharNoVertical"
                        value={editData ? editData.aadharNo : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      CIN Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="cinNo"
                        id="cinNoVertical"
                        value={editData ? editData.cinNo : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                  <h4 className="mt-3" style={{ color: "#E06522" }}>
                    <PhoneAndroid /> Contact Details
                  </h4>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Contact Person Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="contactPersonName"
                        id="cinNoVertical"
                        value={editData ? editData.contactPersonName : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Designation
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="designation"
                        id="cinNoVertical"
                        value={editData ? editData.designation : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Telephone
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="telephone"
                        id="cinNoVertical"
                        value={editData ? editData.telephone : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Mobile
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="mobile"
                        id="cinNoVertical"
                        value={editData ? editData.mobile : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Email ID
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="emailID"
                        id="cinNoVertical"
                        value={editData ? editData.emailID : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Card className={toggle ? "border-success" : "border-primary"}>
                <h4 color="primary" style={headerStyle}>
                  <BusinessCenterOutlined fontSize="large" /> Business Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MSME No.
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="msme_no"
                        id="msme_no"
                        value={
                          editBusinessData
                            ? editBusinessData.business_details?.msme_no
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MSME Type
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="msme_type"
                        id="msme_type"
                        value={
                          editBusinessData
                            ? editBusinessData.business_details?.msmeType
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Company Founded Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="companyFoundYear"
                        id="companyFoundYearVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.companyFoundYear
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Promoter / Director Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="promoterName"
                        id="promoterNameVertical"
                        value={
                          editBusinessData ? editBusinessData.promoterName : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Company Type
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="companyType"
                        id="companyTypeVertical"
                        value={
                          editBusinessData ? editBusinessData.companyType : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Name of Business / Corporate Group
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="nameOfBusiness"
                        id="nameOfBusinessVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.nameOfBusiness
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Business Type
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="businessType"
                        id="businessTypeVertical"
                        value={
                          editBusinessData ? editBusinessData.businessType : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address of Plant / Workshop
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="addressOfPlant"
                        id="addressOfPlantVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.addressOfPlant
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Name of Other Group Companies / Sister Concern
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="nameOfOtherGroupCompanies"
                        id="nameOfOtherGroupCompaniesVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.nameOfOtherGroupCompanies
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      List of Major Customers
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="listOfMajorCustomers"
                        id="listOfMajorCustomersVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.listOfMajorCustomers
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Details of Major Orders Undertaken in Last 5 Years
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="detailsOfMajorLastYear"
                        id="detailsOfMajorLastYearVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.detailsOfMajorLastYear
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Card className={toggle ? "border-success" : "border-primary"}>
                <h4 color="primary" style={headerStyle}>
                  <AttachMoney fontSize="large" /> Financial Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Currency
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="currency"
                        id="currencyVertical"
                        value={
                          editFinancialData ? editFinancialData?.currency : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover"
                        id="turnoverVertical"
                        value={
                          editFinancialData ? editFinancialData.turnover : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover2"
                        id="turnover2Vertical"
                        value={
                          editFinancialData ? editFinancialData.turnover2 : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover3"
                        id="turnover3Vertical"
                        value={
                          editFinancialData ? editFinancialData.turnover3 : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="first"
                        id="firstVertical"
                        value={editFinancialData ? editFinancialData.first : ""}
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="second"
                        id="secondVertical"
                        value={
                          editFinancialData ? editFinancialData.second : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="third"
                        id="thirdVertical"
                        value={editFinancialData ? editFinancialData.third : ""}
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="afterfirst"
                        id="afterfirstVertical"
                        value={
                          editFinancialData ? editFinancialData.afterfirst : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="aftersecond"
                        id="aftersecondVertical"
                        value={
                          editFinancialData ? editFinancialData.aftersecond : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="afterthird"
                        id="afterthirdVertical"
                        value={
                          editFinancialData ? editFinancialData.afterthird : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Present Order Booking Value
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="presentorder"
                        id="presentorderVertical"
                        value={
                          editFinancialData
                            ? editFinancialData.presentorder
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Further Order Booking Value
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="furtherorder"
                        id="furtherorderVertical"
                        value={
                          editFinancialData
                            ? editFinancialData.furtherorder
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Market Capital
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="market"
                        id="marketVertical"
                        value={
                          editFinancialData ? editFinancialData.market : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Networth
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="networth"
                        id="networthVertical"
                        value={
                          editFinancialData ? editFinancialData.networth : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="supply-heading">
                    <h4 class="card-title py-2" style={{ color: "#E06522" }}>
                      <AccountBalance /> Primary Bank Details
                    </h4>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_name"
                        id="p_bank_name"
                        value={
                          editFinancialData ? editFinancialData.p_bank_name : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Account Number
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_account_number"
                        id="p_bank_account_number"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_account_number
                            : ""
                        }
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Holder Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_account_holder_name"
                        id="p_bank_account_holder_name"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_account_holder_name
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank state
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_state"
                        id="p_bank_state"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_state
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Address
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_address"
                        id="p_bank_address"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_address
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Branch
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_branch"
                        id="p_bank_branch"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_branch
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      IFSC Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_ifsc_code"
                        id="p_ifsc_code"
                        value={
                          editFinancialData ? editFinancialData.p_ifsc_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_micr_code"
                        id="p_micr_code"
                        value={
                          editFinancialData ? editFinancialData.p_micr_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_micr_code"
                        id="p_micr_code"
                        value={
                          editFinancialData ? editFinancialData.p_micr_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Guarantee Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_guarantee_limit"
                        id="p_bank_guarantee_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_guarantee_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Over Draft / Cash Credit Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_overdraft_cash_credit_limit"
                        id="p_overdraft_cash_credit_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.p_overdraft_cash_credit_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="supply-heading">
                    <h4 class="card-title py-2" style={{ color: "#E06522" }}>
                      <AccountBalanceTwoTone /> Secondary Bank Details
                    </h4>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_name"
                        id="s_bank_name"
                        value={
                          editFinancialData ? editFinancialData.s_bank_name : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Account Number
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_account_number"
                        id="s_bank_account_number"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_account_number
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Holder Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_account_holder_name"
                        id="s_bank_account_holder_name"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_account_holder_name
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank state
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_state"
                        id="s_bank_state"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_state
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Address
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_address"
                        id="s_bank_address"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_address
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Branch
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_branch"
                        id="s_bank_branch"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_branch
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      IFSC Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_ifsc_code"
                        id="s_ifsc_code"
                        value={
                          editFinancialData ? editFinancialData.s_ifsc_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_micr_code"
                        id="s_micr_code"
                        value={
                          editFinancialData ? editFinancialData.s_micr_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_micr_code"
                        id="s_micr_code"
                        value={
                          editFinancialData ? editFinancialData.s_micr_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Guarantee Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_bank_guarantee_limit"
                        id="s_bank_guarantee_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.s_bank_guarantee_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Over Draft / Cash Credit Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="s_overdraft_cash_credit_limit"
                        id="s_overdraft_cash_credit_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.s_overdraft_cash_credit_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col md="12" sm="12" className="mb-1">
              <Card className="border-primary">
                <h4 color="primary" style={headerStyle}>
                  <PointOfSale fontSize="large" /> Tax Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      GST Number
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="gstno"
                        id="gstnoVertical"
                        value={
                          supplierData ? supplierData.tax_details.gstno : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      GST Registration Date
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="gstRegDate"
                        id="gstRegDateVertical"
                        value={
                          supplierData
                            ? supplierData.tax_details.gstRegDate
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      PAN Card
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="panCard"
                        id="panCardVertical"
                        value={editData ? editData.panNo : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col md="12" sm="12" className="mb-1">
              <Card className="border-primary">
                <h4 color="primary" style={headerStyle}>
                  <AttachFile fontSize="large" /> File Attachments
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4  py-2">
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
                        style={{
                          width: "100px",
                          marginTop: "5px",
                        }}
                        alt="Pan card"
                        onClick={() => {
                          setShow(true);
                          setImgSrc(panImage);
                        }}
                      />
                    )}
                  </div>

                  <div class="col-md-4  py-2">
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
                        style={{
                          width: "100px",
                          marginTop: "5px",
                        }}
                        alt="MSME"
                        onClick={() => {
                          setShow(true);
                          setImgSrc(msmeImage);
                        }}
                      />
                    )}
                  </div>

                  <div class="col-md-4  py-2">
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
                          style={{
                            width: "100px",
                            marginTop: "5px",
                          }}
                          alt="GST"
                          onClick={() => {
                            setShow(true);
                            setImgSrc(gstImage);
                          }}
                        />
                      </>
                    )}
                  </div>

                  <div class="col-md-4  py-2">
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
                          style={{
                            width: "100px",
                            marginTop: "5px",
                          }}
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
              </Card>
            </Col>
          </Row>

          <Col md="12" sm="12" className="mb-1">
            <Card className="border-primary">
              <h4 color="primary" style={headerStyle}>
                <AssignmentInd fontSize="large" /> Approval Process
              </h4>
              <div className="row" style={cardStyle}>
                <CardBody>
                  <Table size="sm" responsive>
                    <thead>
                      <tr>
                        <th>No.</th>
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
                  <Row>
                    <Col md={6}>
                      <div className="form-floating mb-0 mt-3">
                        <Input
                          name="text"
                          value={value}
                          type="textarea"
                          id="exampleText"
                          placeholder="---"
                          style={{
                            minHeight: "100px",
                          }}
                          onChange={(e) => setValue(e.target.value)}
                          className={classnames({
                            "text-danger": value?.length > 200,
                          })}
                        />
                        <Label className="form-label" for="textarea-counter">
                          Remarks
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <span
                    className={classnames("textarea-counter-value float-end", {
                      "bg-danger": value?.length > 200,
                    })}
                  >
                    {displayValue}
                  </span>
                </CardBody>
              </div>
            </Card>
            <Button color="primary" onClick={handleUpdate}>
              <Upgrade size={14} className="me-75" />
              Update
            </Button>
          </Col>
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

export default SupplierDetails;

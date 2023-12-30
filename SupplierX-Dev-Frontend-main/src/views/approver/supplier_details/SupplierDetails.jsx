// ** React Imports
import axios from "axios";
import { Fragment, useState } from "react";
import NoImage from "@src/assets/images/noImage.jpg";
import ErrorPic from "@src/assets/images/404Pic.png";
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
  LocationCityOutlined,
  Loupe,
  Phone,
  PhoneAndroid,
  PointOfSale,
  Preview,
  Reviews,
} from "@mui/icons-material";
import { element } from "prop-types";

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
  const id = location.state.id;
  const targetId = id;
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
  const otherImage = supplierData?.tax_details?.otherAttachments
    ? supplierData?.tax_details?.otherAttachments
    : NoImage;
  const gstImage = supplierData?.tax_details?.gstImage
    ? supplierData.tax_details.gstImage
    : NoImage;
  const chequeImage = supplierData?.tax_details?.cancelledChequeImage
    ? supplierData.tax_details.cancelledChequeImage
    : NoImage;
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [tdsValues, setTdsValues] = useState([
    { taxType: null, taxCode: null, recipientType: null, wtSubjct: null },
  ]);
  const handleChange = (i, field, value) => {
    const newFormValues = tdsValues.map((item, index) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setTdsValues(newFormValues);
  };

  let addFormFields = () => {
    setTdsValues([
      ...tdsValues,
      { taxType: null, taxCode: null, recipientType: null, wtSubjct: false },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = tdsValues.filter((item, index) => index !== i);
    setTdsValues(newFormValues);
  };

  useEffect(() => {
    if (supplierData) {
      supplierData.gstNo ? setVendor(1) : setVendor(9);
    }
  });

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
  const handlePaymentTerm = (selected) => {
    setPayment(selected.id);
    setPaymentLabel({ label: selected.label, value: selected.label });
  };
  const handlePurchaseGroup = (selected) => {
    setPurchaseGroup(selected.id);
    setPurchaseGroupLabel({ label: selected.label, value: selected.label });
  };
  const supplierRegistration = useSelector(
    (state) => state.supplierRegistration
  );
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [showcard, setShowcard] = useState(false);
  const [noData, setNoData] = useState(false);
  const [showsavebutton, setShowsavebutton] = useState(true);
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);
  const displayValue = value ? `${value.length}/200` : `0/200`;
  const submitAdData = () => {
    const modifiedTdsValues = tdsValues.map((item) => ({
      ...item,
      wtSubjct: item.wtSubjct === true ? "X" : null,
    }));
    const adData = {
      supplier_id: supplierID,
      companies: companies,
      reconciliationAc: reconciliation,
      vendor_class: vendor,
      vendor_schema: vendorschema,
      business_partner_group: businesspartner,
      payment_terms: payment,
      purchase_group: purchaseGroup,
      itWitholding: modifiedTdsValues,
    };
    axios
      .post(themeConfig.backendUrl + "v1/supplier/addCoDetails/create", adData)
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

  const saveAdditionalInfo = () => {
    if (isSelectEmpty(selectedCompanies)) {
      toast.error("Select Company");
    } else if (isSelectEmpty(reconciliation)) {
      toast.error("Reconciliation Account field is empty.");
    } else if (isSelectEmpty(vendorschema)) {
      toast.error("Vendor Schema field is empty.");
    } else if (isSelectEmpty(businesspartner)) {
      toast.error("Business Partner Grouping field is empty.");
    } else if (isSelectEmpty(payment)) {
      toast.error("Payment terms field is empty.");
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
        new URL(`/api/v1/supplier/supplier/view/${id}`, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          setNoData(true);
          toast.error(res.data.message);
        } else {
          setSupplierData(res.data.data);
          const status = res.data.data.status;
          status === "approved"
            ? setApproveButtonDisabled(true)
            : setApproveButtonDisabled(false);
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
        console.log(res.data);
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
      approver_level: 1,
      comment: value,
      // approver_hr_level: data.hierarchy_level,
      approver_hr_level: 1,
      subscriber_id: 1,
      // subscriber_id: data.subscriber_id,
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
  const sendToAPI = () => {
    console.log(tdsValues, "Tds Values");
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
  const glassEffectStyle4 = {
    // border: "2px solid rgba(255, 255, 255, 0.027)",
    // borderRadius: "10px",
    // backdropFilter: "blur(5px)",
    // boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
    // color: "white",
    // background: "linear-gradient(135deg, #ed9121, #ed9121 ,#ed9121)",
  };
  return (
    <Fragment>
      {supplierData ? (
        <>
          <div className="content-header">
            <h3
              style={{
                padding: "20px 0px",
                // fontWeight: "bold",
              }}
              className="mb-0"
            >
              Review Supplier Details
            </h3>
          </div>
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
          <Card className="border-primary" style={glassEffectStyle4}>
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
              <Card className="border-primary" style={glassEffectStyle4}>
                <h4 color="primary" style={headerStyle}>
                  <Business fontSize="large" /> Company Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div>
                    <Card>
                      <CardHeader>
                        <h4 className="card-title">TDS</h4>
                      </CardHeader>

                      <CardBody>
                        {addCompanyData?.itWitholding ? (
                          <>
                            {addCompanyData.itWitholding.map(
                              (element, index) => (
                                <div key={index}>
                                  <Row className="justify-content-between align-items-center mt-1">
                                    <Col md={3} className="mb-md-0 mb-1">
                                      <Label>With Holding Tax Type:</Label>
                                      <Select
                                        theme={selectThemeColors}
                                        className="react-select"
                                        classNamePrefix="select"
                                        isDisabled={
                                          addCompanyData?.itWitholding &&
                                          addCompanyData.itWitholding[0]
                                        }
                                        option={taxType}
                                        value={{
                                          label: element.taxType,
                                          value: element.taxType,
                                        }}
                                        options={taxType?.map((option) => {
                                          return {
                                            label: option.type,
                                            value: option.type,
                                          };
                                        })}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "taxType",
                                            e.value
                                          );
                                          TaxCode(e);
                                        }}
                                      />
                                    </Col>
                                    <Col md={3} className="mb-md-0 mb-1">
                                      <Label>With Holding Tax Code:</Label>
                                      <Select
                                        theme={selectThemeColors}
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={{
                                          label: element.taxCode,
                                          value: element.taxCode,
                                        }}
                                        isDisabled={
                                          addCompanyData?.itWitholding &&
                                          addCompanyData.itWitholding[0]
                                        }
                                        required
                                        option={taxCode}
                                        options={taxCode?.map((option) => {
                                          return {
                                            label: option.code,
                                            value: option.code,
                                          };
                                        })}
                                        onChange={(e) =>
                                          handleChange(
                                            index,
                                            "taxCode",
                                            e.value
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col md={3} className="mb-md-0 mb-1">
                                      <Label>Type Of Recipient</Label>
                                      <Select
                                        theme={selectThemeColors}
                                        className="react-select"
                                        classNamePrefix="select"
                                        isDisabled={
                                          addCompanyData?.itWitholding &&
                                          addCompanyData.itWitholding[0]
                                        }
                                        required
                                        value={{
                                          label: element.recipientType,
                                          value: element.recipientType,
                                        }}
                                        option={recepient}
                                        options={recepient?.map((option) => {
                                          return {
                                            label: option.name,
                                            value: option.code,
                                          };
                                        })}
                                        onChange={(e) =>
                                          handleChange(
                                            index,
                                            "recipientType",
                                            e.value
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col md={2} className="mb-md-0 mb-1">
                                      <Label>Select</Label>
                                      <Input
                                        id="subject"
                                        name="subject"
                                        type="checkbox"
                                        checked={element.wtSubjct}
                                        disabled={
                                          addCompanyData?.itWitholding &&
                                          addCompanyData.itWitholding[0]
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            index,
                                            "wtSubjct",
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          <>
                            {tdsValues.map((element, index) => (
                              <div key={index}>
                                <Row className="justify-content-between align-items-center mt-1">
                                  <Col md={3} className="mb-md-0 mb-1">
                                    <Label>With Holding Tax Type:</Label>
                                    <Select
                                      theme={selectThemeColors}
                                      className="react-select"
                                      classNamePrefix="select"
                                      isDisabled={
                                        addCompanyData?.itWitholding &&
                                        addCompanyData.itWitholding[0]
                                      }
                                      option={taxType}
                                      value={{
                                        label: element.taxType,
                                        value: element.taxType,
                                      }}
                                      options={taxType?.map((option) => {
                                        return {
                                          label: option.type,
                                          value: option.type,
                                        };
                                      })}
                                      onChange={(e) => {
                                        handleChange(index, "taxType", e.value);
                                        TaxCode(e);
                                      }}
                                    />
                                  </Col>
                                  <Col md={3} className="mb-md-0 mb-1">
                                    <Label>With Holding Tax Code:</Label>
                                    <Select
                                      theme={selectThemeColors}
                                      className="react-select"
                                      classNamePrefix="select"
                                      value={{
                                        label: element.taxCode,
                                        value: element.taxCode,
                                      }}
                                      isDisabled={
                                        addCompanyData?.itWitholding &&
                                        addCompanyData.itWitholding[0]
                                      }
                                      required
                                      option={taxCode}
                                      options={taxCode?.map((option) => {
                                        return {
                                          label: option.code,
                                          value: option.code,
                                        };
                                      })}
                                      onChange={(e) =>
                                        handleChange(index, "taxCode", e.value)
                                      }
                                    />
                                  </Col>
                                  <Col md={3} className="mb-md-0 mb-1">
                                    <Label>Type Of Recipient</Label>
                                    <Select
                                      theme={selectThemeColors}
                                      className="react-select"
                                      classNamePrefix="select"
                                      isDisabled={
                                        addCompanyData?.itWitholding &&
                                        addCompanyData.itWitholding[0]
                                      }
                                      required
                                      value={{
                                        label: element.recipientType,
                                        value: element.recipientType,
                                      }}
                                      option={recepient}
                                      options={recepient?.map((option) => {
                                        return {
                                          label: option.name,
                                          value: option.code,
                                        };
                                      })}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "recipientType",
                                          e.value
                                        )
                                      }
                                    />
                                  </Col>
                                  <Col md={2} className="mb-md-0 mb-1">
                                    <Label>Subject</Label>
                                    <Input
                                      id="subject"
                                      name="subject"
                                      type="checkbox"
                                      checked={element.wtSubjct}
                                      disabled={
                                        addCompanyData?.itWitholding &&
                                        addCompanyData.itWitholding[0]
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "wtSubjct",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </Col>
                                </Row>
                                {index ? (
                                  <Col md={3} className="mb-md-0 mt-1 mb-1">
                                    <Button
                                      color="danger"
                                      className="text-nowrap px-1"
                                      onClick={() => removeFormFields(index)}
                                      outline
                                    >
                                      <X size={14} className="me-40" />
                                      Remove
                                    </Button>
                                  </Col>
                                ) : null}
                              </div>
                            ))}
                            <div className="button-section mt-1">
                              <Button
                                className="btn-icon"
                                color="primary"
                                onClick={() => addFormFields()}
                              >
                                <Plus size={14} />
                                <span className="align-middle ms-25">
                                  Add New
                                </span>
                              </Button>
                            </div>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                  <div class="col-md-4  py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Source
                    </label>
                    <Input
                      disabled
                      type="text"
                      name="name"
                      id="nameVertical"
                      value={supplierData ? supplierData.source : ""}
                      placeholder="---"
                    />
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Registering Authority
                    </label>
                    <div style={font600} id="registeringAuthority">
                      <Input
                        disabled
                        type="text"
                        name="registeringAuthority"
                        id="registeringAuthority"
                        value={supplierData ? supplierData.department : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Street Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="streetNo"
                        id="streetNoVertical"
                        value={supplierData ? supplierData.streetNo : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 1
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="address1"
                        id="address1Vertical"
                        value={supplierData ? supplierData.address1 : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 2
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="address2"
                        id="address2Vertical"
                        value={supplierData ? supplierData.address2 : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address 3
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="address3"
                        id="address3Vertical"
                        value={supplierData ? supplierData.address3 : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Country
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="country"
                        id="countryVertical"
                        value={supplierData ? supplierData.country : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      State
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="state"
                        id="stateVertical"
                        value={supplierData ? supplierData.state : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      City
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="city"
                        id="cityVertical"
                        value={supplierData ? supplierData.city : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Pin / Zip Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="pin"
                        id="pinVertical"
                        value={supplierData ? supplierData.pin : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Phone Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="phoneNo"
                        id="phoneNoVertical"
                        value={supplierData ? supplierData.phoneNo : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Website
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="website"
                        id="websiteVertical"
                        value={supplierData ? supplierData.website : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Payment Method
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="paymentMethod"
                        id="paymentMethodVertical"
                        value={supplierData ? supplierData.paymentMethod : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Overseas office details(if any)
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="officeDetails"
                        id="officeDetailsVertical"
                        value={supplierData ? supplierData.officeDetails : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Aadhar Card
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="aadharNo"
                        id="aadharNoVertical"
                        value={supplierData ? supplierData.aadharNo : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      CIN Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="cinNo"
                        id="cinNoVertical"
                        value={supplierData ? supplierData.cinNo : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <h4 className="mt-3" style={{ color: "#fff" }}>
                    <PhoneAndroid /> Contact Details
                  </h4>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Contact Person Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="contactPersonName"
                        id="cinNoVertical"
                        value={
                          supplierData ? supplierData.contactPersonName : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Designation
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="designation"
                        id="cinNoVertical"
                        value={supplierData ? supplierData.designation : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Telephone
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="telephone"
                        id="cinNoVertical"
                        value={supplierData ? supplierData.telephone : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Mobile
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="mobile"
                        id="cinNoVertical"
                        value={supplierData ? supplierData.mobile : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Email ID
                    </label>
                    <div style={font600}>
                      <Input
                        disabled
                        type="text"
                        name="emailID"
                        id="cinNoVertical"
                        value={supplierData ? supplierData.emailID : ""}
                        placeholder="---"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Card className="border-primary" style={glassEffectStyle4}>
                <h4 color="primary" style={headerStyle}>
                  <BusinessCenterOutlined fontSize="large" /> Business Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MSME No.
                    </label>
                    <div style={font600} id="msme_no">
                      <Input
                        disabled
                        type="text"
                        name="msme_no"
                        id="msme_no"
                        value={
                          supplierData
                            ? supplierData?.business_details?.msme_no
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MSME Type
                    </label>
                    <div style={font600} id="msme_no">
                      <Input
                        disabled
                        type="text"
                        name="msme_no"
                        id="msme_no"
                        value={
                          supplierData
                            ? supplierData?.business_details?.msmeType
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Company Founded Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Promoter / Director Name
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Company Type
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Name of Business / Corporate Group
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Business Type
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Address of Plant / Workshop
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Name of Other Group Companies / Sister Concern
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      List of Major Customers
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Details of Major Orders Undertaken in Last 5 Years
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="detailsOfMajorLastYear"
                        id="detailsOfMajorLastYearVertical"
                        value={
                          supplierData
                            ? supplierData.business_details
                                .detailsOfMajorLastYear
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Card className="border-primary" style={glassEffectStyle4}>
                <h4 color="primary" style={headerStyle}>
                  <AttachMoney fontSize="large" /> Financial Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Currency
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
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

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 1st Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="turnover"
                        id="turnoverVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.turnover
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 2nd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="turnover2"
                        id="turnover2Vertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.turnover2
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Annual Turnover of 3rd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="turnover3"
                        id="turnover3Vertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.turnover3
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 1st Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="first"
                        id="firstVertical"
                        value={
                          supplierData ? supplierData.finance_details.first : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 2nd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="second"
                        id="secondVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.second
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit Before Tax of 3rd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="third"
                        id="thirdVertical"
                        value={
                          supplierData ? supplierData.finance_details.third : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 1st Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="afterfirst"
                        id="afterfirstVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.afterfirst
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 2nd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="aftersecond"
                        id="aftersecondVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.aftersecond
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Profit After Tax of 3rd Year
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="afterthird"
                        id="afterthirdVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.afterthird
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Present Order Booking Value
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="presentorder"
                        id="presentorderVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.presentorder
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Further Order Booking Value
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="furtherorder"
                        id="furtherorderVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.furtherorder
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Market Capital
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="market"
                        id="marketVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.market
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>

                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Networth
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="networth"
                        id="networthVertical"
                        value={
                          supplierData
                            ? supplierData.finance_details.networth
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div className="supply-heading">
                    <h4 class="card-title py-2" style={{ color: "#fff" }}>
                      <AccountBalance /> Primary Bank Details
                    </h4>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Name
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_name"
                        id="p_bank_name"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_bank_name
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Account Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_account_number"
                        id="p_bank_account_number"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_bank_account_number
                            : ""
                        }
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Holder Name
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_account_holder_name"
                        id="p_bank_account_holder_name"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .p_bank_account_holder_name
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank state
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_state"
                        id="p_bank_state"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_bank_state
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Address
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_address"
                        id="p_bank_address"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_bank_address
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Branch
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_branch"
                        id="p_bank_branch"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_bank_branch
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      IFSC Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_ifsc_code"
                        id="p_ifsc_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_ifsc_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_micr_code"
                        id="p_micr_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_micr_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_micr_code"
                        id="p_micr_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.p_micr_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Guarantee Limit
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_bank_guarantee_limit"
                        id="p_bank_guarantee_limit"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .p_bank_guarantee_limit
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Over Draft / Cash Credit Limit
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="p_overdraft_cash_credit_limit"
                        id="p_overdraft_cash_credit_limit"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .p_overdraft_cash_credit_limit
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div className="supply-heading">
                    <h4 class="card-title py-2" style={{ color: "#fff" }}>
                      <AccountBalanceTwoTone /> Secondary Bank Details
                    </h4>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Name
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_name"
                        id="s_bank_name"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_bank_name
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Account Number
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_account_number"
                        id="s_bank_account_number"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_bank_account_number
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Holder Name
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_account_holder_name"
                        id="s_bank_account_holder_name"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .s_bank_account_holder_name
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank state
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_state"
                        id="s_bank_state"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_bank_state
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Address
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_address"
                        id="s_bank_address"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_bank_address
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Branch
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_branch"
                        id="s_bank_branch"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_bank_branch
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      IFSC Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_ifsc_code"
                        id="s_ifsc_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_ifsc_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_micr_code"
                        id="s_micr_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_micr_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_micr_code"
                        id="s_micr_code"
                        value={
                          supplierData
                            ? supplierData.finance_details.s_micr_code
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Bank Guarantee Limit
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_bank_guarantee_limit"
                        id="s_bank_guarantee_limit"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .s_bank_guarantee_limit
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      Over Draft / Cash Credit Limit
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        disabled
                        type="text"
                        name="s_overdraft_cash_credit_limit"
                        id="s_overdraft_cash_credit_limit"
                        value={
                          supplierData
                            ? supplierData.finance_details
                                .s_overdraft_cash_credit_limit
                            : ""
                        }
                        placeholder="---"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col md="12" sm="12" className="mb-1">
              <Card className="border-primary" style={glassEffectStyle4}>
                <h4 color="primary" style={headerStyle}>
                  <PointOfSale fontSize="large" /> Tax Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div class="col-md-4 py-2">
                    <label class="pb-0 mb-1" style={headerText}>
                      GST Number
                    </label>
                    <div style={font600} id="review_country">
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
                        value={supplierData ? supplierData.panNo : ""}
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
                    {panImage.includes(".pdf") ||
                    panImage.includes(".PDF") ||
                    panImage.includes(".doc") ||
                    panImage.includes(".DOC") ||
                    panImage.includes("docx") ||
                    panImage.includes("DOCX") ? (
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

                  <div class="col-md-4  py-2">
                    <label class="pb-0" style={headerText}>
                      MSME
                    </label>
                    <br />
                    {msmeImage.includes(".pdf") ||
                    msmeImage.includes(".PDF") ||
                    msmeImage.includes(".doc") ||
                    msmeImage.includes(".DOC") ||
                    msmeImage.includes("docx") ||
                    msmeImage.includes("DOCX") ? (
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

                  <div class="col-md-4  py-2">
                    <label class="pb-0" style={headerText}>
                      GST Certificate
                    </label>
                    <br />
                    {gstImage.includes(".pdf") ||
                    gstImage.includes(".PDF") ||
                    gstImage.includes(".doc") ||
                    gstImage.includes(".DOC") ||
                    gstImage.includes("docx") ||
                    gstImage.includes("DOCX") ? (
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

                  <div class="col-md-4  py-2">
                    <label class="pb-0" style={headerText}>
                      Cancelled Cheque:
                    </label>
                    <br />
                    {chequeImage.includes(".pdf") ||
                    chequeImage.includes(".PDF") ||
                    chequeImage.includes(".doc") ||
                    chequeImage.includes(".DOC") ||
                    chequeImage.includes("docx") ||
                    chequeImage.includes("DOCX") ? (
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

                  <div class="col-md-4  py-2">
                    <label class="pb-0" style={headerText}>
                      Other Attachments
                    </label>
                    <br />
                    {otherImage.includes(".pdf") ||
                    otherImage.includes(".PDF") ||
                    otherImage.includes(".doc") ||
                    otherImage.includes(".DOC") ||
                    otherImage.includes("docx") ||
                    otherImage.includes("DOCX") ? (
                      <a href={otherImage} target="_blank">
                        Open File
                      </a>
                    ) : (
                      <img
                        src={otherImage}
                        style={{ width: "100px", marginTop: "5px" }}
                        alt="Pan card"
                        onClick={() => {
                          setShow(true);
                          setImgSrc(otherImage);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Card
            style={{
              borderRadius: "5px",
              marginTop: "20px",
              marginBottom: showcard ? "5%" : "25%",
            }}
            className="border-warning"
          >
            <h4 color="primary" style={AdditionalHeader}>
              <Loupe fontSize="large" /> Additional Details
            </h4>

            <CardBody>
              <Row>
                <Col className="mb-1" md="4" sm="12">
                  <label className="pb-0 mb-1" style={headerText}>
                    Name of Company <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    value={
                      addCompanyData.companyname
                        ? addCompanyData.companyname.map((item) => ({
                            value: item,
                            label: item,
                          }))
                        : selectedCompanies
                    }
                    isDisabled={addCompanyData.companyname}
                    onChange={handleCompanyChange}
                    options={companyData}
                    isMulti
                    className="react-select"
                    classNamePrefix="select"
                    required
                  />
                </Col>
                <Col className="mb-1" md="4" sm="12">
                  <label class="pb-0 mb-1" style={headerText}>
                    Business Partner Grouping{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={businesspartnerData}
                    onChange={handleBusinessPartnerChange}
                    formatGroupLabel={formatGroupLabel}
                    className="react-select"
                    value={
                      addCompanyData.business_partner_groups_name
                        ? {
                            value: addCompanyData.business_partner_groups_name,
                            label: addCompanyData.business_partner_groups_name,
                          }
                        : {
                            value: businesspartnerlabel.value,
                            label: businesspartnerlabel.label,
                          }
                    }
                    isDisabled={addCompanyData.business_partner_groups_name}
                    required
                    classNamePrefix="select"
                  />
                </Col>
                <Col className="mb-1" md="4" sm="12">
                  <label className="pb-0 mb-1" style={headerText}>
                    Reconciliation Account{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    required
                    value={
                      addCompanyData.reconciliation_ac_name
                        ? {
                            value: addCompanyData.reconciliation_ac_name,
                            label: addCompanyData.reconciliation_ac_name,
                          }
                        : reconciliationLable // Use the state for options
                    }
                    isDisabled={addCompanyData.reconciliation_ac_name}
                    onChange={handleReconciliationChange}
                    options={reconciliationOptions} // Use the state for options
                    formatGroupLabel={formatGroupLabel}
                  />
                </Col>
                <Col className="mb-1 mt-1" md="4" sm="12">
                  <label class="pb-0 mb-1" style={headerText}>
                    Vendor Class <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={vendorData}
                    onChange={handleVendorChange}
                    defaultValue={
                      supplierData?.gstNo
                        ? {
                            value: "Registered",
                            label: "Registered",
                          }
                        : {
                            value: "Non-Registered",
                            label: "Non-Registered",
                          }
                    }
                    // value={
                    //   addCompanyData.vendor_class_name
                    //     ? {
                    //         value: addCompanyData.vendor_class_name,
                    //         label: addCompanyData.vendor_class_name,
                    //       }
                    //     : {
                    //         value: vendorlabel.value,
                    //         label: vendorlabel.label,
                    //       }
                    // }
                    isDisabled={true}
                    required
                    formatGroupLabel={formatGroupLabel}
                    className="react-select"
                    classNamePrefix="select"
                    // styles={{
                    //   menu: (provided, state) => ({
                    //     ...provided,
                    //     maxHeight: "150px",
                    //     overflowY: "auto",
                    //   }),
                    // }}
                  />
                </Col>
                <Col className="mb-1 mt-1" md="4" sm="12">
                  <label class="pb-0 mb-1" style={headerText}>
                    Vendor Schema <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={schemaData}
                    value={
                      addCompanyData.vendor_schema_name
                        ? {
                            value: addCompanyData.vendor_schema_name,
                            label: addCompanyData.vendor_schema_name,
                          }
                        : {
                            value: vendorschemalabel.value,
                            label: vendorschemalabel.label,
                          }
                    }
                    isDisabled={addCompanyData.vendor_schema_name}
                    required
                    onChange={handleSchemaChange}
                    formatGroupLabel={formatGroupLabel}
                    className="react-select"
                    classNamePrefix="select"
                    // styles={{
                    //   menu: (provided, state) => ({
                    //     ...provided,
                    //     maxHeight: "150px",
                    //     overflowY: "auto",
                    //   }),
                    // }}
                  />
                </Col>
                <Col className="mb-1 mt-1" md="4" sm="12">
                  <label class="pb-0 mb-1" style={headerText}>
                    Payment Terms <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={paymentTermData}
                    onChange={handlePaymentTerm}
                    formatGroupLabel={formatGroupLabel}
                    className="react-select"
                    value={
                      addCompanyData.payment_terms
                        ? {
                            value: addCompanyData.payment_terms_name,
                            label: addCompanyData.payment_terms_name,
                          }
                        : {
                            value: paymentLabel?.value,
                            label: paymentLabel?.label,
                          }
                    }
                    isDisabled={addCompanyData.payment_terms_name}
                    required
                    classNamePrefix="select"
                  />
                </Col>
                <Col className="mb-1 mt-1" md="4" sm="12">
                  <label class="pb-0 mb-1" style={headerText}>
                    Purchase Group <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={purchaseGroupData}
                    onChange={handlePurchaseGroup}
                    formatGroupLabel={formatGroupLabel}
                    className="react-select"
                    value={
                      addCompanyData.purchase_group
                        ? {
                            value: addCompanyData.purchase_group_name,
                            label: addCompanyData.purchase_group_name,
                          }
                        : {
                            value: purchaseGroupLabel?.value,
                            label: purchaseGroupLabel?.label,
                          }
                    }
                    isDisabled={addCompanyData.purchase_group}
                    required
                    classNamePrefix="select"
                  />
                </Col>
              </Row>
              <Button
                disabled={showsavebutton}
                color={showsavebutton ? "secondary" : "success"}
                onClick={saveAdditionalInfo}
                className="mt-2"
              >
                Save
              </Button>
              {supplierData && supplierData.status === "approved" ? (
                <p className="mt-1">The supplier has received approval.</p>
              ) : (
                ""
              )}
            </CardBody>
          </Card>

          <Col md="12" sm="12" className="mb-1">
            <Card
              style={{
                display: showcard ? "block" : "none",
              }}
              className="border-primary"
            >
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
                          style={{ minHeight: "100px" }}
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
          </Col>
          <div className="d-flex justify-content-start">
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
              Query
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
              Reject
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
          </div>
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
          <Modal
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
          </Modal>

          {/* Reject modal */}
          <Modal
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
          </Modal>

          {/* Approve modal */}
          <Modal
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
                    if (approverLevel === 1) {
                      const data = { status: "approved" };
                      sendStatus(data);
                    }
                    if (approverLevel === 2) {
                      const data = { status: "approved" };
                      sendStatus(data);
                    }
                    if (value) {
                      setApproveButtonDisabled(true);
                    } else {
                      setApproveButtonDisabled(false);
                    }
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
          </Modal>
        </>
      ) : noData ? (
        <div
          className="mt-0 d-flex flex-column align-items-center"
          // style={{ minHeight: "400px" }}
        >
          <img src={ErrorPic} className="img-fluid" alt="Error" width={450} />
          <h3>Couldn't fetch supplier data</h3>
        </div>
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

/* eslint-disable react/react-in-jsx-scope */
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";
import QRCode from "react-qr-code";
// import "../../assets/index.css";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Alert,
  Form,
  Input,
  Button,
  Row,
  Table,
  FormGroup,
  Card,
  CardBody,
  CardText,
  Label,
  Badge,
  Col,
  InputGroup,
} from "reactstrap";
import axios from "axios";
import { TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2, EyeOff } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { GoEye } from "react-icons/go";
import {
  Delete,
  PanoramaFishEye,
  RemoveRedEyeSharp,
} from "@mui/icons-material";
import { InputLabel } from "@mui/material";
import AddActions from "../apps/invoice/add/AddActions";
import QrCodeGenerator from "../components/QRCodeGenerator";
import asnimg from "../../assets/images/invoice2.png";
const MySwal = withReactContent(Swal);
const status = {
  0: { title: "pending", color: "light-warning" },
  1: { title: "Active", color: "light-success" },
  2: { title: "Deactive", color: "light-danger" },
};
const ASN = () => {
  const [url, setUrl] = useState({
    poNo: "12344444",
    podate: "10/12/23",
    asnNo: "1",
    plantId: "1000",
    supplierId: "1",
    deliveryDate: "27-12-2023",
    type: "Normal",
    carrier: "dhl express",
    status: "invoiced",
    lineItems: [
      {
        itemName: "Eno Packates",
        Quantity: 100,
        unit: "",
        materialCode: "",
        materialDescription: "",
        pricePerUnit: "",
        subTotal: "",
        hsnCode: "",
        weight: "",
        dimension: "",
      },
      {
        itemName: "Eno Packates",
        Quantity: 100,
        unit: "",
        materialCode: "",
        materialDescription: "",
        pricePerUnit: "",
        subTotal: "",
        hsnCode: "",
        weight: "",
        dimension: "",
      },
    ],
    gst: "",
    pan: "",
    irnNo: "",
    gstInvoiceNumber: "",
    shiptoaddress: "",
    billtoaddress: "",
    remarks: "",
    file: "",
    eWayBillNo: "",
  });
  const [qrIsVisible, setQrIsVisible] = useState(false);

  const handleQrCodeGenerator = () => {
    if (!url) {
      return;
    }
    setQrIsVisible(true);
  };
  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  // Calculate total amount of subtotals

  const [picker, setPicker] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("");
  const id = 4987;
  const [form, setForm] = useState({});
  const [data, setData] = useState(null);
  const [invoice, setInvoice] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceFileName, setInvoiveFileName] = useState("");
  const [unitsOption, setUnitsOption] = useState();
  const [orderlineData, setOrderLineData] = useState();
  const handleHSNCodeChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    updatedData[rowIndex].hsnCode = value;
    setOrderLineData(updatedData);
  };
  const handleWeightChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    updatedData[rowIndex].weight = value;
    setOrderLineData(updatedData);
  };
  const handleDimensionChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    updatedData[rowIndex].dimension = value;
    setOrderLineData(updatedData);
  };
  const handleUnitChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    updatedData[rowIndex].unit = value;
    setOrderLineData(updatedData);
  };
  const handleQtyChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    updatedData[rowIndex].Quantity = value;
    setOrderLineData(updatedData);
  };
  // const handleUnitChange = (rowIndex, selectedOption) => {
  //   const updatedData = [...orderlineData];
  //   updatedData[rowIndex].unit = selectedOption.value;
  //   setOrderLineData(updatedData);
  // };

  const handleClear = () => {
    setOrderLineData();
    window.location.reload(); // Reload the page to reset it
  };
  const [poList, setPoList] = useState([]);
  const [qrData, setQrData] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [poData, setPOData] = useState();
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
  });
  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(new URL("/api/v1/supplier/po/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        setPoList(res.data.data.PurchaseOrders);
        const mappedPurchaseOrders = res.data.data.PurchaseOrders.map(
          (item) => ({
            label: item.id,
            value: item.id,
          })
        );
        setPurchaseOrder(mappedPurchaseOrders);
      });

    axios
      .post(new URL("/api/v1/settings/uom/list", themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          return console.log(res.data.msg);
        }
        const unitsdata = res.data.data.rows.map((item) => ({
          label: item.name,
          value: item.name,
        }));
        setUnitsOption(unitsdata);
      });
  };
  const getPOData = (Id) => {
    console.log(Id, "function called");
    axios
      .post(
        new URL(`/api/v1/supplier/po/view/` + Id, themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          console.log(res.data.data[0]);
          setPOData(res.data.data[0]);
          setOrderLineData(res.data.data[0].lineItems);
        }
      });
  };
  useEffect(() => {
    if (poData?.lineItems) {
      const total = poData.lineItems.reduce(
        (acc, item) => acc + parseInt(item.subTotal), // Parse subTotal values to integers for addition
        0
      );
      setTotalAmount(total); // Update totalAmount state
    }
  }, [poData]);
  const customStyles = {
    rows: {
      style: {
        minHeight: "80px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };
  const basicColumns = [
    {
      name: "Sr. No.",
      maxWidth: "50px",
      column: "sr",
      sortable: true,
      selector: (row, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      name: "Item",
      column: "item",
      sortable: true,
      selector: (row) => row.itemName,
    },
    {
      name: "Qty",
      column: "qty",
      sortable: true,
      selector: (row, index) => {
        return (
          <Input
            id="exampleNumber"
            value={row.Quantity}
            onChange={(e) => handleQtyChange(index, e.target.value)}
            name="number"
            type="number"
          />
        );
      },
    },
    {
      name: "Unit",
      sortable: true,
      selector: (row, index) => {
        return (
          <Input
            type="text"
            value={row.unit}
            onChange={(e) => handleUnitChange(index, e.target.value)}
          />
        );
      },
    },
    // {
    //   name: "Unit",
    //   sortable: true,
    //   selector: (row, index) => {
    //     return (
    //       <Selec
    //         options={unitsOption}
    //         value={unitsOption?.find((option) => option.value === row.unit)}
    //         onChange={(selectedOption) =>
    //           handleUnitChange(index, selectedOption)
    //         }
    //         className="react-select"
    //         classNamePrefix="select"
    //       />
    //     );
    //   },
    // },

    {
      name: "Mrtl Code",
      column: "unit",
      sortable: true,
      selector: (row) => row.materialCode,
    },
    {
      name: "Mrtl Desc",
      column: "unit",
      sortable: true,
      selector: (row) => row.materialDescription,
    },
    {
      name: "Price Per Unit",
      column: "unit",
      sortable: true,
      selector: (row) => row.pricePerUnit,
    },
    {
      name: "Sub Total",
      column: "unit",
      sortable: true,
      selector: (row) => {
        return row.subTotal; // Returning the subTotal value for the table column
      },
    },
    {
      name: "HSN Code",
      sortable: true,
      selector: (row, index) => {
        return (
          <Input
            type="text"
            value={row.hsnCode}
            onChange={(e) => handleHSNCodeChange(index, e.target.value)}
          />
        );
      },
    },
    {
      name: "Weight",
      column: "weight",
      sortable: true,
      selector: (row, index) => {
        return (
          <Input
            type="text"
            value={row.weight}
            onChange={(e) => handleWeightChange(index, e.target.value)}
          />
        );
      },
    },
    {
      name: "Dimensions",
      column: "dimension",
      sortable: true,
      selector: (row, index) => {
        return (
          <Input
            type="text"
            value={row.dimension}
            onChange={(e) => handleDimensionChange(index, e.target.value)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    request();
  }, []);
  function generateASN(purchaseOrderNumber) {
    const asnNumber = "ASN" + `${purchaseOrderNumber}`;
    return asnNumber;
  }
  // Example usage:
  const pOrder = poData ? "PO" + poData?.id : "";
  //   const supplierCode = poData ? "SUP" + poData?.supplier_id : "";
  const generatedASN = generateASN(pOrder);

  const onFileChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    setInvoiveFileName(files[0].name);
    reader.onload = function () {
      setInvoice(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getQrCode = (number) => {
    // if(number ==! ""){
    axios
      .post(
        new URL(
          `/api/v1/configuration/asn/qrcode/${number}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          console.log(res.data.QrCodeBase64);
          setQrData(res.data.QrCodeBase64);
          setQrIsVisible(true);
          toast.success("Qrcode Generated Successfully");
        }
      });
    // }
    // else{
    //   toast.error("Something went wrong Qrcode is not fetched")
    // }
  };

  const onSubmit = (e) => {
    // console.log(poData);
    e.preventDefault();
    const sendData = {
      poNo: poData?.id?.toString(),
      poDate: poData?.order_date,
      asnNo: generatedASN,
      plantId: "1000",
      supplierId: poData?.supplier_id,
      deliveryDate: poData?.delivery_date,
      type: "Normal",
      carrier: "dhl express",
      status: "invoiced",
      lineItems: poData?.lineItems,
      gst: poData?.gst,
      pan: poData?.pan,
      irnNo: "",
      gstInvoiceNumber: "",
      shipToAddress:
        poData.supplierAdd +
        poData.supplierState +
        poData.supplierCity +
        poData.supplierPin,
      billToAddress: "BuyerHome",
      remarks: "",
      file: invoice ? invoice : "",
      eWayBillNo: "",
    };
    // toast.success("ASN Created");
    axios
      .post(
        new URL("/api/v1/supplier/asn/create", themeConfig.backendUrl),
        sendData
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data);
        } else {
          toast.success(res.data.message);
          console.log(res.data.data[0]);
          // if(res.data.data[0] ==! ""){
          //   getQrCode(res.data.data[0]);
          // }else{
          //   toast.error("Something went wrong Qrcode is not fetched")
          // }
          // getQrCode();
        }
      })
      .catch((err) => {
        return toast.error(err.message);
      });
  };

  return (
    <>
      <Alert color="primary">
        <div className="alert-body d-flex align-items-center justify-content-between flex-wrap p-2">
          <div className="me-1">
            <h4 className="fw-bolder text-primary">
              Create your ASN from Purchase Order 👩🏻‍💻
            </h4>
            <p className="fw-normal mb-1 mb-lg-0">ASN from PO</p>
          </div>
          {/* <Button color="primary">Contact Us</Button> */}
        </div>
      </Alert>
      <Row>
        <Col md={8}>
          <Card className="invoice-preview-card">
            <CardBody className="invoice-padding pb-0">
              <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                <div>
                  <h4 className="invoice-title">
                    Purchase Order <span className="text-danger"> *</span>
                  </h4>
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`nameOfCompany`}
                    className={`react-select`}
                    classNamePrefix="select"
                    value={selectedOption}
                    options={purchaseOrder}
                    onChange={(e) => {
                      setSelectedOption(e);
                      getPOData(e.value);
                    }}
                  />
                  <label className="mt-1">
                    Supplier{""}
                    <span className="invoice-number mt-2">
                      <Input
                        value={poData?.supplier_id}
                        type="text"
                        name="orderQuantity"
                      />
                    </span>
                  </label>
                </div>
                <div className="mt-md-0 mt-2">
                  <h4 className="invoice-title">
                    ASN Number:{" "}
                    <span className="invoice-number">{generatedASN}</span>
                  </h4>
                  <div className="invoice-date-wrapper">
                    <p className="invoice-date-title">
                      PO Date:{" "}
                      <span>
                        <Input
                          value={poData ? poData?.order_date : "01/01/2020"}
                        />
                      </span>
                    </p>
                  </div>
                  <div className="invoice-date-wrapper">
                    <p className="invoice-date-title">
                      Delivery Date:
                      <span>
                        <Flatpickr
                          defaultValue={poData?.delivery_date}
                          value={picker}
                          data-enable-time
                          id="date-time-picker"
                          className="form-control"
                          onChange={(date) => setPicker(date)}
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
            {poData ? (
              <>
                <CardBody className="invoice-padding p-3">
                  <hr style={{ marginTop: "0px" }} />
                  <Row className="invoice-spacing">
                    <Col className="p-0" md="6" xl="8">
                      <h6 className="mb-2">Supplier Address</h6>
                      <h6 className="mb-25">{poData?.supplierAdd}</h6>
                      <CardText className="mb-25">
                        {data?.invoice?.client?.company ||
                          "Office 149, 450 South Brand Brooklyn"}
                      </CardText>
                      <CardText className="mb-25">
                        {poData?.supplierState ||
                          "San Diego County, CA 91905, USA"}
                      </CardText>
                      <CardText className="mb-25">
                        {poData?.supplierCity ||
                          "+1 (123) 456 7891, +44 (876) 543 2198"}
                      </CardText>
                      <CardText className="mb-25">
                        {poData?.supplierPin || "370001"}
                      </CardText>
                      <CardText className="mb-0">
                        {poData?.email || "somone@gmail.com"}
                      </CardText>
                      <h6 className="mt-2">GST</h6>
                      <CardText className="mb-0">
                        {poData?.gst || "24AAACS5123K1ZJ"}
                      </CardText>
                      <h6 className="mt-1">PAN</h6>
                      <CardText className="mb-0">
                        {poData?.pan || "AACS5123K1"}
                      </CardText>
                      <h6 className="mt-1">IRN No</h6>
                      <Input className="mb-0  w-50">
                        {poData?.irnnum || "AACS5123K1"}
                      </Input>
                      <h6 className="mt-1">GST Invoice Number</h6>
                      <Input value={""} className="mb-0  w-50"></Input>
                    </Col>
                    <Col className="p-0 mt-xl-0 mt-2" md="6" xl="4">
                      <h6 className="mb-2">Ship to Address</h6>
                      <table>
                        <tbody>
                          <tr>
                            <td className="pe-1">Address:</td>
                            <td>
                              <span className="fw-bold">
                                {poData?.buyerAdd ||
                                  "278, Jeevan Udyog Building,"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="pe-1">State:</td>
                            <td>{poData?.buyerState || "Maharastra"}</td>
                          </tr>
                          <tr>
                            <td className="pe-1">City:</td>
                            <td>{poData?.buyerCity || "Mumbai"}</td>
                          </tr>
                          <tr>
                            <td className="pe-1">Pin No:</td>
                            <td>{poData?.buyerPin || "400001"}</td>
                          </tr>
                        </tbody>
                      </table>
                      <h6 className="mb-1 mt-2">Bill to Address</h6>
                      <table>
                        <tbody>
                          <tr>
                            <td className="pe-1">Address:</td>
                            <td>
                              <span className="fw-bold">
                                {poData?.buyerAdd ||
                                  "278, Jeevan Udyog Building,"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="pe-1">State:</td>
                            <td>{poData?.buyerState || "Maharastra"}</td>
                          </tr>
                          <tr>
                            <td className="pe-1">City:</td>
                            <td>{poData?.buyerCity || "Mumbai"}</td>
                          </tr>
                          <tr>
                            <td className="pe-1">Pin No:</td>
                            <td>{poData?.buyerPin || "400001"}</td>
                          </tr>
                        </tbody>
                      </table>
                      {/* <h6 className="mt-1"></h6>
              <Input value={""} className="mb-0  w-50">
                Generate E-Way
              </Input> */}
                    </Col>
                  </Row>
                </CardBody>
                <CardBody className="invoice-padding pt-0">
                  <label
                    className="mb-1"
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    Order Line Items
                  </label>
                  <div className="react-dataTable-wrapper">
                    <div className="react-dataTable">
                      <DataTable
                        noHeader
                        striped
                        customStyles={customStyles}
                        data={orderlineData}
                        columns={basicColumns}
                        className="react-dataTable"
                        sortIcon={<ChevronDown size={10} />}
                      />
                      <div className="total-section d-flex justify-content-end mt-2">
                        <div>
                          <Label>Total</Label>
                          <Input value={totalAmount} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Row className="mt-3">
                    <Col sm="12" md={8}>
                      <span className="fw-bold">Remarks: </span>
                      <Input type="textarea">
                        It was a pleasure working with you and your team. We
                        hope you will keep us in mind for future freelance
                        projects. Thank You!
                      </Input>
                    </Col>
                    <Col md={4}>
                      <Card className="invoice-action-wrapper">
                        <CardBody>
                          <Button
                            tag={Label}
                            className="mb-75 me-75"
                            size="md"
                            block
                            color="primary"
                          >
                            Attach Invoice
                            <Input
                              type="file"
                              onChange={onFileChange}
                              hidden
                              accept="image/*"
                            />
                          </Button>
                          <p>{invoiceFileName ? invoiceFileName : ""}</p>
                          <Button
                            to="/apps/invoice/preview"
                            color="primary"
                            block
                            outline
                            className="mb-75"
                          >
                            Generate E-Way Bill
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <div className="d-flex justify-content-start">
                      <Button
                        style={{
                          marginRight: "20px",
                          marginLeft: "10px",
                        }}
                        color="success"
                        className="btn-prev"
                        onClick={onSubmit}
                      >
                        Submit
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleClear}
                        color="danger"
                        className="btn-submit"
                      >
                        Clear
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </>
            ) : (
              ""
            )}
          </Card>
        </Col>
        <Col xl={4} md={4}>
          <Card>
            <Row>
              <Col sm={5}>
                <div className="d-flex align-items-end justify-content-center h-100">
                  <img
                    className="img-fluid mt-2"
                    src={asnimg}
                    alt="Image"
                    width={85}
                  />
                </div>
              </Col>
              {/* <Col sm={7}>
                <CardBody className="text-sm-end text-center ps-sm-0">
                  <Button color="primary" className="text-nowrap mb-1">
                    Add New Role
                  </Button>
                  <p className="mb-0">Add a new role, if it does not exist</p>
                </CardBody>
              </Col> */}
            </Row>
          </Card>
          <Card>
            <div className="qrcode__container">
              <div className="qrcode__container--parent" ref={qrCodeRef}>
                <div className="qrcode__input">
                  <input
                    type="text"
                    style={{ display: "none" }}
                    placeholder="Enter a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {/* <button onClick={handleQrCodeGenerator}>Generate QR Code</button> */}
                </div>
                {qrIsVisible && (
                  <div className="qrcode__download">
                    <div className="qrcode__image">
                      <img
                        style={{ width: "20rem" }}
                        src={"data:image/png;base64," + qrData}
                        alt="Qrcode"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          {qrIsVisible ? (
            <button style={{ alignItems: "center" }} onClick={downloadQRCode}>
              Download QR Code
            </button>
          ) : (
            ""
          )}
        </Col>
      </Row>

      {/* <QrCodeGenerator /> */}
      <Form onSubmit={onSubmit} id="form">
        <div>
          <div className="card-body">
            <div className="row">
              {/* <div className="col-md-3 me-1 mt-1">
                <div className="form-group">
                  <label>Status</label>

                  <select className="form-select">
                    <option value="">Select</option>
                    <option value="pending">Material Shipped</option>
                    <option value="rejected">Material Gate Inward</option>
                    <option value="queried"> Received</option>
                    <option value="approved"> Quality Approved </option>
                    <option value="approved"> Invoiced </option>
                    <option value="approved"> Partially Paid </option>
                    <option value="approved"> Fully Paid </option>
                    <option value="approved"> Unpaid</option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="card"></div>
      </Form>
    </>
  );
};

export default ASN;

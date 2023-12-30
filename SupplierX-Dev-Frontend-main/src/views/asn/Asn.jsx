/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Row,
  Label,
  Badge,
  Col,
} from "reactstrap";
import { X, Plus } from "react-feather";
import ReactPaginate from "react-paginate";
import axios from "axios";
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
import { redirect, useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { GoEye } from "react-icons/go";
import { PanoramaFishEye, RemoveRedEyeSharp } from "@mui/icons-material";

const MySwal = withReactContent(Swal);

const ASN = () => {
  const navigate = useNavigate();
  const params = useParams();
  const company_id = params.id;

  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };

  const [addModal, setAddModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    company_id,
  });

  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(new URL("v1/supplier/asn/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        console.log(res.data.data.rows);
        setTotal(res.data.data.total);
        setData(res.data.data.rows);
        setItemsData(res.data.data.rows[0].lineItems);
      });
  };

  const deleteCategory = (row) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .delete(
            new URL(
              `/api/v1/supplier/asn/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            }
            MySwal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Deleted Successfully!",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          });
        request();
      }
    });
  };

  const [company, setCompany] = useState([]);
  const [itemValues, setItemValues] = useState([
    { sku: null, itemName: null, orderQuantity: null },
  ]);
  const handleChange = (i, field, value) => {
    console.log(value);
    const newFormValues = itemValues.map((item, index) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItemValues(newFormValues);
  };
  let addFormFields = () => {
    setItemValues([
      ...itemValues,
      { sku: null, itemName: null, orderQuantity: null },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = itemValues.filter((item, index) => index !== i);
    setItemValues(newFormValues);
  };

  useEffect(() => {
    request();
    axios
      .post(new URL("/api/v1/admin/company/list", themeConfig.backendUrl))
      .then((response) => {
        setCompany(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const AddModal = () => {
    const [selectedOption, setSelectedOption] = useState("");

    const [form, setForm] = useState({
      company_id: "",
      name: "",
      email: "",
    });

    const onSubmit = (e) => {
      e.preventDefault();
      const sendData = {
        poNo: "12344444",
        plantId: "1000",
        supplierId: "1",
        deliveryDate: "27-12-2023",
        type: "Normal",
        carrier: "",
        status: "0",
        lineItems: [
          {
            sku: "SKU-1",
            itemName: "Eno Packates",
            orderQuantity: 100,
          },
          {
            sku: "SKU-2",
            itemName: "Mangos",
            orderQuantity: 1000,
          },
        ],
      };
      axios
        .post(
          new URL("/api/v1/workFlow/asn/create", themeConfig.backendUrl),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          }
          request();
          setAddModal(false);
          return toast.success(res.data.message);
        });
    };

    return (
      <div className="vertically-centered-modal ">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            Create
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Purchase Order <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      value={selectedOption}
                      onChange={(e) => setForm(e.Value)}
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Plant <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      value={selectedOption}
                      //   options={options.map((option) => {
                      //     console.log("tfytf", option.role_name);
                      //     return {
                      //       label: option.role_name,
                      //       value: option.id,
                      //     };
                      //   })}
                      onChange={(e) => setSelectedOption(e).toString()}
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Supplier ID <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={form.firstname}
                      onChange={(e) => {
                        setForm({ ...form, firstname: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Delivery Date <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={form.lastname}
                      onChange={(e) => {
                        setForm({ ...form, lastname: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Order Date"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Type <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e).toString()}
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Logistics Carrier <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      value={selectedOption}
                      //   options={options.map((option) => {
                      //     console.log("tfytf", option.role_name);
                      //     return {
                      //       label: option.role_name,
                      //       value: option.id,
                      //     };
                      //   })}
                      onChange={(e) => setSelectedOption(e).toString()}
                    />
                  </div>
                </div>
                <hr className="mt-1" />
                Items
                {itemValues.map((element, index) => (
                  <div
                    key={index}
                    className="d-flex row-flex flex-wrap"
                    // style={{ border: "dotted 1px grey" }}
                  >
                    <div className="col-md-5 me-1 mt-1">
                      <div className="form-group">
                        <label>
                          SKU <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={element.sku}
                          onChange={(e) =>
                            handleChange(index, "sku", e.target.value)
                          }
                          className="form-control"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-5 me-1 mt-1">
                      <div className="form-group">
                        <label>
                          Item Name <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          name="itemName"
                          value={element.itemName}
                          onChange={(e) =>
                            handleChange(index, "itemName", e.target.value)
                          }
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-5 me-1 mt-1 mb-1">
                      <div className="form-group">
                        <label>
                          Quantity <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          name="orderQuantity"
                          value={element.orderQuantity}
                          onChange={(e) =>
                            handleChange(index, "orderQuantity", e.target.value)
                          }
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
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
                    <span className="align-middle ms-25">Add New</span>
                  </Button>
                </div>
                <hr />
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-control" style={{ border: "0px" }}>
                    <label>
                      Status <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-active"
                          name="status"
                          value="1"
                          checked
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label className="form-check-label" for="status-active">
                          Active
                        </Label>
                      </div>

                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-deactive"
                          name="status"
                          value="0"
                          checked={form.status === "0"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label
                          className="form-check-label"
                          for="status-deactive"
                        >
                          Deactive
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Create
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };

  const EditModal = () => {
    const [selectedOption, setSelectedOption] = useState({
      label: editData.company_name,
      value: editData.company_id,
    });

    const handleSelectChange = (selectedOption) => {
      setSelectedOption(selectedOption);
    };
    const [form, setForm] = useState({
      id: editData.id,
      name: editData.name,
      email: editData.email,
      company_id: editData.company_id,
      status: editData.status,
    });

    const onSubmitEdit = (e) => {
      e.preventDefault();
      console.log("Fucntion called");
      toast.success("Function Called");
      // axios
      //   .put(
      //     new URL(
      //       "/api/v1/configuration/department/update",
      //       themeConfig.backendUrl
      //     ),
      //     { ...form, company_id: selectedOption.value.toString() }
      //   )
      //   .then((res) => {
      //     if (res.data.error) {
      //       toast.error(res.data.message);
      //     }
      //     request();
      //     setEditModal(false);
      //     return toast.success(res.data.message);
      //   });
    };

    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Company Name<span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={company}
                      options={company?.map((option) => ({
                        label: option.name,
                        value: option.id,
                      }))}
                      value={selectedOption}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>

                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Department Name<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="abc@gmail.com"
                    />
                  </div>
                </div>

                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Email<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                      }}
                      className="form-control"
                      placeholder="abc@gmail.com"
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-control" style={{ border: "0px" }}>
                    <label>Status</label>
                    <div className="d-flex">
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-active"
                          name="status"
                          value="1"
                          checked={form.status === "1"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label className="form-check-label" for="status-active">
                          Active
                        </Label>
                      </div>
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-deactive"
                          name="status"
                          value="0"
                          checked={form.status === "0"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label
                          className="form-check-label"
                          for="status-deactive"
                        >
                          Deactive
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };

  const handleViewAsn = (id) => {
    console.log(id);
    navigate(`/supplier/viewasn/${id}`);
  };
  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "sr",
      sortable: true,
      selector: (row) => row.sr,
    },

    {
      name: "Asn No",
      minWidth: "200px",
      maxWidth: "250px",
      column: "Asn No",
      selector: (row) => (
        <Link to={`/supplier/viewasn/${row.id}`}>{row.asnNo}</Link>
      ),
    },
    {
      name: "Po no",
      maxWidth: "180px",
      column: "type",
      selector: (row) => row.poNo,
    },
    {
      name: "Delivery Date",
      minWidth: "200px",
      column: "carrier",
      selector: (row) => row.deliveryDate,
    },
    {
      name: "Carrier",
      maxWidth: "200px",
      column: "Asn No",
      selector: (row) => row.carrier,
    },
    {
      name: "Status",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        if (row.status == 1) {
          return <Badge color="success">Active</Badge>;
        } else {
          return <Badge color="danger">Deactive</Badge>;
        }
      },
    },
    {
      name: "Action",
      column: "status",
      maxWidth: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <RemoveRedEyeSharp
              aria-disabled
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                // setEditData(row);
                // setEditModal(true);
                handleViewAsn(row.id);
              }}
            />

            <Trash2
              className="text-danger"
              onClick={() => deleteCategory(row)}
            />
          </>
        );
      },
    },
  ];

  const handlePagination = (page) => {
    query.offset = page.selected * query.limit;
    setQuery(query);
    request(false);
  };

  const CustomPagination = () => {
    const limit = [1, 10, 25, 50, 100];
    const updateLimit = (e) => {
      query.limit = parseInt(e.target.value);
      setQuery({ ...query });
      request();
    };

    return (
      <div className="mt-2">
        <div className="container position-absolute">
          <div className="row">
            <div className="col-sm-1">
              <select
                className="form-select form-select-sm"
                onChange={updateLimit}
                value={query.limit}
              >
                {limit.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-1">Total: {total}</div>
          </div>
        </div>

        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={Math.floor(query.offset / query.limit)}
          onPageChange={(page) => handlePagination(page)}
          pageCount={Math.ceil(total / query.limit)}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
        />
      </div>
    );
  };

  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      request();
    }
  };
  return (
    <>
      <div className="card">
        <AddModal />
        <Modal
          className="modal-centered"
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
        >
          <ModalHeader toggle={() => setIsOpen(!isOpen)}>
            Line Items
          </ModalHeader>
          <ModalBody>
            {console.log(data)}
            {console.log(itemsData)}
            {itemsData && itemsData?.length > 0 ? (
              itemsData.map((item, index) => (
                <div key={index}>
                  <p>SKU: {item.sku}</p>
                  <p>Item Name: {item.itemName}</p>
                  <p>Quantity: {item.orderQuantity}</p>
                  {/* Add other properties of lineItems if needed */}
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </ModalBody>
        </Modal>
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Advanced Shipment Notice</h4>
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                navigate("/supplier/addasn");
              }}
            >
              Create
            </Button>
          </div>
          <hr />

          {data !== null ? (
            <>
              <EditModal />
              <div className="d-flex justify-content-between mb-1">
                <div></div>
                <div className="row">
                  <div className="col-md">
                    {/* //status */}
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          query.status = e.target.value;
                          setQuery(query);
                          request();
                        }}
                      >
                        <option value=""> All </option>
                        <option value="1"> Active </option>
                        <option value="0"> Deactive </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <input
                        type="text"
                        name=""
                        className="form-control mr-2"
                        id=""
                        placeholder="Search"
                        onChange={(e) => {
                          query.search = e.target.value;
                          setQuery(query);
                          request();
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <button
                        className="btn btn-primary btn-sm form-control"
                        onClick={request}
                      >
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="react-dataTable">
                <DataTable
                  noHeader
                  pagination
                  data={data}
                  columns={basicColumns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  onSort={handleSort}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={query.offset + 1}
                  paginationServer
                />
              </div>
            </>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ASN;

import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";

import {
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  DropdownMenu,
  DropdownItem,
  Form,
  Button,
  CardHeader,
  CardTitle,
  UncontrolledButtonDropdown,
  DropdownToggle,
  Badge,
} from "reactstrap";
import { Check } from "@mui/icons-material";
import {
  RefreshCw,
  ChevronDown,
  Edit,
  Trash2,
  Truck,
  Grid,
  Copy,
  Printer,
  FileText,
  Plus,
  Eye,
  ArrowUpRight,
  AlertCircle,
  X,
  File,
  Share,
  Clock,
} from "react-feather";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MySwal = withReactContent(Swal);
const Suppliers = () => {
  const navigate = useNavigate();
  const navigateToOnboarding = () => {
    navigate("/supplier/register");
  };

  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [display, setDisplay] = useState(false);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    status: "all",
    offset: "0",
    limit: "25",
    order: "desc",
    sort: "created_at",
    search: "",
  });

  const request = () => {
    setLoading(true);
    let userData = localStorage.getItem("userData");
    const data = JSON.parse(userData);
    const approverLevel = data.level;
    const params = {
      user_id: data.id,
      status: query.status,
      offset: query.offset,
      limit: query.limit,
      order: query.order,
      sort: query.sort,
      search: query.search,
    };

    let apiPath;

    if (approverLevel === 1) {
      apiPath = "/api/v1/supplier/supplier/filter";
    }
    if (approverLevel === 2) {
      apiPath = "/api/v1/supplier/supplier/level1filterlist";
    }
    axios
      .post(new URL(apiPath, themeConfig.backendUrl), params)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setLoading(false);
          setDisplay(true);
        } else {
          setTotal(res.data.total);
          setData(res.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error.message);
        setDisplay(true);
        setData(null);
        setLoading(false);
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
              `/api/v1/supplier/supplier/delete/${row.id}`,
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

  useEffect(() => {
    request();
  }, []);

  const AddModal = () => {
    const [form, setForm] = useState({
      code: "",
      name: "",
    });

    const onSubmit = (e) => {
      e.preventDefault();

      axios
        .post(new URL("/api/v1/admin/bpg/create", themeConfig.backendUrl), form)
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
      <div className="vertically-centered-modal">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            Create
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="query"
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="ZV01"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Business Partner Group
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Transport Vendors"
                      required
                    />
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
    const [form, setForm] = useState({
      id: editData.id,
      code: editData.code,
      name: editData.name,
    });

    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(new URL("/api/v1/admin/bpg/update", themeConfig.backendUrl), form)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          }
          request();
          setEditModal(false);
          return toast.success(res.data.message);
        });
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
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="code"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Business Partner Group
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Business Partner Group"
                      required
                    />
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
  const handleEdit = (id) => {
    navigate(`/suppliers-details`, { state: { id: id } });
  };

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "srno",
      sortable: true,
      selector: (row) => row.srno,
    },

    {
      name: "Suppliers",
      column: "supplier_name",
      sortable: true,
      selector: (row) => row.supplier_name,
    },
    {
      name: "SAP Code",
      column: "sap_code",
      maxWidth: "130px",
      selector: (row) => {
        if (row.sap_code != null || row.sap_code?.length > 0) {
          return <div>{row.sap_code}</div>;
        } else {
          return <span className="text-danger">NA</span>;
        }
      },
    },
    {
      name: "Created At",
      column: "created_at",
      sortable: true,
      // maxWidth: "180px",
      selector: (row) => {
        const timestamp = row.created_at;
        const date = new Date(timestamp);
        const formattedDateTime =
          " 📅 " +
          date.toISOString().slice(8, 10) +
          "/" + // Extract dd
          date.toISOString().slice(5, 7) +
          "/" + // Extract mm
          date.toISOString().slice(2, 4) +
          " 🕒 " +
          date.toISOString().slice(11, 16); // Extract
        return formattedDateTime;
      },
    },
    {
      name: "status",
      column: "status",
      maxWidth: "150px",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          width: "80px", // Set the fixed width for the "Pending" badge
        };
        if (row.status == "pending") {
          return (
            <Badge color="warning" style={badgeStyle}>
              <Clock />
              Pending
            </Badge>
          );
        } else if (row.status == "approved") {
          return (
            <Badge color="success" style={badgeStyle}>
              <Check />
              Approved
            </Badge>
          );
        } else if (row.status == "verified") {
          return (
            <Badge color="info" style={badgeStyle}>
              <ArrowUpRight />
              Verified
            </Badge>
          );
        } else if (row.status == "queried") {
          return (
            <Badge color="primary" style={badgeStyle}>
              <AlertCircle />
              Queried
            </Badge>
          );
        } else if (row.status == "rejected") {
          return (
            <Badge color="danger" style={badgeStyle}>
              <X />
              Rejected
            </Badge>
          );
        }
      },
    },

    {
      name: "Action",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Eye
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                handleEdit(row.id);
              }}
            />
            {row.sap_code === null ? (
              <Trash2
                className="text-danger"
                style={{ cursor: "pointer", color: "#7367f0" }}
                onClick={() => deleteCategory(row)}
              />
            ) : (
              <Trash2 color="grey" className="text-danger" />
            )}
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

            <div className="col-md-3">Total: {total}</div>
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
  let userData = localStorage.getItem("userData");
  const da = JSON.parse(userData);
  const apLevel = da.level;

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  return (
    <>
      <div className="card">
        <AddModal />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Suppliers</h4>
            <div
              style={{ gap: "10px" }}
              className="d-flex justify-content-between align-center"
            >
              <div className="d-flex mt-md-0 mt-1">
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="secondary" caret outline>
                    <Share size={15} />
                    <span className="align-middle ms-50">Export</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    {/* <DropdownItem className="w-100">
                      <Printer size={15} />
                      <span className="align-middle ms-50">Print</span>
                    </DropdownItem> */}
                    <DropdownItem
                      className="w-100"
                      onClick={() => downloadCSV(data)}
                    >
                      <FileText size={15} />
                      <span className="align-middle ms-50">CSV</span>
                    </DropdownItem>
                    {/* <DropdownItem className="w-100">
                      <Grid size={15} />
                      <span className="align-middle ms-50">Excel</span>
                    </DropdownItem>
                    <DropdownItem className="w-100">
                      <File size={15} />
                      <span className="align-middle ms-50">PDF</span>
                    </DropdownItem>
                    <DropdownItem className="w-100">
                      <Copy size={15} />
                      <span className="align-middle ms-50">Copy</span>
                    </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              <Button color="primary" size="sm" onClick={navigateToOnboarding}>
                {" "}
                <Plus size={15} />
                <span className="align-middle ms-50">Supplier</span>
              </Button>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-1">
            <div></div>
            <div className="row">
              <div className="col-md">
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
                    {" "}
                    {apLevel === 1 ? (
                      <>
                        <option value="all"> All </option>
                        <option value="pending"> Pending </option>
                        <option value="rejected"> Rejected </option>
                        <option value="queried"> Queried </option>
                        <option value="verified"> Verified </option>
                        <option value="approved"> Approved </option>
                      </>
                    ) : (
                      <>
                        <option value="all"> All </option>
                        <option value="verified"> Pending </option>
                        <option value="verified"> Verified </option>
                        <option value="approved"> Approved </option>
                      </>
                    )}
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
                    value={searchValue}
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
          {data !== null ? (
            <>
              {loading ? (
                <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
                  <LinearProgress className="mb-1" color="inherit" />
                </Stack>
              ) : (
                ""
              )}
              <EditModal />
              <div className="react-dataTable">
                <DataTable
                  noHeader
                  pagination
                  striped
                  pageCount={
                    searchValue.length
                      ? Math.ceil(filteredData.length / 7)
                      : Math.ceil(data.length / 7) || 1
                  }
                  // data={data}
                  columns={basicColumns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  onSort={handleSort}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={query.offset + 1}
                  paginationServer
                  data={searchValue.length ? filteredData : data}
                />
              </div>
            </>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              {display ? (
                <>
                  <h4>No Records Found</h4>
                </>
              ) : (
                <Spinner />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Suppliers;

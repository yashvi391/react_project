import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Label,
  CardHeader,
  Badge,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2 } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const MySwal = withReactContent(Swal);

const Plants = () => {
  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
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
      .post(new URL("/api/v1/admin/plants/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setTotal(res.data.data.total);
        setData(res.data.data.rows);
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
              `/api/v1/admin/plants/delete/${row.id}`,
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

  const [options, setOptions] = useState([]);
  const [country, setCountry] = useState([]);
  const [region, setRegion] = useState([]);

  useEffect(() => {
    request();

    axios
      .post(new URL("/api/v1/admin/company/list", themeConfig.backendUrl))
      .then((response) => {
        setOptions(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .post(new URL("/api/admin/country/list", themeConfig.backendUrl))
      .then((response) => {
        setCountry(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const AddModal = () => {
    const country =
      data?.country?.map((obj) => {
        return {
          value: obj.country_key,
          label: obj.name,
        };
      }) || [];

    const [state, setState] = useState([]);

    const [selectedOption, setSelectedOption] = useState("");
    const [selectedcountry, setSelectedcountry] = useState("");
    const [selectedregion, setSelectedregion] = useState("");

    const [form, setForm] = useState({
      code: "",
      street: "",
      po_box: "",
      postal_code: "",
      city: "",
      country_key: "",
      region_code: "",
      company_code: "",
      status: "",
    });
    const onSubmit = (e) => {
      e.preventDefault();

      axios
        .post(new URL("/api/v1/admin/plants/create", themeConfig.backendUrl), {
          ...form,
          company_code: selectedOption.value.toString(),
          country_key: selectedcountry.value,
          region_code: selectedregion.value.toString(),
        })
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
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            <h2>Create</h2>
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-6 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Plant Code <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="1234"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 me-1 mt-1">
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
                        option={options}
                        value={selectedOption}
                        options={options.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectedOption(e).toString()}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 me-1 mt-1">
                    <div className="form-group">
                      <label>
                        Po Box<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        name="po_box"
                        value={form.po_box}
                        onChange={(e) => {
                          setForm({ ...form, po_box: e.target.value });
                        }}
                        className="form-control"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 me-1 mt-1">
                    <div className="form-group">
                      <label>
                        Country<span className="text-danger"> *</span>
                      </label>
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`paymentMethod`}
                        classNamePrefix="select"
                        option={country}
                        options={options}
                        onChange={(e) => {
                          const states = data.states.filter(
                            (val) => val.countryKey == e.value
                          );
                          setState(
                            states.map((val) => ({
                              label: val.stateDesc,
                              value: val.stateKey,
                            }))
                          );
                          setSelectedOption(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 me-1 mt-1">
                    <div className="form-group">
                      <label>
                        State <span className="text-danger"> *</span>
                      </label>
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfBusiness`}
                        className={`react-select`}
                        classNamePrefix="select"
                        option={state}
                        // value={selectedregion}
                        // options={region.map(option => {
                        //     return {
                        //         label: option.stateDesc,
                        //         value: option.countryDesc
                        //     }
                        // })}
                        // onChange={e => setSelectedregion(e).toString()}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 me-1 mt-1">
                    <div className="form-group">
                      <label>
                        City<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={(e) => {
                          setForm({ ...form, city: e.target.value });
                        }}
                        className="form-control"
                        placeholder="Bhuj"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Postal Code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={(e) => {
                        setForm({ ...form, postal_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="370001"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Street<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={(e) => {
                        setForm({ ...form, street: e.target.value });
                      }}
                      className="form-control"
                      placeholder="street"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 me-1 mt-1">
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
                          Inactive
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
    const [form, setForm] = useState({
      id: editData.id,
      code: editData.code,
      name: editData.name,
    });

    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(
          new URL("/api/v1/admin/plants/update", themeConfig.backendUrl),
          form
        )
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
                    <label>Plant Code</label>
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
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={(e) => {
                        setForm({ ...form, street: e.target.value });
                      }}
                      className="form-control"
                      placeholder="street"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>Company code</label>
                    <input
                      type="text"
                      name="company_code"
                      value={form.company_code}
                      onChange={(e) => {
                        setForm({ ...form, company_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="company_code"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>Po Box</label>
                    <input
                      type="text"
                      name="po_box"
                      value={form.po_box}
                      onChange={(e) => {
                        setForm({ ...form, po_box: e.target.value });
                      }}
                      className="form-control"
                      placeholder="po_box"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={(e) => {
                        setForm({ ...form, postal_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Postal code"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                      }}
                      className="form-control"
                      placeholder="city"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>Country key</label>
                    <input
                      type="text"
                      name="country_key"
                      value={form.country_key}
                      onChange={(e) => {
                        setForm({ ...form, country_key: e.target.value });
                      }}
                      className="form-control"
                      placeholder="country_key"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>Region Code</label>
                    <input
                      type="text"
                      name="region_code"
                      value={form.region_code}
                      onChange={(e) => {
                        setForm({ ...form, region_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="region_code"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>status</label>
                    <input
                      type="text"
                      name="status"
                      value={form.status}
                      onChange={(e) => {
                        setForm({ ...form, status: e.target.value });
                      }}
                      className="form-control"
                      placeholder="status"
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

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "sr",
      sortable: true,
      selector: (row) => row.sr,
    },

    {
      name: "Company Name",
      maxWidth: "200px",
      column: "name",
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "City",
      column: "city",
      selector: (row) => row.city,
    },

    {
      name: "Action",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Edit
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                // setEditData(row)
                // setEditModal(true)
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
      <AddModal />

      <div className="card-body">
        <div className="d-flex justify-content-between align-center">
          <h4>Plants</h4>
          <Button
            color="primary"
            size="sm"
            onClick={() => setAddModal(!addModal)}
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
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-select"
                      //  onChange={e => {
                      //     query.status = e.target.value
                      //     setQuery(query)
                      //     request()
                      // }}
                    >
                      <option value=""> All </option>
                      <option value="1"> Active </option>
                      <option value="2"> Deactive </option>
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
    </>
  );
};

export default Plants;

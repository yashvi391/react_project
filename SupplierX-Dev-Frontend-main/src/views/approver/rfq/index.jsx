import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Button,
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
import { useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const MySwal = withReactContent(Swal);

const rfq = () => {
  const params = useParams();

  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };
  const [rfqservices, setRfqservices] = useState();
  const [rfqitems, setRfqitems] = useState();
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
  const headerText = {
    // fontWeight: "bold",
    color: "#000",
  };

  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL("/api/v1/configuration/rfq/rfqlist", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        setTotal(res.data.total);
        setData(res.data.data);
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
              `/api/v1/configuration/rfq/delete/${row.id}`,
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

  const [plants, setPlants] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [itemid, setItem] = useState([]);
  const [serviceid, setServiceid] = useState([]);

  useEffect(() => {
    request();
    axios
      .post(new URL("/api/v1/configuration/items/list", themeConfig.backendUrl))
      .then((response) => {
        setPurchase(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(new URL("/api/v1/admin/plants/list", themeConfig.backendUrl))
      .then((response) => {
        setPlants(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(
        new URL("/api/v1/configuration/services/list", themeConfig.backendUrl)
      )
      .then((response) => {
        setServiceid(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(new URL("/api/v1/users/list", themeConfig.backendUrl))
      .then((response) => {
        setUsers(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(new URL("/api/v1/configuration/items/list", themeConfig.backendUrl))
      .then((response) => {
        setItem(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/listsupplier",
          themeConfig.backendUrl
        )
      )
      .then((response) => {
        setSupplier(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const AddModal = () => {
    const [showItem, setShowItem] = useState(false);
    const [showService, setShowService] = useState(false);
    const [selectPlants, setSelectPlants] = useState("");
    const [selectUser, setSelectUser] = useState("");
    const [selectsupplier, setSelectsupplier] = useState("");
    const [selectPurchase, setSelectPurchase] = useState("");

    const [form, setForm] = useState({
      subscriber_id: "1",
      plant_id: "",
      rfq_number: "",
      title: "",
      user_id: "",
      rfq_date: "",
      deadline: "",
      description: "",
      pr_id: "",
      supplier_id: "",
      quotation: "90000",
      rfq_type: "",
    });
    const [additem, setAdditem] = useState({
      rfq_items: [
        {
          item_id: "",
          qty: "",
          unit_id: "",
          quotation: "80000",
        },
      ],
    });
    const [addservice, setAddservice] = useState({
      rfq_services: [
        {
          service_id: "",
        },
      ],
    });
    const addItemField = () => {
      setAdditem({
        ...additem,
        rfq_items: [
          ...additem.rfq_items,
          {
            item_id: "",
            qty: "",
            unit_id: "",
            quotation: "",
          },
        ],
      });
    };
    const removeItemField = (index) => {
      const updatedItems = [...additem.rfq_items];
      updatedItems.splice(index, 1);
      setAdditem({ ...additem, rfq_items: updatedItems });
    };
    const addServiceField = () => {
      setAddservice({
        ...addservice,

        rfq_services: [
          ...addservice.rfq_services,
          {
            service_id: "",
          },
        ],
      });
    };
    const removeServiceField = (index) => {
      const updatedServices = [...addservice.rfq_services];
      updatedServices.splice(index, 1);
      setAddservice({ ...addservice, rfq_services: updatedServices });
    };
    const onSubmit = (e) => {
      e.preventDefault();
      const dataToSend = showService ? addservice : additem;
      axios
        .post(
          new URL("/api/v1/configuration/rfq/create", themeConfig.backendUrl),
          {
            ...dataToSend,
            user_id: selectUser.value,
            supplier_id: selectsupplier.value,
            plant_id: selectPlants.value,
          }
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
    const item = () => {
      setAdditem({ ...form, ...additem, rfq_type: "item" });
      setShowItem(true);
      setShowService(false);
    };
    const good = () => {
      setAddservice({ ...form, ...addservice, rfq_type: "service" });
      setShowItem(false);
      setShowService(true);
    };
    return (
      <div className="vertically-centered-modal ">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            <h2> Create</h2>
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row first">
                {/* plant */}
                <div className="col-md-4 me-1 mt-1">
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
                      option={plants}
                      value={selectPlants}
                      options={plants.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => setSelectPlants(e)}
                    />
                  </div>
                </div>
                {/* user */}
                <div className="col-md-4 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      User <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={users}
                      value={selectUser}
                      options={users.map((option) => {
                        return {
                          label: option.username,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => setSelectUser(e)}
                    />
                  </div>
                </div>
                {/* rfq */}
                <div className="col-md-4 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      RFQ No.
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="rfq_number"
                      value={form.rfq_number}
                      onChange={(e) => {
                        setForm({ ...form, rfq_number: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 001"
                    />
                  </div>
                </div>
                {/* title */}
                <div className="col-md-4 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Title<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.title}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. Laptop"
                    />
                  </div>
                </div>
                {/* rfq date */}
                <div className="col-md-4 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      RFQ Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="rfq_date"
                      value={form.rfq_date}
                      onChange={(e) => {
                        setForm({ ...form, rfq_date: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                {/* deadline */}
                <div className="col-md-4 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Deadline Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={(e) => {
                        setForm({ ...form, deadline: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                {/* description */}
                <div className="col-md-8 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Description<span className="text-danger"> *</span>
                    </label>
                    <textarea
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>

                <ModalFooter>
                  <Button color="danger" onClick={item}>
                    Item
                  </Button>
                  <Button color="success" onClick={good}>
                    Service
                  </Button>
                </ModalFooter>
                {showService &&
                  addservice.rfq_services.map((service, index) => (
                    <div className="row">
                      <div className="col-md-4 me-1 mt-1">
                        <h2>Service {index + 1}</h2>

                        <div className="form-group">
                          <label>
                            Service
                            <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text" // Change the input type to "number"
                            name="name"
                            value={addservice.rfq_services[index].service_id}
                            onChange={(e) => {
                              const updatedServices = [
                                ...addservice.rfq_services,
                              ];
                              updatedServices[index].service_id = parseInt(
                                e.target.value
                              );
                              setAddservice({
                                ...addservice,
                                rfq_services: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => removeServiceField(index)}
                        >
                          -
                        </Button>
                        <Button color="success" onClick={addServiceField}>
                          +
                        </Button>
                      </ModalFooter>
                    </div>
                  ))}
                {showItem &&
                  additem.rfq_items.map((service, index) => (
                    <div className="row">
                      <hr className="me-2 mt-2" />
                      <h2>Item {index + 1}</h2>
                      {/* <div className="row">
                        <div className="col-md-6 me-1 mt-1">
                          <div className="form-group">
                            <label>
                              Supplier<span className="text-danger"> *</span>
                            </label>
                            <Select
                              theme={selectThemeColors}
                              isClearable={false}
                              id={`DepartmentOfCompany`}
                              className={`react-select`}
                              classNamePrefix="select"
                              option={supplier}
                              value={selectsupplier}
                              options={supplier
                                .filter((option) => option.type === "goods")
                                .map((option) => ({
                                  label: option.supplier_name,
                                  value: option.id,
                                }))}
                              onChange={(e) => setSelectsupplier(e).toString()}
                            />
                          </div>
                        </div>
                      </div> */}
                      <div className="col-md-3 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Item <span className="text-danger"> *</span>
                          </label>
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            option={purchase}
                            value={selectPurchase}
                            options={purchase.map((option) => {
                              return {
                                label: option.name,
                                value: option.id,
                              };
                            })}
                            onChange={(e) => setSelectPurchase(e)}
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Item <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            co
                            value={additem.rfq_items[index].item_id}
                            onChange={(e) => {
                              const updatedServices = [...additem.rfq_items];
                              updatedServices[index].item_id = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...additem,
                                rfq_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div> */}

                      <div className="col-md-3 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Quantity<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={additem.rfq_items[index].qty}
                            onChange={(e) => {
                              const updatedServices = [...additem.rfq_items];
                              updatedServices[index].qty = parseInt(
                                e.target.value
                              );
                              setAdditem({
                                ...additem,
                                rfq_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-3 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Unit <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={additem.rfq_items[index].unit_id || ""} // Use an empty string as the default value if unit_id is undefined
                            onChange={(e) => {
                              const updatedServices = [...additem.rfq_items];
                              updatedServices[index].unit_id = e.target.value; // Use the raw value without toString
                              setAdditem({
                                ...additem,
                                rfq_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>

                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => removeItemField(index)}
                        >
                          -
                        </Button>
                        <Button color="success" onClick={addItemField}>
                          +
                        </Button>
                      </ModalFooter>
                    </div>
                  ))}
              </div>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </ModalBody>
          </Form>
        </Modal>
      </div>
    );
  };

  const EditModal = () => {
    const [showItem, setShowItem] = useState(false);
    const [showService, setShowService] = useState(false);

    // dropdown value
    const [selectPlants, setSelectPlants] = useState({
      label: editData.plant_name,
      value: editData.plant_id,
    });
    const [selectUser, setSelectUser] = useState({
      label: editData.user_name,
      value: editData.user_id,
    });
    const [selectsupplier, setSelectsupplier] = useState({
      label: editData.supplier_id,
      value: editData.supplier_id,
    });
    setRfqitems(editData.rfq_items);
    setRfqservices(editData.rfq_services);

    const rfqitems = editData.rfq_items || [];
    const rfqservices = editData.rfq_services || [];
    // form values
    const [form, setForm] = useState({
      id: editData.id,
      subscriber_id: editData.subscriber_id,
      total_amount: editData.total_amount,
      rfq_number: editData.rfq_number,
      title: editData.title,
      pr_id: editData.pr_id,
      rfq_date: editData.rfq_date,
      deadline: editData.deadline,
      user_id: editData.user_id,
      plant_id: editData.plant_id,
      quotation: editData.quotation,
      description: editData.description,
      rfq_type: editData.rfq_type,
      rfq_items: rfqitems.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        qty: item.qty,
        unit_id: item.unit_id,
        quotation: "10",
      })),
      rfq_services: rfqservices.map((service) => ({
        id: service.id,
        service_id: service.service_id,
        unit_id: service.unit_id,
      })),
    });

    useEffect(() => {
      if (form.rfq_type === "item") {
        setShowItem(true);
        setShowService(false);
      } else if (form.rfq_type === "service") {
        setShowService(true);
        setShowItem(false);
      }
    }, [form.rfq_type]);

    const isoDate = editData.rfq_date;
    const datePart = isoDate ? isoDate.split("T")[0] : "";

    const deadline = editData.rfq_date;
    const deadlineDate = deadline ? deadline.split("T")[0] : "";

    const onSubmitEdit = (e) => {
      e.preventDefault();

      if (form.rfq_type === "item") {
        delete form.rfq_services;
      } else {
        delete form.rfq_items;
      }
      axios
        .put(
          new URL("/api/v1/configuration/rfq/update", themeConfig.backendUrl),
          {
            ...form,
          }
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
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...form.rfq_items];
      updatedItems[index][field] = value;

      setForm((prevForm) => ({
        ...prevForm,
        rfq_items: updatedItems,
      }));
    };
    const handleServiceChange = (index, field, value) => {
      const updatedServices = [...form.rfq_services];
      updatedServices[index][field] = value;

      setForm((prevForm) => ({
        ...prevForm,
        rfq_services: updatedServices,
      }));
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            <h2 style={{ color: "#E06522" }}>EDIT</h2>
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <div className="row first">
                {/* subscriber_id */}
                {/* <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Subscriber<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="subscriber_id"
                      value={form.subscriber_id}
                      onChange={(e) => {
                        setForm({ ...form, subscriber_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg.. Chandni"
                    />
                  </div>
                </div> */}
                {/* plant */}
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Plant <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={plants}
                      value={selectPlants}
                      options={plants.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      onChange={(selectedOption) => {
                        setSelectPlants(selectedOption);
                        setForm({
                          ...form,
                          plant_id: selectedOption.value, // Update plant_id in editedData
                        });
                      }}
                    />
                  </div>
                </div>
                {/* user */}
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      User <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={users}
                      value={selectUser}
                      options={users.map((option) => {
                        return {
                          label: option.username,
                          value: option.id,
                        };
                      })}
                      onChange={(selectedOption) => {
                        setSelectUser(selectedOption);
                        setForm({
                          ...form,
                          user_id: selectedOption.value, // Update plant_id in editedData
                        });
                      }}
                    />
                  </div>
                </div>
                {/* rfq */}
                <div className="col-md-3 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Request Quotation
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="rfq_number"
                      value={form.rfq_number}
                      onChange={(e) => {
                        setForm({ ...form, rfq_number: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 001"
                    />
                  </div>
                </div>
                {/* title */}
                <div className="col-md-5 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Title<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.title}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. Laptop"
                    />
                  </div>
                </div>
                {/* pr */}
                <div className="col-md-5 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Purchase Request<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="pr_id"
                      value={form.pr_id}
                      onChange={(e) => {
                        setForm({ ...form, pr_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg.. Chandni"
                    />
                  </div>
                </div>
                {/* supplier */}
                {/* <div className="col-md-3 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Supplier <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={supplier}
                      value={selectsupplier}
                      // options={supplier.map((option) => {
                      //   return {
                      //     label: option.id,
                      //     value: option.id,
                      //   };
                      // })}
                      onChange={(e) => setSelectsupplier(e)}
                    />
                    {console.log(supplier)}
                  </div>
                </div> */}
                {/* rfq date */}
                <div className="col-md-5 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      RFQ Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="rfq_date"
                      value={datePart}
                      onChange={(e) => {
                        setForm({ ...form, rfq_date: e.target.value });
                      }}
                      className="form-control"
                    />
                    {console.log(form.rfq_date, "rfq_date")}
                  </div>
                </div>
                {/* deadline */}
                <div className="col-md-5 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Deadline Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={deadlineDate}
                      onChange={(e) => {
                        setForm({ ...form, deadline: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                {/* description */}
                <div className="col-md-7 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Description<span className="text-danger"> *</span>
                    </label>
                    <textarea
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              {showItem &&
                form.rfq_items.map((item, index) => (
                  <div className="row">
                    <hr className="me-2 mt-2" />
                    <h4 style={headerText}>Item {index + 1}</h4>
                    {/* item */}
                    <div className="col-md-3 mt-1">
                      <div className="form-group">
                        <label style={headerText}>
                          Item <span className="text-danger"> *</span>
                        </label>
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          defaultValue={{
                            label: editData.rfq_items[index].item_name,
                          }}
                          options={itemid.map((option) => ({
                            label: option.name,
                            value: option.id,
                          }))}
                          onChange={(selectedOption) => {
                            handleItemChange(
                              index,
                              "item_id",
                              selectedOption.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    {/* Quantity */}
                    <div className="col-md-3 mt-1">
                      <div className="form-group">
                        <label style={headerText}>
                          Quantity<span className="text-danger"> *</span>
                        </label>
                        <input
                          type="number"
                          name="name"
                          className="form-control"
                          defaultValue={item.qty}
                          onChange={(e) => {
                            handleItemChange(index, "qty", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    {/* unitid */}
                    <div className="col-md-3 mt-1">
                      <div className="form-group">
                        <label style={headerText}>
                          Unit <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          defaultValue={item.unit_id}
                          onChange={(e) => {
                            handleItemChange(index, "unit_id", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {showService &&
                form.rfq_services.map((service, index) => (
                  <div className="row">
                    <hr className="me-2 mt-2" />
                    <h4 style={headerText}>Service {index + 1}</h4>
                    <div className="col-md-3 me-1 mt-1">
                      <div className="form-group">
                        <label style={headerText}>
                          Service
                          <span className="text-danger"> *</span>
                        </label>
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          option={serviceid}
                          defaultValue={{
                            label: editData.rfq_services[index].service_name,
                          }}
                          options={serviceid.map((option) => ({
                            label: option.name,
                            value: option.id,
                          }))}
                          onChange={(selectedOption) => {
                            const updatedServices = [...form.rfq_services];
                            updatedServices[index] = {
                              ...updatedServices[index],
                              service_id: selectedOption.value,
                            };
                            setForm({
                              ...form,
                              pr_services: updatedServices,
                            });
                          }}
                        />
                      </div>
                    </div>
                    {/* unit_id */}
                    <div className="col-md-3 me-1 mt-1">
                      <div className="form-group">
                        <label style={headerText}>
                          Unit<span className="text-danger"> *</span>
                        </label>
                        <input
                          type="number"
                          name="name"
                          className="form-control"
                          defaultValue={service.unit_id}
                          onChange={(e) => {
                            const updatedServices = [...form.rfq_services];
                            updatedServices[index] = {
                              ...updatedServices[index],
                              unit_id: e.target.value,
                            };
                            setForm({
                              ...form,
                              rfq_services: updatedServices,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
      maxWidth: "150px",
      name: "Title",
      column: "title",
      selector: (row) => row.title,
    },
    {
      name: "RFQ Type",
      column: "rfq_type",
      selector: (row) => row.rfq_type,
    },
    {
      name: "Action",
      column: "status",
      maxWidth: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Edit
              aria-disabled
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                setEditData(row);
                setEditModal(true);
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
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Request For Quotation</h4>
            {/* <Button
              color="primary"
              size="sm"
              onClick={() => setAddModal(!addModal)}
            >
              Create
            </Button> */}
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
                        // onChange={(e) => {
                        //   query.status = e.target.value;
                        //   setQuery(query);
                        //   request();
                        // }}
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

export default rfq;

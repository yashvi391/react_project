import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Label,
  Badge,
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

const PurchaseOrder = () => {
  const params = useParams();

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
      .post(new URL("/api/v1/supplier/po/list", themeConfig.backendUrl), query)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        setTotal(res.data.data.total);
        setData(res.data.data.PurchaseOrders);
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
              `/api/v1/supplier/po/delete/${row.id}`,
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

  const [potype, setPotype] = useState([]);
  const [plants, setPlants] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    request();
    axios
      .post(new URL("/api/v1/supplier/po/list", themeConfig.backendUrl))
      .then((response) => {
        setPotype(response.data.data.PurchaseOrders);
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
      .post(new URL("/api/v1/users/list", themeConfig.backendUrl))
      .then((response) => {
        setUsers(response.data.data.rows);
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
    const [showStatus, setShowStatus] = useState(false);
    const [showService, setShowService] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectPlants, setSelectPlants] = useState("");
    const [selectUser, setSelectUser] = useState("");
    const [supplierId, setSupplierId] = useState("");

    // const [selectSupplier, setSelectSupplier] = useState("");

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Returned", value: "returned" },
      { label: "Refunded", value: "refunded" },
      { label: "On Hold", value: "onhold" },
      { label: "Backordered", value: "backordered" },
      { label: "Pending Review", value: "pending_review" },
      { label: "Fraud Alert", value: "fraud_alert" },
      { label: "Payment Failed", value: "payment_failed" },
      { label: "Partially Shipped", value: "partially_shipped" },
      { label: "Processing Delayed", value: "processing_delayed" },
      { label: "Out for Delivery", value: "out_for_delivery" },
      { label: "Failed Delivery Attempt", value: "failed_delivery_attempt" },
      { label: "Awaiting Pickup", value: "awaiting_pickup" },
    ];
    const [service, setService] = useState({
      subscriber_id: "",
      plant_id: "",
      order_date: "",
      supplier_id: "",
      user_id: "",
      total_amount: "",
      po_type: "",
      po_services: [
        {
          service_id: "",
          rfq_id: "",
          price: "",
          unit_id: "",
          subtotal: "",
        },
      ],
    });

    const [form, setForm] = useState({
      subscriber_id: "", // Provide a default subscriber_id if needed
      plant_id: "", // Provide a default plant_id if needed
      order_date: "", // Provide a default order_date if needed
      supplier_id: "", // Provide a default supplier_id if needed
      user_id: "", // Provide a default user_id if needed
      total_amount: "",
      po_type: "",
      po_items: [
        {
          item_id: "",
          qty: "",
          price: "",
          unit_id: "",
          subtotal: "",
        },
      ],
    });

    const addItemField = () => {
      setForm({
        ...form,
        po_items: [
          ...form.po_items,
          {
            item_id: "",
            qty: "",
            price: "",
            unit_id: "",
            subtotal: "",
            status: "pending",
          },
        ],
      });
    };
    const addServiceField = () => {
      setService({
        ...service,

        po_services: [
          ...service.po_services,
          {
            service_id: "",
            rfq_id: "",
            price: "",
            unit_id: "",
            subtotal: "",
            // status: "1", // You can set a default status value here
          },
        ],
      });
      setForm({
        ...form,
        po_items: [],
      });
    };
    const removeServiceField = (index) => {
      const updatedServices = [...service.po_services];
      updatedServices.splice(index, 1);
      setService({ ...service, po_services: updatedServices });
    };
    const removeItemField = (index) => {
      const updatedItems = [...form.po_items];
      updatedItems.splice(index, 1);
      setForm({ ...form, po_items: updatedItems });
    };
    const onSubmit = (e) => {
      e.preventDefault();

      const dataToSend = showService ? service : form;
      axios
        .post(
          new URL(
            "/api/v1/supplier/po/create",
            themeConfig.backendUrl
          ),
          {
            ...dataToSend,
            user_id: selectUser.value,
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
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      PO Type<span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={potype}
                      value={selectedOption}
                      // options={potype.map((option) => {
                      //   return {
                      //     label: option.po_type,
                      //     value: option.po_type,
                      //   };
                      // })}
                      onChange={(selectedOption) => {
                        setSelectedOption(selectedOption);
                        if (selectedOption && selectedOption.value === "item") {
                          setShowStatus(true);
                          setShowService(false);
                        }
                        if (
                          selectedOption &&
                          selectedOption.value === "service"
                        ) {
                          setShowService(true);
                          setShowStatus(false);
                        }
                        setForm({
                          ...form,
                          po_type: selectedOption ? selectedOption.value : "",
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Order Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="order_date"
                      value={form.order_date}
                      onChange={(e) => {
                        setForm({ ...form, order_date: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-3 me-1 mt-1">
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
                      // options={users.map((option) => {
                      //   return {
                      //     label: option.username,
                      //     value: option.id,
                      //   };
                      // })}
                      onChange={(e) => setSelectUser(e)}
                    />
                  </div>
                </div>

                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Plant Id<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.plant_id}
                      onChange={(e) => {
                        setForm({ ...form, plant_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 01"
                    />
                  </div>
                </div>
                {/* <div className="col-md-3 me-1 mt-1">
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
                          label: option.id,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => setSelectPlants(e)}
                    />
                  </div>
                </div> */}
                {/* <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      supplier <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={supplier}
                      value={selectSupplier}
                      options={supplier.map((option) => {
                        return {
                          label: option.id,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => setSelectSupplier(e)}
                    />
                  </div>
                </div> */}
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Supplier Id<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.supplier_id}
                      onChange={(e) => {
                        setForm({ ...form, supplier_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 01"
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Subscriber Id<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.subscriber_id}
                      onChange={(e) => {
                        setForm({ ...form, subscriber_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 01"
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Total Ammount<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.total_amount}
                      onChange={(e) => {
                        setForm({ ...form, total_amount: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 3000"
                    />
                  </div>
                </div>

                {showService &&
                  service.po_services.map((serviceItem, index) => (
                    <div className="row">
                      <hr className="me-2 mt-2" />
                      <h2>Service {index + 1}</h2>

                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Service ID<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={serviceItem && serviceItem.service_id}
                            onChange={(e) => {
                              const updatedServices = [...service.po_services];
                              if (updatedServices[index]) {
                                updatedServices[index].service_id = parseInt(
                                  e.target.value
                                );
                                setService({
                                  ...service,
                                  po_services: updatedServices,
                                });
                              }
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>

                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            RFQ ID<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={serviceItem && serviceItem.rfq_id}
                            onChange={(e) => {
                              const updatedServices = [...service.po_services];
                              if (updatedServices[index]) {
                                updatedServices[index].rfq_id = parseInt(
                                  e.target.value
                                );
                                setService({
                                  ...service,
                                  po_services: updatedServices,
                                });
                              }
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Price<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={serviceItem && serviceItem.price}
                            onChange={(e) => {
                              const updatedServices = [...service.po_services];
                              if (updatedServices[index]) {
                                updatedServices[index].price = parseInt(
                                  e.target.value
                                );
                                setService({
                                  ...service,
                                  po_services: updatedServices,
                                });
                              }
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Unit Id<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={serviceItem && serviceItem.unit_id}
                            onChange={(e) => {
                              const updatedServices = [...service.po_services];
                              if (updatedServices[index]) {
                                updatedServices[index].unit_id = parseInt(
                                  e.target.value
                                );
                                setService({
                                  ...service,
                                  po_services: updatedServices,
                                });
                              }
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Subtotal<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={serviceItem && serviceItem.subtotal}
                            onChange={(e) => {
                              const updatedServices = [...service.po_services];
                              if (updatedServices[index]) {
                                updatedServices[index].subtotal = parseInt(
                                  e.target.value
                                );
                                setService({
                                  ...service,
                                  po_services: updatedServices,
                                });
                              }
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>

                      {/* <div className="col-md-3 me-1 mt-1">
                      <div className="form-group">
                        <label>
                          Status<span className="text-danger"> *</span>
                        </label>
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          options={statusOptions} // Use "options" instead of "option"
                          value={statuselectedOption}
                          onChange={(selectedOption) => {
                            setSatuselectedOption(selectedOption);
                            setForm({
                              ...form,
                              status: selectedOption
                                ? selectedOption.value
                                : "",
                            });
                          }}
                        />
                      </div>
                    </div> */}
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => removeServiceField(index)}
                        >
                          Remove Service -
                        </Button>
                        <Button color="success" onClick={addServiceField}>
                          Add Service +
                        </Button>
                      </ModalFooter>
                    </div>
                  ))}
                {showStatus &&
                  form.po_items.map((service, index) => (
                    <div className="row">
                      <hr className="me-2 mt-2" />
                      <h2>Item {index + 1}</h2>

                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Item ID<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={form.po_items[index].item_id}
                            onChange={(e) => {
                              const updatedServices = [...form.po_items];
                              updatedServices[index].item_id = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...form,
                                po_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>

                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Quantity<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={form.po_items[index].qty}
                            onChange={(e) => {
                              const updatedServices = [...form.po_items];
                              updatedServices[index].qty = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...form,
                                po_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Price<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={form.po_items[index].price}
                            onChange={(e) => {
                              const updatedServices = [...form.po_items];
                              updatedServices[index].price = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...form,
                                po_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Unit Id<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={form.po_items[index].unit_id}
                            onChange={(e) => {
                              const updatedServices = [...form.po_items];
                              updatedServices[index].unit_id = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...form,
                                po_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Subtotal<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={form.po_items[index].subtotal}
                            onChange={(e) => {
                              const updatedServices = [...form.po_items];
                              updatedServices[index].subtotal = parseInt(
                                e.target.value
                              );
                              setForm({
                                ...form,
                                po_items: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>

                      {/* <div className="col-md-3 me-1 mt-1">
                        <div className="form-group">
                          <label>
                            Status<span className="text-danger"> *</span>
                          </label>
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            options={statusOptions} // Use "options" instead of "option"
                            value={statuselectedOption}
                            onChange={(selectedOption) => {
                              setSatuselectedOption(selectedOption);
                              setForm({
                                ...form,
                                status: selectedOption
                                  ? selectedOption.value
                                  : "",
                              });
                            }}
                          />
                        </div>
                      </div> */}
                      <ModalFooter>
                        <Button
                          color="danger"
                          onClick={() => removeItemField(index)}
                        >
                          Remove Item -
                        </Button>
                        <Button color="success" onClick={addItemField}>
                          Add Item +
                        </Button>
                      </ModalFooter>
                    </div>
                  ))}
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
      label: editData.po_type,
      value: editData.po_type,
    });

    const [form, setForm] = useState({
      id: editData.id,
      subscriber_id: editData.subscriber_id,
      plant_id: editData.plant_id,
      supplier_id: editData.supplier_id,
      user_id: editData.user_id,
      total_amount: editData.total_amount,
      po_type: editData.po_type,
      approval_status: editData.approval_status,
      payment_status: editData.payment_status,
    });

    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(
          new URL(
            "/api/v1/supplier/po/update",
            themeConfig.backendUrl
          ),
          { ...form, company_id: selectedOption.value.toString() }
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
                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      PO Type<span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={potype}
                      value={selectedOption}
                      // options={potype.map((option) => {
                      //   return {
                      //     label: option.po_type,
                      //     value: option.po_type,
                      //   };
                      // })}
                      onChange={(e) => setSelectedOption(e)}
                    />
                  </div>
                </div>

                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Total Ammount<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.total_amount}
                      onChange={(e) => {
                        setForm({ ...form, total_amount: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 3000"
                    />
                  </div>
                </div>
                {/* <div className="col-md-5 me-1 mt-1">
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
                </div> */}
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
      name: "PO Type",
      maxWidth: "150px",
      column: "po_type",
      selector: (row) => row.po_type,
    },
    {
      name: "Approval Status",
      maxWidth: "200px",
      column: "approval_status",
      selector: (row) => row.approval_status,
    },
    {
      name: "Payment Status",
      maxWidth: "200px",
      column: "payment_status",
      selector: (row) => row.payment_status,
    },
    {
      name: "Total Amount",
      column: "total_amount",
      selector: (row) => row.total_amount,
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
            <h4>Purchase Order</h4>
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

export default PurchaseOrder;

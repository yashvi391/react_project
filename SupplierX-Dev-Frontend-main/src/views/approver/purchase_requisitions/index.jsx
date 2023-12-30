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
const PurchaseRequisitions = () => {
  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };
  const [rfqModal, setRfqModal] = useState(false);
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
    status: "",
  });

  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL(
          "/api/v1/configuration/purchase-requisitions/prlist",
          themeConfig.backendUrl
        ),
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
              `/api/v1/configuration/purchase-requisitions/delete/${row.id}`,
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
  const [prservice, setPrservice] = useState();
  const [rfqitems, setRfqitems] = useState();
  const [plants, setPlants] = useState([]);
  const [itemid, setItem] = useState([]);
  const [serviceid, setServiceid] = useState([]);
  const [users, setUsers] = useState([]);

  const headerText = {
    // fontWeight: "bold",
    color: "#000",
  };
  const getApi = () => {
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
        new URL("/api/v1/configuration/services/list", themeConfig.backendUrl)
      )
      .then((response) => {
        setServiceid(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    request();
    axios
      .post(new URL("/api/v1/configuration/items/list", themeConfig.backendUrl))
      .then((response) => {
        setItem(response.data.data.rows);
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
  };
  useEffect(() => {
    // request();
    getApi();
  }, []);

  const RfqModal = () => {
    const [showItem, setShowItem] = useState(false);
    const [showService, setShowService] = useState(false);
    const [selectPlants, setSelectPlants] = useState("");
    const [selectUser, setSelectUser] = useState("");
    const [selectsupplier, setSelectsupplier] = useState("");

    const [purchaseReq, setPurchaseReq] = useState({
      id: editData.id,
      requisition_number: editData.requisition_number,
      requisition_date: editData.requisition_date,
      deadline: editData.deadline,
      plant_id: editData.plant_id,
      pr_type: editData.pr_type,
      pr_items: [
        {
          item_id: editData.item_name,
          qty: editData.qty,
          unit_id: editData.unit_id,
          quotation: "",
        },
      ],
      pr_services: [
        {
          unit_id: editData.unit_id,
          id: editData.id,
          service_id: editData.service_id,
        },
      ],
    });

    setRfqitems(editData.pr_items);
    setPrservice(editData.pr_services);

    useEffect(() => {
      if (purchaseReq.pr_type === "item") {
        setShowItem(true);
        setShowService(false);
        // const { pr_services, ...newForm } = purchaseReq;
        // setForm(newForm);
      } else if (purchaseReq.pr_type === "service") {
        setShowService(true);
        setShowItem(false);
        // const { pr_items, ...newForms } = purchaseReq;
        // setForm(newForms);
      }
    }, [purchaseReq.pr_type]);

    const [selectPlantss, setSelectPlantss] = useState({
      label: editData.plant_name,
      value: editData.plant_id,
    });
    const isoDate = editData.requisition_date;
    const datePart = isoDate ? isoDate.split("T")[0] : "";

    const deadline = editData.deadline;
    const deadlineDate = deadline ? deadline.split("T")[0] : "";

    const [form, setForm] = useState({
      subscriber_id: "1",
      plant_id: "",
      user_id: "",
      rfq_number: "",
      title: "",
      rfq_date: "",
      deadline: "",
      description: "",
      pr_id: "",
      rfq_type: "",
      rfq_items: [],
      rfq_services: [],
    });

    useEffect(() => {
      if (editData && Array.isArray(editData.pr_items)) {
        // Extract item_id and qty from pr_items and create a new array
        const rfqItemsData = editData.pr_items.map((prItem) => ({
          item_id: prItem.item_id,
          qty: prItem.qty,
          unit_id: prItem.unit_id,
          quotation: prItem.quotation,
        }));
        // Update the form state with the new rfq_items data
        setForm((prevForm) => ({
          subscriber_id: "1",
          plant_id: form.plant_id,
          user_id: form.user_id,
          rfq_number: form.rfq_number,
          title: form.title,
          rfq_date: form.rfq_date,
          deadline: form.deadline,
          description: form.description,
          pr_id: form.pr_id,
          unit_id: form.unit_id,
          rfq_type: form.rfq_type,
          rfq_items: rfqItemsData,
          rfq_type: editData.pr_type === "item" ? "item" : prevForm.rfq_type,
        }));
      } else if (editData && Array.isArray(editData.pr_services)) {
        // Extract service_id from pr_services and create a new array
        const rfqServicesData = editData.pr_services.map((prService) => ({
          service_id: prService.service_id,
          unit_id: prService.unit_id,
        }));
        // Update the form state with the new rfq_services data
        setForm((prevForm) => ({
          ...prevForm,
          rfq_services: rfqServicesData,
          rfq_type:
            editData.pr_type === "service" ? "service" : prevForm.rfq_type,
        }));
      } else {
        console.warn(
          "editData or editData.pr_items is undefined or not an array"
        );
      }
    }, [editData.pr_services, editData.pr_items, editData.pr_type]);

    const onSubmitRfq = (e) => {
      if (new Date(form.deadline) < new Date(form.requisition_date)) {
        return toast.error(
          "Deadline date cannot be earlier than requisition date"
        );
      }
      e.preventDefault();
      let dataToSend = { ...form };

      // Set a blank quotation value for each item in rfq_items
      if (dataToSend.rfq_items && Array.isArray(dataToSend.rfq_items)) {
        dataToSend.rfq_items = dataToSend.rfq_items.map((item) => ({
          item_id: item.item_id,
          qty: item.qty,
          unit_id: item.unit_id,
          status: "1",
        }));
        delete purchaseReq.pr_items;
      }

      // Set user_id, supplier_id, and plant_id
      dataToSend.user_id = selectUser.value;
      dataToSend.supplier_id = selectsupplier.value;
      dataToSend.plant_id = selectPlants.value;

      if (form.rfq_type === "item") {
        // Exclude pr_items
        delete dataToSend.pr_items;
        delete dataToSend.rfq_services;
      } else if (form.rfq_type === "service") {
        // Exclude rfq_items and prservice
        delete dataToSend.rfq_items;
        delete dataToSend.prservice;
        dataToSend.rfq_services = prservice.map((prService) => ({
          service_id: prService.service_id,
          unit_id: prService.unit_id,
        }));
        dataToSend.rfq_type = "service";
      }

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
          setRfqModal(false);
          return toast.success(res.data.message);
        });
    };
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    return (
      <div className="vertically-centered-modal ">
        <Modal
          isOpen={rfqModal}
          toggle={() => setRfqModal(!rfqModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setRfqModal(!rfqModal)}>
            <h4 style={{ color: "#E06522" }}>Purchase Request Details</h4>
          </ModalHeader>
          <Form onSubmit={onSubmitRfq} id="form">
            <ModalBody>
              <div className="row">
                {/* plant */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Plant <span className="text-danger"> *</span>
                    </label>
                    <Select
                      selected
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={plants}
                      value={selectPlantss}
                      options={plants.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      isDisabled={true}
                      // onChange={(e) => setSelectPlantss(e)}
                    />
                  </div>
                </div>
                {/* number */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Requisition Number.
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      disabled
                      type="text"
                      name="requisition_number"
                      value={purchaseReq.requisition_number}
                      className="form-control"
                      placeholder="Eg. 001"
                    />
                  </div>
                </div>
                {/* date */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Requisition Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      disabled
                      type="date"
                      name="name"
                      value={datePart}
                      className="form-control"
                      placeholder="Eg. Laptop"
                    />
                  </div>
                </div>
                {/* deadline */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Deadline Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      disabled
                      type="date"
                      name="name"
                      value={deadlineDate}
                      className="form-control"
                      placeholder=""
                    />
                  </div>
                </div>

                {showItem &&
                  rfqitems.map((item, index) => (
                    <div className="row">
                      <hr className="me-2 mt-2" />
                      <h4 style={headerText}>Item {index + 1}</h4>
                      {/* item */}
                      <div className="col-md-4 mt-1">
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
                            options={itemid.map((item) => ({
                              label: item.name,
                              value: item.id,
                            }))}
                            value={{
                              label: rfqitems[index].item_name, // Display the selected item's name
                              value: rfqitems[index].item_id, // Use the selected item's ID
                            }}
                            onChange={(selectedOption) => {
                              const updatedRfqItems = [...rfqitems];
                              updatedRfqItems[index].item_id =
                                selectedOption.value;
                              updatedRfqItems[index].item_name =
                                selectedOption.label;

                              setForm({
                                ...form,
                                rfq_items: updatedRfqItems,
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-4 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Quantity<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number"
                            name="name"
                            value={rfqitems[index].qty}
                            onChange={(e) => {
                              const updatedRfqItems = [...rfqitems];
                              updatedRfqItems[index].qty = parseInt(
                                e.target.value
                              );

                              setForm({
                                ...form,
                                pr_items: updatedRfqItems,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      {/* unit id  */}
                      <div className="col-md-4 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Unit <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number"
                            name="name"
                            value={rfqitems[index].unit_id}
                            onChange={(e) => {
                              const updatedRfqItems = [...rfqitems];
                              updatedRfqItems[index].unit_id = e.target.value;

                              setForm({
                                ...form,
                                rfq_items: updatedRfqItems,
                              });
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                {showService &&
                  prservice.map((service, index) => (
                    <div className="row" key={index}>
                      <hr className="me-2 mt-2" />
                      <h4 style={headerText}>Service {index + 1}</h4>
                      {/* Service */}
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Service <span className="text-danger"> *</span>
                          </label>

                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            options={serviceid.map((item) => ({
                              label: item.name,
                              value: item.id,
                            }))}
                            value={{
                              label: prservice[index].service_name, // Display the selected item's name
                              value: prservice[index].service_id, // Use the selected item's ID
                            }}
                            onChange={(selectedOption) => {
                              const updatedServices = [...prservice];
                              updatedServices[index].service_id =
                                selectedOption.value;
                              updatedServices[index].service_name =
                                selectedOption.label;

                              setForm({
                                ...form,
                                prservice: updatedServices,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Unit <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number"
                            name="name"
                            value={prservice[index].unit_id}
                            onChange={(e) => {
                              const updatedServices = [...prservice];
                              updatedServices[index].unit_id = e.target.value;

                              setForm({
                                ...form,
                                prservice: updatedServices,
                              });
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <br />
              <div className="row first">
                <ModalHeader>
                  <h4 style={{ color: "#E06522" }}>
                    Create Request For Quotation
                  </h4>
                </ModalHeader>
                {/* plant */}
                <div className="col-md-5 me-1 mt-1">
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
                      onChange={(e) => setSelectPlants(e)}
                    />
                  </div>
                </div>
                {/* user */}
                <div className="col-md-5 me-1 mt-1">
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
                      onChange={(e) => setSelectUser(e)}
                    />
                  </div>
                </div>
                {/* rfq */}
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
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
                <div className="col-md-4 mt-1">
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
                {/* pr id */}
                <div className="col-md-4 mt-1">
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
                    />
                  </div>
                </div>
                {/* rfq date */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
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
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Deadline Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={(e) => {
                        setForm({ ...form, deadline: e.target.value });
                      }}
                      min={getCurrentDate()}
                      className="form-control"
                    />
                  </div>
                </div>
                {/* description */}
                <div className="col-md-4 me-1 mt-1">
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
  const AddModal = () => {
    const [showItem, setShowItem] = useState(false);
    const [showService, setShowService] = useState(false);
    const [selectPlants, setSelectPlants] = useState("");

    const [form, setForm] = useState({
      subscriber_id: "1",
      plant_id: "",
      requisition_number: "",
      requisition_date: "",
      deadline: "",
      status: "submitted",
      pr_type: "",
    });
    const [additem, setAdditem] = useState({
      pr_items: [
        {
          item_id: "",
          qty: "",
          unit_id: "",
        },
      ],
    });
    const addItemField = () => {
      console.log("additemfield");
      const newItem = {
        item_id: "",
        qty: "",
        unit_id: "",
      };

      setAdditem((prevState) => ({
        ...prevState,
        pr_items: [...prevState.pr_items, newItem],
      }));
    };
    const removeItemField = (index) => {
      console.log("removeitemfield");
      const updatedItems = [...additem.pr_items];
      updatedItems.splice(index, 1);
      setAdditem({ ...additem, pr_items: updatedItems });

      if (updatedItems.length === 0) {
        setShowItem(true);
      }
    };

    const [addservice, setAddservice] = useState({
      pr_services: [
        {
          service_id: "",
          unit_id: "",
        },
      ],
    });
    const addServiceField = () => {
      const newService = {
        service_id: "",
        unit_id: "",
      };

      setAddservice((prevState) => ({
        ...prevState,
        pr_services: [...prevState.pr_services, newService],
      }));
    };
    // const addServiceField   = () => {
    //   setSelectedService(null); // Clear the selectedService
    //   setAddservice({
    //     ...addservice,
    //     pr_services: [
    //       ...addservice.pr_services,
    //       {
    //         service_id: "", // Clear the service_id in the new service field
    //         unit_id: "",
    //       },
    //     ],
    //   });
    // };
    const removeServiceField = (index) => {
      const updatedServices = [...addservice.pr_services];
      updatedServices.splice(index, 1);
      setAddservice({ ...addservice, pr_services: updatedServices });
    };
    const onSubmit = (e) => {
      e.preventDefault();
      if (new Date(form.deadline) < new Date(form.requisition_date)) {
        toast.error("Deadline date cannot be earlier than requisition date");
      }
      const dataToSend = {
        ...form,
        plant_id: selectPlants.value, // Store plant_id
        pr_type: showService ? "service" : "item", // Store pr_type based on showService
      };

      if (showService) {
        dataToSend.pr_services = addservice.pr_services.map((service) => ({
          service_id: parseInt(service.service_id || 0, 10),
          unit_id: service.unit_id,
        }));
      }

      if (showItem) {
        dataToSend.pr_items = additem.pr_items.map((item) => ({
          item_id: parseInt(item.item_id || 0, 10), // Assuming item_id is an object with a value property
          qty: parseInt(item.qty || 0, 10),
          unit_id: item.unit_id,
        }));
      }
      axios
        .post(
          new URL(
            "/api/v1/configuration/purchase-requisitions/create",
            themeConfig.backendUrl
          ),
          dataToSend
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
      setAdditem({ ...form, ...additem, pr_type: "item" });
      setShowItem(true);
      setShowService(false);
      console.log("setshowitem");
    };
    const good = () => {
      setAddservice({ ...form, ...addservice, pr_type: "service" });
      setShowItem(false);
      setShowService(true);
    };
    const handleServiceChange = (index, key, value) => {
      const updatedItems = [...addservice.pr_services];
      updatedItems[index][key] = value;
      setAddservice({ ...addservice, pr_services: updatedItems });
    };

    const handleItemChange = (index, field, value) => {
      const updatedItems = [...additem.pr_items];
      updatedItems[index][field] = value;

      setAdditem({
        ...additem,
        pr_items: updatedItems,
      });
    };
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    return (
      <div className="vertically-centered-modal ">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            <h2 style={{ color: "#E06522" }}> CREATE</h2>
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row first">
                {/* plant */}
                <div className="col-md-5 me-1 mt-1">
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
                      onChange={(e) => setSelectPlants(e)}
                    />
                  </div>
                </div>
                {/* number */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Requisition Number.
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="requisition_number"
                      value={form.requisition_number}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          requisition_number: e.target.value,
                        });
                      }}
                      className="form-control"
                      placeholder="Eg. 001"
                    />
                  </div>
                </div>
                {/* date */}
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label style={headerText}>
                      Requisition Date<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="name"
                      value={form.requisition_date}
                      onChange={(e) => {
                        setForm({ ...form, requisition_date: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. Laptop"
                    />
                  </div>
                </div>
                {/* deadline */}
                <div className="col-md-5 me-1 mt-1">
                  <div>
                    {/* Your form here */}
                    <div className="form-group">
                      <label style={headerText}>
                        Deadline Date<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="date"
                        name="name"
                        value={form.deadline}
                        onChange={(e) => {
                          setForm({ ...form, deadline: e.target.value });
                        }}
                        min={getCurrentDate()}
                        className="form-control"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <ModalHeader className="me-2 mt-1">
                  <Button color="danger" onClick={item}>
                    Item
                  </Button>
                  <Button
                    className="m-1 mt-0 mb-0"
                    color="success"
                    onClick={good}
                  >
                    Service
                  </Button>
                </ModalHeader>
                {showService &&
                  addservice.pr_services.map((service, index) => (
                    <div className="row mt-1">
                      <h3 style={{ color: "#E06522" }}>Service {index + 1}</h3>

                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Service <span className="text-danger"> *</span>
                          </label>
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            options={serviceid.map((option) => ({
                              label: option.name,
                              value: option.id,
                            }))}
                            value={
                              service.service_id
                                ? {
                                    label: service.service_name,
                                    value: service.service_id,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                // Update the state with the selected service_id and service_name
                                handleServiceChange(
                                  index,
                                  "service_id",
                                  selectedOption.value
                                );
                                handleServiceChange(
                                  index,
                                  "service_name",
                                  selectedOption.label
                                );
                              } else {
                                // If no option is selected, reset both service_id and service_name
                                handleServiceChange(index, "service_id", "");
                                handleServiceChange(index, "service_name", "");
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 me-1 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Unit<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={service.unit_id}
                            onChange={(e) => {
                              const updatedServices = [
                                ...addservice.pr_services,
                              ];
                              updatedServices[index].unit_id = e.target.value;
                              setAddservice({
                                ...addservice,
                                pr_services: updatedServices,
                              });
                            }}
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <ModalFooter className="mt-1 mb-1">
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
                  additem.pr_items.map((item, index) => (
                    <div key={index} className="row mt-1">
                      <h3 style={{ color: "#E06522" }}>Item {index + 1}</h3>
                      <div className="col-md-4 mt-1">
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
                            options={itemid.map((option) => ({
                              label: option.name,
                              value: option.id,
                            }))}
                            value={
                              item.item_id
                                ? { label: item.item_name, value: item.item_id }
                                : null
                            }
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                // Update the state with the selected item_id and item_name
                                handleItemChange(
                                  index,
                                  "item_id",
                                  selectedOption.value
                                );
                                handleItemChange(
                                  index,
                                  "item_name",
                                  selectedOption.label
                                );
                              } else {
                                // If no option is selected, reset both item_id and item_name
                                handleItemChange(index, "item_id", "");
                                handleItemChange(index, "item_name", "");
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Quantity<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number" // Change the input type to "number"
                            name="name"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mt-1">
                        <div className="form-group">
                          <label style={headerText}>
                            Unit<span className="text-danger"> *</span>
                          </label>
                          <input
                            type="tet" // Change the input type to "number"
                            name="name"
                            value={item.unit_id}
                            onChange={(e) =>
                              handleItemChange(index, "unit_id", e.target.value)
                            }
                            className="form-control"
                            placeholder="Eg. 001"
                          />
                        </div>
                      </div>
                      <ModalFooter className="mt-1 mb-1">
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
  // edit modal /
  const EditModal = () => {
    // date
    // const isoDate = editData.requisition_date;
    // const datePart = isoDate ? isoDate.split("T")[0] : "";

    // const deadline = editData.deadline;
    // const deadlineDate = deadline ? deadline.split("T")[0] : "";

    const [showItem, setShowItem] = useState(false);
    const [showService, setShowService] = useState(false);

    // dropdown value
    const [selectPlants, setSelectPlants] = useState({
      label: editData.plant_name,
      value: editData.plant_id,
    });

    setRfqitems(editData.pr_items);
    setPrservice(editData.pr_services);

    const prItems = editData.pr_items || [];
    const prServices = editData.pr_services || [];

    // editedData values
    const [editedData, setEditedData] = useState({
      id: editData.id,
      subscriber_id: (editData.subscriber_id || "").toString(),
      requisition_number: editData.requisition_number,
      requisition_date: editData.requisition_date
        ? editData.requisition_date.split("T")[0]
        : "",
      deadline: editData.deadline ? editData.deadline.split("T")[0] : "",
      plant_id: editData.plant_id,
      pr_type: editData.pr_type,
      pr_items: prItems.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        qty: item.qty,
        unit_id: item.unit_id,
      })),
      pr_services: prServices.map((service) => ({
        id: service.id,
        service_id: service.service_id,
        unit_id: service.unit_id,
      })),
    });

    // pr_items: prItems,
    // pr_services: prServices,

    useEffect(() => {
      if (editedData.pr_type === "item") {
        setShowItem(true);
        setShowService(false);
      } else if (editedData.pr_type === "service") {
        setShowService(true);
        setShowItem(false);
      }
    }, [editedData.pr_type]);

    const onSubmitEdit = (e) => {
      e.preventDefault();
      if (editedData.pr_type === "item") {
        delete editedData.pr_services;
      } else {
        delete editedData.pr_items;
      }
      axios
        .put(
          new URL(
            "/api/v1/configuration/purchase-requisitions/update",
            themeConfig.backendUrl
          ),
          {
            ...editedData,
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
          <ModalBody>
            <div className="row first">
              {/* plant */}
              <div className="col-md-5 me-1 mt-1">
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
                      setEditedData({
                        ...editedData,
                        plant_id: selectedOption.value, // Update plant_id in editedData
                      });
                    }}
                  />
                </div>
              </div>
              {/* number */}
              <div className="col-md-5 me-1 mt-1">
                <div className="form-group">
                  <label style={headerText}>
                    Requisition Number.
                    <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    name="requisition_number"
                    className="form-control"
                    defaultValue={editedData.requisition_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditedData({
                        ...editedData,
                        requisition_number: value,
                      });
                    }}
                  />
                </div>
              </div>
              {/* date */}
              <div className="col-md-5 me-1 mt-1">
                <div className="form-group">
                  <label style={headerText}>
                    Requisition Date<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="date"
                    name="requisition_date"
                    className="form-control"
                    value={editedData.requisition_date} // Use value to set the displayed date
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setEditedData({
                        ...editedData,
                        requisition_date: newDate,
                      });
                    }}
                  />
                </div>
              </div>
              {/* deadline */}
              <div className="col-md-5 me-1 mt-1">
                <div className="form-group">
                  <label style={headerText}>
                    Deadline Date<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="date"
                    name="name"
                    className="form-control"
                    value={editedData.deadline} // Use value to set the displayed date
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setEditedData({
                        ...editedData,
                        deadline: newDate,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            {showItem &&
              editedData.pr_items.map((item, index) => (
                <div className="row">
                  <hr className="me-2 mt-2" />
                  <h4 style={{ color: "#E06522" }}>Item {index + 1}</h4>
                  {/* item */}
                  <div className="col-md-3 mt-1">
                    <div className="form-group">
                      <label style={headerText}>
                        Item<span className="text-danger"> *</span>
                      </label>
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editData.pr_items[index].item_name,
                        }}
                        options={itemid.map((option) => ({
                          label: option.name,
                          value: option.id,
                        }))}
                        onChange={(selectedOption) => {
                          const updatedPrItems = [...editedData.pr_items];
                          updatedPrItems[index] = {
                            ...updatedPrItems[index],
                            item_id: selectedOption.value,
                          };
                          setEditedData({
                            ...editedData,
                            pr_items: updatedPrItems,
                          });
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
                          const updatedPrItems = [...editedData.pr_items];
                          updatedPrItems[index] = {
                            ...updatedPrItems[index],
                            qty: e.target.value,
                          };
                          setEditedData({
                            ...editedData,
                            pr_items: updatedPrItems,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {/* unit */}
                  <div className="col-md-3 mt-1">
                    <div className="form-group">
                      <label style={headerText}>
                        Unit<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        name="name"
                        className="form-control"
                        defaultValue={item.unit_id}
                        onChange={(e) => {
                          const updatedPrItems = [...editedData.pr_items];
                          updatedPrItems[index] = {
                            ...updatedPrItems[index],
                            unit_id: e.target.value,
                          };
                          setEditedData({
                            ...editedData,
                            pr_items: updatedPrItems,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {showService &&
              editedData.pr_services.map((service, index) => (
                <div className="row">
                  <hr className="me-2 mt-2" />
                  <h4 style={{ color: "#E06522" }}>Service {index + 1}</h4>
                  {/* service */}
                  <div className="col-md-4 me-1 mt-1">
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
                          label: editData.pr_services[index].service_name,
                        }}
                        options={serviceid.map((option) => ({
                          label: option.name,
                          value: option.id,
                        }))}
                        onChange={(selectedOption) => {
                          const updatedPrServices = [...editedData.pr_services];
                          updatedPrServices[index] = {
                            ...updatedPrServices[index],
                            service_id: selectedOption.value,
                          };
                          setEditedData({
                            ...editedData,
                            pr_services: updatedPrServices,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {/* unit_id */}
                  <div className="col-md-4 me-1 mt-1">
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
                          const updatedPrServices = [...editedData.pr_services];
                          updatedPrServices[index] = {
                            ...updatedPrServices[index],
                            unit_id: e.target.value,
                          };
                          setEditedData({
                            ...editedData,
                            pr_services: updatedPrServices,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onSubmitEdit}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };
  // basic column
  const basicColumns = [
    {
      name: "Req.. Number",
      maxWidth: "200px",
      sortable: true,
      column: "requisition_number",
      selector: (row) => row.requisition_number,
    },
    {
      name: "Purchase Req.. Type",
      column: "pr_type",
      selector: (row) => row.pr_type,
    },
    {
      name: "Action",
      column: "status",
      maxWidth: "350px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Button className="btn btn-info me-md-1 btn-sm">Auction</Button>
            <Button
              className="btn btn-info me-md-1 btn-sm"
              type="submit"
              onClick={() => {
                setEditData(row);
                setRfqModal(!rfqModal);
              }}
            >
              RFQ Create
            </Button>

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
        <RfqModal />
        <AddModal />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Purchase Request</h4>
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
              {/* <h2>There is no data to show. Please try again.</h2> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseRequisitions;

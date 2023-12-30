import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
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

const MySwal = withReactContent(Swal);
const FieldSettings = () => {
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [displayValue, setDisplayValue] = useState();
  const [requiredValue, setRequiredValue] = useState();
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });
  const [module, setModule] = useState({
    module_name: "all",
    group_name: "all",
  });
  const request = () => {
    axios
      .post(
        new URL(
          "/api/v1/workFlow/fieldConfig/getfieldnames",
          themeConfig.backendUrl
        ),
        module
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setTotal(res.data.data.length);
        setData(res.data.data);
      });
  };
  const Update = (value) => {
    axios
      .put(
        new URL("v1/workFlow/fieldConfig/update", themeConfig.backendUrl),
        value
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        toast.success(res.data.message);
        request();
      });
  };

  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Field Selection</h4>
            <p>Choose Fields To Be Appeared On Supplier Registration Form</p>
          </div>
          <hr />
          {data !== null ? (
            <>
              <div className="d-flex justify-content-between mb-1">
                <div></div>
                <div className="row">
                  <div className="col-md">
                    <div className="form-group">
                      <label>Group Name</label>
                      <select
                        className="form-select"
                        onChange={(e) => {
                          module.group_name = e.target.value;
                          const list = {
                            module_name:
                              module.group_name === "all"
                                ? "all"
                                : "supplier_registration",
                            group_name:
                              module.group_name === "all"
                                ? "all"
                                : module.group_name,
                          };
                          axios
                            .post(
                              new URL(
                                "/api/v1/workFlow/fieldConfig/getfieldnames",
                                themeConfig.backendUrl
                              ),
                              list
                            )
                            .then((res) => {
                              if (res.data.error) {
                                toast.error(res.data.message);
                              }
                              console.log(res.data);
                              setTotal(res.data.data.length);
                              setData(res.data.data);
                            });
                          setModule(list);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="companyDetails">Company Details</option>
                        <option value="businessDetails">
                          Business Details
                        </option>
                        <option value="taxDetails">Tax Details</option>
                        <option value="financialDetails">
                          Finance Details
                        </option>
                        <option value="additionalDetails">
                          Additional Details
                        </option>
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
              <Card>
                <CardBody>
                  <Row>
                    {data.map((item, index) => (
                      <>
                        <Col md={4}>
                          <div className="mt-1 mb-1 pb-1">
                            <label
                              className="pb-0"
                              style={{ fontSize: "16px" }}
                            >
                              {item.display_name}
                            </label>
                            <div className="demo-inline-spacing">
                              <div className="form-check form-check-inline">
                                <Input
                                  id="isPrimary"
                                  name="isPrimary"
                                  type="checkbox"
                                  checked={item.display == 1 ? true : false}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? "1"
                                      : "0";
                                    const data = {
                                      id: item.id,
                                      display: newValue,
                                      required: item.required,
                                    };
                                    console.log(item.id);
                                    Update(data);
                                  }}
                                />
                                <label class="pb-0 mb-1">Display</label>
                              </div>
                              <div className="form-check form-check-inline">
                                <Input
                                  id="displayField"
                                  name="displayField"
                                  checked={item.required == 1 ? true : false}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? "1"
                                      : "0";
                                    const data = {
                                      id: item.id,
                                      display: item.display,
                                      required: newValue,
                                    };
                                    Update(data);
                                  }}
                                  type="checkbox"
                                />
                                <label class="pb-0 mb-1">Required</label>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </>
                    ))}
                  </Row>
                  <Button
                    color="success"
                    className="mt-2"
                    onClick={() => toast.success("Saved Successfully")}
                  >
                    Save
                  </Button>
                </CardBody>
              </Card>
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

export default FieldSettings;

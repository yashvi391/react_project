// ** React Imports
import { useEffect, useState } from "react";
import themeConfig from "../../../../configs/themeConfig";
// ** Third Party Components
import axios from "axios";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const SupportTracker = (props) => {
  const [value, setValue] = useState();
  useEffect(() => {
    axios
      .post(new URL("/api/admin/dashboard/percentage", themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        console.log(res.data, "percentage data");
        setValue(res.data);
      });
  }, []);
  const data = {
    title: "Vendors Status Tracker",
    last_days: ["Last 28 Days", "Last Month", "Last Year"],
    totalVendor: value?.totalRecords,
    verifiedVendor: value?.verifiedVendorCount,
    approvedVendor: value?.approvedVendorCount,
    pendingVendor: value?.noSapCodeCount,
    queriedVendors: value?.queriedVendors,
  };
  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: "#fff",
            strokeWidth: "100%",
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: "Montserrat",
              fontSize: "1rem",
            },
            value: {
              offsetY: 15,
              fontFamily: "Montserrat",
              fontSize: "1.714rem",
            },
          },
        },
      },
      colors: [props.danger],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Approved Vendors"],
    },
    series = [value?.percentageApprovedVendors];
  // series = [90];
  // const glassEffect1 = {
  //   borderRadius: "10px",
  //   backdropFilter: "blur(5px)",
  //   color: "white",
  //   background: "linear-gradient(135deg, #ff6700,#f08300,#ed9121)",
  // };
  // const headerStyle = {
  //   color: "#f8f8f8",
  // };
  return data !== null ? (
    <Card >
      <CardHeader className="pb-0">
        <CardTitle tag="h4" >
          {data.title}
        </CardTitle>
        <UncontrolledDropdown className="chart-dropdown">
          <DropdownToggle
            color=""
            className="bg-transparent btn-sm border-0 p-50"
          >
            {/* Last 7 days */}
          </DropdownToggle>
          <DropdownMenu end>
            {data.last_days.map((item) => (
              <DropdownItem className="w-100" key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm="2" className="d-flex flex-column flex-wrap text-center">
            <h1
              className="font-large-2 fw-bolder mt-2 mb-0"
             
            >
              {data.totalVendor}
            </h1>
            <CardText>Vendors</CardText>
          </Col>
          <Col sm="10" className="d-flex justify-content-center">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={270}
              id="support-tracker-card"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-1">
          <div className="text-center">
            <CardText className="mb-50">New Vendor</CardText>
            <span className="font-large-1 fw-bold">{data.pendingVendor}</span>
          </div>
          {/* <div className="text-center">
            <CardText className="mb-50" style={headerStyle}>
              Verified Vendor
            </CardText>
            <span className="font-large-1 fw-bold">{data.verifiedVendor}</span>
          </div> */}
          <div className="text-center">
            <CardText className="mb-50">Queried Vendor</CardText>
            <span className="font-large-1 fw-bold">{data.queriedVendors}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  ) : null;
};
export default SupportTracker;

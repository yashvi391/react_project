// ** React Imports

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
} from "reactstrap";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { kFormatter } from "@utils";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { CircularProgress } from "@mui/material";
// ** Demo Components
import { useRTL } from "@hooks/useRTL";
// ** Custom Components
// ** Images
import SubscribersGained from "@src/views/ui-elements/cards/statistics/SubscribersGained";
import ApexColumnCharts from "../../ui-elements/cards/statistics/DataChart";
// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import SupportTracker from "../../ui-elements/cards/analytics/SupportTracker";
import TotalIncomeDarkCard from "../../ui-elements/cards/cards/TotalIncomeDarkCard";
import GstRegistered from "../../ui-elements/cards/statistics/GstRegistered";
const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [isRtl] = useRTL();
  const [value, setValue] = useState();
  const { colors } = useContext(ThemeColors);
  useEffect(() => {
    setLoading(true);
    axios
      .post(new URL("/api/admin/dashboard/count", themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setValue(res.data);
          setLoading(false);
        }
      });
    // If there is no data after 2 seconds, display a message
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup the timeout if the component unmounts
  }, []);
  // ** Context
  const data = [
    {
      count:
        value && value.totalRegisteredVendors
          ? value.totalRegisteredVendors
          : "0",
      text: "Registered Vendors",
      className: "card-orange",
    },
    {
      count: value && value.pendingVendorCount ? value.pendingVendorCount : "0",
      text: "Pending Vendors",
      className: "card-purple",
    },
    {
      count:
        value && value.verifiedVendorCount ? value.verifiedVendorCount : "0",
      text: "Verified Vendors",
      className: "card-blue",
    },
    {
      count:
        value && value.approvedVendorCount ? value.approvedVendorCount : "0",
      text: "Approved Vendors",
      className: "card-green",
    },
  ];
  return (
    <div id="dashboard-analytics">
      <Row>
        {data.map((item, index) => (
          <Col lg="3" md="6" sm="12" key={index}>
            <Card className={item.className}>
              <CardBody className="text-center">
                <div className="text-center">
                  <h1 style={{ fontSize: "40px" }} className="mb-1 text-white">
                    {loading ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      <h2
                        style={{ fontSize: "40px" }}
                        className="mb-1 text-white"
                      >
                        {item.count}
                      </h2>
                    )}
                  </h1>
                  <CardText className="m-auto">{item.text}</CardText>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg="6" xs="12">
          <SupportTracker
            primary={colors.primary.main}
            danger={colors.success.main}
          />
        </Col>
        <Col lg="6" md="12" xs="12">
          <Row>
            <Col lg="6" md="6" sm="12">
              <SubscribersGained kFormatter={kFormatter} />
            </Col>
            <Col lg="6" md="6" sm="12">
              <GstRegistered kFormatter={kFormatter} />
            </Col>
          </Row>
          <Col lg="12" md="6" sm="12">
            <TotalIncomeDarkCard />
          </Col>
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="12" md="12" sm="12">
          <ApexColumnCharts direction={isRtl ? "rtl" : "ltr"} />
        </Col>
      </Row>
      <Row className="match-height">
        {/* <Col lg="8" md="6" sm="12">
          <StatsCard cols={{ xl: "3", sm: "6" }} />
        </Col> */}
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;

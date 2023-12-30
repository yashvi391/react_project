// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import { Truck, Users } from "react-feather";
import themeConfig from "../../../../configs/themeConfig";
import { Beenhere } from "@mui/icons-material";
import axios from "axios";
// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const SubscribersGained = ({ kFormatter }) => {
  const [value, setValue] = useState();
  useEffect(() => {
    axios
      .post(
        new URL("v1/admin/dashboard/supplier-analytics", themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        setValue(res.data.data);
      });
  }, []);

  // ** State
  const data = {
    series: [
      {
        name: "Suppliers",
        data: [12, 22, 30, 22, 38, 39, 42],
      },
    ],
    analyticsData: {
      gstRegistered: value?.gstRegistered,
      panRegistered: value?.panRegistered,
    },
  };
  return data !== null ? (
    <>
      <div className="d-flex flex-row">
        <StatsWithAreaChart
          icon={<Beenhere sx={{ fontSize: 40 }} />}
          color="primary"
          stats={kFormatter(data.analyticsData.panRegistered)}
          statTitle="PAN Verified Vendor"
          series={data.series}
          type="area"
        />
      </div>
    </>
  ) : null;
};

export default SubscribersGained;

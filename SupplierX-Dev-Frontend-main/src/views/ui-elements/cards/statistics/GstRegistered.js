// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import { Truck, Users } from "react-feather";
import themeConfig from "../../../../configs/themeConfig";
import axios from "axios";
// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";
import { Beenhere } from "@mui/icons-material";

const GstRegistered = ({ kFormatter }) => {
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
        data: [15, 40, 36, 40, 39, 55, 60],
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
          color="success"
          stats={kFormatter(data.analyticsData.gstRegistered)}
          statTitle="GST Verified Vendor"
          series={data.series}
          type="area"
        />
      </div>
    </>
  ) : null;
};

export default GstRegistered;

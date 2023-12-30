// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { AlertCircle, Calendar } from "react-feather";
import axios from "axios";
import Stack from "@mui/material/Stack";
import themeConfig from "../../../../configs/themeConfig";
import { CircularProgress } from "@mui/material";
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { useEffect, useState } from "react";

const ApexColumnCharts = ({ direction }) => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState();
  const columnColors = {
    series4: "#17B169",
    series1: "#f07532",
    series3: "#0CAFFF",
    series2: "#705ac7",
    bg: "#EBE9F1",
  };

  // ** Chart Options
  const options = {
    chart: {
      height: 400,
      type: "bar",
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        colors: {
          backgroundBarColors: [
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
          ],
          backgroundBarRadius: 10,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    colors: [
      columnColors.series1,
      columnColors.series2,
      columnColors.series3,
      columnColors.series4,
    ],
    stroke: {
      show: true,
      colors: ["transparent"],
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      // categories: [
      //   "7/12",
      //   "8/12",
      //   "9/12",
      //   "10/12",
      //   "11/12",
      //   "12/12",
      //   "13/12",
      //   "14/12",
      //   "15/12",
      //   "16/12",
      // ],
      categories: value?.dates,
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  // ** Chart Series
  const series = [
    {
      name: "Created Vendors",
      // data: [90, 120, 55, 100, 80, 125, 175, 70, 88, 180],
      data: value?.created_vendor,
    },
    {
      name: "Pending Vendors",
      // data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20],
      data: value?.pending_vendor,
    },
    // {
    //   name: "Verfied Vendors",
    //   data: value?.verified_vendor,
    // },
    {
      name: "Approved Vendors",
      // data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20],
      data: value?.approved_vendor,
    },
  ];
  useEffect(() => {
    setLoading(true);
    axios
      .post(
        new URL("v1/admin/dashboard/count-time-bound", themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setLoading(false);
        } else {
          setValue(res.data);
          console.log(res.data);
          setLoading(false);
        }
      });
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <Card>
      <CardHeader
        style={{ fontSize: "20px", fontWeight: "600" }}
      >
        Vendors Data
      </CardHeader>
      {value ? (
        <CardBody>
          <Chart options={options} series={series} type="bar" height={400} />
        </CardBody>
      ) : (
        <Stack
          sx={{
            width: "100%",
            color: "#e06522",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          spacing={2}
        >
          {loading ? (
          
              <CircularProgress
                className="text-center mt-5 mb-5"
                size={80}
                color="inherit"
              />
          ) : (
            <>
              <AlertCircle size={50} />
              <h2 style={{ color: "#fff" }}>No Data Found</h2>
            </>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default ApexColumnCharts;

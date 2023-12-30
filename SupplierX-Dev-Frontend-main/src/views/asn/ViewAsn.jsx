import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import MuiTimeline from "@mui/lab/Timeline";
import MuiCardHeader from "@mui/material/CardHeader";
// import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import React, { useEffect, useState } from "react";
import themeConfig from "../../configs/themeConfig";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { Label } from "@mui/icons-material";
// import { Timeline } from "@mui/icons-material";

const ViewAsn = () => {
  const [data, setData] = useState({});
  const [totalAmount, setTotalAmount] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const { id } = useParams();

  console.log(data);

  const theme = useTheme();

  const CalcWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:not(:last-of-type)": {
      marginBottom: theme.spacing(2),
    },
  }));

  const Timeline = styled(MuiTimeline)({
    paddingLeft: 0,
    paddingRight: 0,
    "& .MuiTimelineItem-root": {
      width: "100%",
      "&:before": {
        display: "none",
      },
    },
  });

  const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
    "& .MuiTypography-root": {
      lineHeight: 1.6,
      fontWeight: 500,
      fontSize: "1.125rem",
      letterSpacing: "0.15px",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.25rem",
      },
    },
  }));

  console.log(id);
  useEffect(() => {
    axios
      .post(new URL(`v1/supplier/asn/view/` + id, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          console.log(res);
        }
        setData(res.data.data);
        setLineItems(res.data.data.lineItems);
        console.log(res.data);
        // const mappedPurchaseOrders = res.data.data.PurchaseOrders.map(
        //     (item) => ({
        //         label: item.id,
        //         value: item.id,
        //     })
        // );
        // setPurchaseOrder(mappedPurchaseOrders);
      });
  }, [id]);

  useEffect(() => {
    if (lineItems) {
      const total = lineItems.reduce(
        (acc, item) => acc + parseInt(item.subTotal), // Parse subTotal values to integers for addition
        0
      );
      setTotalAmount(total); // Update totalAmount state
    }
  }, [lineItems]);

  // const renderName = lineItems => {
  //   if (lineItems.avatar) {
  //     return <Avatar src={lineItems.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  //   } else {
  //     return (
  //       <Avatar
  //         skin='light'
  //         color={lineItems.avatarColor || 'primary'}
  //         sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
  //       >
  //         {lineItems.name || "Hemanshu Parmar"}
  //       </Avatar>
  //     )
  //   }
  // }

  return (
    <div>
      <Card className="p-2 mb-2">
        <div style={{ display: "inline", marginBottom: "0.6rem" }}>
          <label style={{ fontSize: "1.5rem", color: "black" }}>Asn no:</label>
          <span style={{ fontSize: "1.5rem", color: "blue" }}>
            {" "}
            {`#`}
            {data?.asnNo}
          </span>
        </div>
        <div>
          <label style={{ color: "black", marginBottom: "0.5rem" }}>
            Created At:
          </label>
          <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
            {" "}
            {data.createdAt?.slice(0, 10)}
          </span>
        </div>
        <div>
          <label style={{ color: "black", marginBottom: "0.5rem" }}>
            Delivery Date:{" "}
          </label>
          <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
            {" "}
            {data.deliveryDate?.slice(0, 10)}
          </span>
        </div>
        <div>
          <label style={{ color: "black", marginBottom: "0.5rem" }}>
            Supplier id:{" "}
          </label>
          <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
            {" "}
            {data.supplierId}
          </span>
        </div>
      </Card>

      <Grid container spacing={2}>
        <Grid item lg={8} xs={12}>
          <Card className="mb-2">
            <h4 className="p-1 fw-bold">Order Data</h4>
            <TableContainer>
              <Table>
                <TableHead
                  sx={{
                    letterSpacing: "0.02rem",
                    background: "#80808082",
                    fontWeight: "400",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontSize: "medium" }}>Item</TableCell>
                    <TableCell sx={{ fontSize: "medium" }}>Hsn Code</TableCell>
                    <TableCell sx={{ fontSize: "medium" }}>
                      Price Per Unit
                    </TableCell>
                    <TableCell sx={{ fontSize: "medium" }}>Qty</TableCell>
                    <TableCell sx={{ fontSize: "medium" }}>Sub Total</TableCell>
                  </TableRow>
                </TableHead>

                <>
                  <TableBody
                    sx={{
                      "& .MuiTableCell-root": {
                        py: "1rem !important",
                        fontSize: theme.typography.body1.fontSize,
                      },
                    }}
                  >
                    {lineItems?.map((items) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell>{items.itemName}</TableCell>
                            <TableCell>{items.hsnCode}</TableCell>
                            <TableCell>{items.pricePerUnit}</TableCell>
                            <TableCell>{items.Quantity}</TableCell>
                            <TableCell>{items.subTotal}</TableCell>
                          </TableRow>
                          <hr />
                        </>
                      );
                    })}
                  </TableBody>
                </>
              </Table>
            </TableContainer>

            <CardContent
              sx={{
                px: [
                  `${theme.spacing(8)} !important`,
                  `${theme.spacing(14)} !important`,
                ],
              }}
            >
              <Grid container className="d-flex justify-content-end">
                <Grid
                  item
                  xs={12}
                  sm={5}
                  lg={3}
                  sx={{
                    mb: { sm: 0, xs: 4 },
                    order: { sm: 2, xs: 1 },
                  }}
                >
                  {/* <CalcWrapper>
                                        <Typography
                                            sx={{ color: "text.secondary" }}
                                        >
                                            Subtotal:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: "text.secondary",
                                            }}
                                        >
                                            $1800
                                        </Typography>
                                    </CalcWrapper> */}
                  {/* <CalcWrapper>
                                        <Typography
                                            sx={{ color: "text.secondary" }}
                                        >
                                            Discount:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: "text.secondary",
                                            }}
                                        >
                                            $28
                                        </Typography>
                                    </CalcWrapper> */}
                  {/* <CalcWrapper sx={{ mb: "0 !important" }}>
                                        <Typography
                                            sx={{ color: "text.secondary" }}
                                        >
                                            Tax:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: "text.secondary",
                                            }}
                                        >
                                            21%
                                        </Typography>
                                    </CalcWrapper> */}
                  <Divider
                    sx={{
                      my: `${theme.spacing(2)} !important`,
                    }}
                  />
                  <CalcWrapper>
                    <Typography sx={{ fontWeight: 600 }}>Total:</Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        // color: "text.secondary",
                      }}
                    >
                      {totalAmount}
                    </Typography>
                  </CalcWrapper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 3 },
                  }}
                >
                  <Icon fontSize="1.25rem" icon="tabler:list-details" />
                  <Typography>Order Timeline</Typography>
                </Box>
              }
              // action={
              //   <OptionsMenu
              //     options={['Share timeline', 'Suggest edits', 'Report bug']}
              //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
              //   />
              // }
            />
            <CardContent>
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="warning" sx={{ mt: 1.5 }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      pt: 0,
                      mt: 0,
                      mb: (theme) => `${theme.spacing(2)} !important`,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 0.5,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        Client Meeting
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        Today
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2.5 }}>
                      Project meeting with john @10:15am
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <Avatar src='/images/avatars/3.png' sx={{ mr: 3, width: 38, height: 38 }} /> */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          Lester McCarthy (Client)
                        </Typography>
                        <Typography variant="caption">
                          CEO of Infibeam
                        </Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      mt: 0,
                      mb: (theme) => `${theme.spacing(2)} !important`,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 0.5,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        Create a new project for client
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        2 days ago
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Add files to new design folder
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="info" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      mt: 0,
                      mb: (theme) => `${theme.spacing(2)} !important`,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 0.5,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        Shared 2 New Project Files
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        6 days ago
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2.5 }}>
                      Sent by Mollie Dixon
                    </Typography>
                    <Box
                      sx={{
                        rowGap: 1,
                        columnGap: 3,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "& svg": {
                            mr: 2,
                            color: "warning.main",
                          },
                        }}
                      >
                        <Icon fontSize="1.25rem" icon="tabler:file-text" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          App Guidelines
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "& svg": {
                            mr: 2,
                            color: "success.main",
                          },
                        }}
                      >
                        <Icon fontSize="1.25rem" icon="tabler:table" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          Testing Results
                        </Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="secondary" />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, pb: 0 }}>
                    <Box
                      sx={{
                        mb: 0.5,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        Project status updated
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        10 days ago
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      WooCommerce iOS App Completed
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={4} xs={12}>
          <Card className="p-2 mb-2">
            {/* <Grid className="p-0 mt-xl-0 mt-2" md="6" xl="4"> */}
            <h6 className="mb-2" style={{ fontSize: "16px" }}>
              Ship to Address
            </h6>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span
                      style={{
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {data?.shipToAddress ||
                        "278, Jeevan Udyog BuildingMaharastraMumbai400001"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
          <Card className="p-2">
            <h6 className="mb-1" style={{ fontSize: "16px" }}>
              Bill to Address
            </h6>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span
                      style={{
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {data?.shipToAddress ||
                        "278, Jeevan Udyog BuildingMaharastraMumbai400001"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
          {/* <h6 className="mt-1"></h6>
              <Input value={""} className="mb-0  w-50">
                Generate E-Way
              </Input> */}
          {/* </Grid> */}
        </Grid>
      </Grid>
      <Grid></Grid>
    </div>
  );
};

export default ViewAsn;

import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Icon,
    LinearProgress,
    Stack,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    Typography,
    createTheme,
    styled,
} from "@mui/material";
import "../../assets/scss/variables/_variables.scss"
import React, { Fragment, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadCloud, FileText, X } from "react-feather";
import {
    CardBody,
    ListGroup,
    ListGroupItem,
    Row,
    Button,
    Table,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
// import { useDotenv } from 'react-dotenv';
import { QrReader } from "react-qr-reader";
import { Buffer } from "buffer";

import CryptoJs from "crypto-js";
import invoiceimg from "../../assets/images/invoice2.png";
import toast from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import axios from "axios";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import {process} from '.env';
const ScanQr = () => {
    const [value, setValue] = useState("1");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState();
    // const [data, setData] = useState();
    const [asnData, setAsnData] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [result, setResult] = useState({});
    const [open, setOpen] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: (acceptedFiles) => {
            setFiles([
                ...files,
                ...acceptedFiles.map((file) => Object.assign(file)),
            ]);
        },
    });

    const CalcWrapper = styled(Box)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:not(:last-of-type)": {
            marginBottom: theme.spacing(2),
        },
    }));

    const theme = createTheme({
        components: {
          MuiTabs: {
            styleOverrides: {
              indicator: {
                backgroundColor: '#f26c13',
                height: 3,
              },
            },
          },
        },
      });


    // const { REACT_APP_SECRET_KEY } = useDotenv();

    // const secretKey = import.meta.env.REACT_APP_SECRET_KEY;

    // console.log(secretKey);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleScan = (data) => {
        if (data) {
            const text = data.text.toString();
            console.log(text);
            try {
                axios
                    .post(
                        //     themeConfig.backendUrl + "v1/configuration/asn/checkqr",
                        "http://10.201.1.173:3005/api/v1/configuration/asn/checkqr",
                        { text }
                    )
                    .then((res) => {
                        if (res.data.error) {
                            // setLoading(false);
                            toast.error(res.data.message);
                            console.log(res);
                        } else {
                            setAsnData(res.data.data)
                            console.log(res.data);
                            // setFiles([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
                // // Decrypt the data (assuming it's encrypted with a key)
                // const secret = "thisisasecretforqrcodeforasn";
                //  let decryptedData = CryptoJs.AES.decrypt(data.text,secret).toString(CryptoJs.enc.Utf8)
                //  const buffer = Buffer.from(decryptedData, 'hex');
                //  const regularString = JSON.parse(buffer.toString('utf-8'));

                // const hexString = "48656c6c6f2c20576f726c64"; // Replace this with your hex string
                // const wordArray = CryptoJs.enc.Hex.parse(decryptedData);
                // const regularString = CryptoJs.enc.Utf8.stringify(wordArray);

                // // Step 2: Convert String to JSON
                // try {
                //     const jsonData = JSON.parse(regularString);
                //     console.log("Converted JSON:", jsonData);
                // } catch (error) {
                //     console.error("Error parsing JSON:", error);
                // }

                // console.log("decrypted :", decryptedData);
                setResult(data);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    const renderFilePreview = (file) => {
        if (file.type.startsWith("image")) {
            return (
                <img
                    className="rounded"
                    alt={file.name}
                    src={URL.createObjectURL(file)}
                    height="28"
                    width="28"
                />
            );
        } else {
            return <FileText size="28" />;
        }
    };

    const handleRemoveFile = (file) => {
        const uploadedFiles = files;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setFiles([...filtered]);
    };

    const handleTotal = () => {
        if (asnData.lineItems) {
            const total = asnData.lineItems.reduce(
                (acc, item) => acc + parseInt(item.subTotal), // Parse subTotal values to integers for addition
                0
            );
            setTotalAmount(total); // Update totalAmount state
        }
    }

    const renderFileSize = (size) => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
        }
    };

    const handleQrReader = () => {
        setOpen(!open);
    };

    const fileList = files.map((file, index) => (
        <ListGroupItem
            key={`${file.name}-${index}`}
            className="d-flex align-items-center justify-content-between"
        >
            <div className="file-details d-flex align-items-center">
                <div className="file-preview me-1">
                    {renderFilePreview(file)}
                </div>
                <div>
                    <p className="file-name mb-0">{file.name}</p>
                    <p className="file-size mb-0">
                        {renderFileSize(file.size)}
                    </p>
                </div>
            </div>
            <Button
                color="danger"
                outline
                size="sm"
                className="btn-icon"
                onClick={() => handleRemoveFile(file)}
            >
                <X size={14} />
            </Button>
        </ListGroupItem>
    ));

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    const uploadFile = () => {
        setLoading(true);
        const formData = new FormData();
        // formData.append("supplierId", userData.supplierId);
        formData.append("qrcode", files[0]);
        axios
            .post(
                //     themeConfig.backendUrl + "v1/configuration/asn/checkqr",
                "http://10.201.1.173:3005/api/v1/configuration/asn/checkqr",
                formData
            )
            .then((res) => {
                if (res.data.error) {
                    setLoading(false);
                    toast.error(res.data.message);
                    console.log(res);
                } else {
                    setLoading(false);
                    handleTotal();
                    setAsnData(res.data.data);
                    console.log(res.data.data);
                    setFiles([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return (
        <div>
            {/* <Nav
  fill
  pills
>
  <NavItem>
    <NavLink
      active
      href="/supplier/scanqr"
    >
      Link
    </NavLink>
  </NavItem>
  <NavItem>
    <NavLink href="navbar">
      Much Longer Nav Link
    </NavLink>
  </NavItem>
</Nav> */}
            <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                    <ThemeProvider theme={theme}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList onChange={handleChange} >
                            <Tab style={{fontSize:"1.2rem", color:"#f26c13" }} label="Upload QrCode" value="1" />
                            <Tab style={{fontSize:"1.2rem", color:"#f26c13"}} label="Scan QrCode" value="2" />
                        </TabList>
                    </Box>
                    </ThemeProvider>
                    
                    <TabPanel value="1">
                        <Grid container spacing={2}>
                            <Grid item lg={6}>
                                <Card>
                                    {/* <CardHeader> */}
                                    <h4 className="p-2">Upload QrCode</h4>
                                    {/* </CardHeader> */}
                                    <CardBody>
                                        <div
                                            {...getRootProps({
                                                className: "dropzone",
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="d-flex align-items-center justify-content-center flex-column">
                                                <DownloadCloud size={64} />
                                                <h5>
                                                    Drop QrCode here or click to
                                                    upload
                                                </h5>
                                                <p className="text-secondary">
                                                    <a
                                                        href="/"
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Select Your QrCode
                                                    </a>{" "}
                                                </p>
                                            </div>
                                        </div>
                                        <Row></Row>
                                        {loading ? (
                                            <Stack
                                                sx={{
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    color: "#e06522",
                                                }}
                                                spacing={2}
                                            >
                                                <LinearProgress color="inherit" />
                                                Reading invoice .....
                                            </Stack>
                                        ) : (
                                            ""
                                        )}
                                    </CardBody>
                                </Card>
                            </Grid>

                            {/* <Col md={6}> */}
                            <Grid item lg={6}>
                                {/* <Card md={12} className="d-flex flex-column justify-content-end"> */}
                                {files.length ? (
                                    <>
                                        <ListGroup className="my-2">
                                            {fileList[0]}
                                        </ListGroup>
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                className="me-1"
                                                color="danger"
                                                outline
                                                onClick={handleRemoveAllFiles}
                                            >
                                                Remove
                                            </Button>
                                            <Button
                                                onClick={uploadFile}
                                                color="primary"
                                            >
                                                Extract All Details{" "}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={invoiceimg}
                                        className="img-fluid"
                                        width={200}
                                        alt=""
                                    />
                                )}
                            </Grid>
                        </Grid>

                        {asnData?
                        (
                            <div>
          <Card className="p-2 mb-2">
          <div style={{display:'inline', marginBottom:"0.6rem"}}>
          <label style={{fontSize:"1.5rem", color:"black"}}>Asn no:</label>
            <span style={{ fontSize: "1.5rem", color: "blue" }}>
              {" "}
                {`#`}
                {asnData.asnNo}
            </span>
          </div>
          <div>
          <label style={{color:"black", marginBottom:"0.5rem"}}>Created At:</label>
            <span
                style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}
            >
                {" "}{asnData.createdAt?.slice(0, 10)}
            </span>
          </div>
          <div>
          <label style={{color:"black", marginBottom:"0.5rem"}}>Delivery Date:{" "} </label>
            <span
                style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}
            >
                {" "}{asnData.deliveryDate?.slice(0, 10)}
            </span>
            </div> 
            <div>
            <label style={{color:"black", marginBottom:"0.5rem"}}>Supplier id:{" "} </label>
            <span
                style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}
            >
                {" "}{asnData.supplierId}
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
                                        background: "#fdc28d",
                                        fontWeight: "400",
                                    }}
                                >
                                    <TableRow>
                                        <TableCell sx={{ fontSize: "medium" }}>
                                            ITEM
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "medium" }}>
                                            HSN CODE
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "medium" }}>
                                            PRICE/UNIT
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "medium" }}>
                                            QTY
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "medium" }}>
                                            SUB TOTAL
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <>
                                    <TableBody
                                        sx={{
                                            "& .MuiTableCell-root": {
                                                py: "1rem !important",
                                                fontSize:
                                                    theme.typography.body1
                                                        .fontSize,
                                            },
                                        }}
                                    >
                                        {asnData.lineItems?.map((items) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell>
                                                            {items.itemName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {items.hsnCode}
                                                        </TableCell>
                                                        <TableCell>
                                                            {items.pricePerUnit}
                                                        </TableCell>
                                                        <TableCell>
                                                            {items.Quantity}
                                                        </TableCell>
                                                        <TableCell>
                                                            {items.subTotal}
                                                        </TableCell>
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
                            <Grid
                                container
                                className="d-flex justify-content-end"
                            >
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
                                            my: `${theme.spacing(
                                                2
                                            )} !important`,
                                        }}
                                    />
                                    <CalcWrapper>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Total:
                                        </Typography>
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
                                    <Icon
                                        fontSize="1.25rem"
                                        icon="tabler:list-details"
                                    />
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
                                        <TimelineDot
                                            color="warning"
                                            sx={{ mt: 1.5 }}
                                        />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent
                                        sx={{
                                            pt: 0,
                                            mt: 0,
                                            mb: (theme) =>
                                                `${theme.spacing(
                                                    2
                                                )} !important`,
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
                                            <Typography
                                                variant="h6"
                                                sx={{ mr: 2 }}
                                            >
                                                Client Meeting
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "text.disabled" }}
                                            >
                                                Today
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 2.5 }}
                                        >
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
                                            mb: (theme) =>
                                                `${theme.spacing(
                                                    2
                                                )} !important`,
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
                                            <Typography
                                                variant="h6"
                                                sx={{ mr: 2 }}
                                            >
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
                                            mb: (theme) =>
                                                `${theme.spacing(
                                                    2
                                                )} !important`,
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
                                            <Typography
                                                variant="h6"
                                                sx={{ mr: 2 }}
                                            >
                                                Shared 2 New Project Files
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "text.disabled" }}
                                            >
                                                6 days ago
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 2.5 }}
                                        >
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
                                                <Icon
                                                    fontSize="1.25rem"
                                                    icon="tabler:file-text"
                                                />
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
                                                <Icon
                                                    fontSize="1.25rem"
                                                    icon="tabler:table"
                                                />
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
                                            <Typography
                                                variant="h6"
                                                sx={{ mr: 2 }}
                                            >
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
                                            {asnData?.shipToAddress ||
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
                                            {asnData?.shipToAddress ||
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
                        ):(" ")}
                    </TabPanel>
                    <TabPanel value="2">
                        <Grid container>
                            <Grid item lg={4}>
                                <div>
                                    <Button onClick={handleQrReader}>
                                        {open
                                            ? "Close Qr Reader"
                                            : "Open Qr Reader"}
                                    </Button>
                                    {open ? (
                                        <>
                                            <QrReader
                                                delay={300}
                                                onError={handleError}
                                                onResult={handleScan}
                                                style={{ width: "1rem" }}
                                            />
                                            <p>{result.text}</p>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Box>

            {/* return ( */}

            {/* ); */}
        </div>
    );
};

export default ScanQr;

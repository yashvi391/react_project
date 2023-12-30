/* eslint-disable react/react-in-jsx-scope */
// ** React Imports
import { useContext, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import themeConfig from "../../../configs/themeConfig";
import Lottie from "react-lottie";
import animation from "../../../lottie/login.json";
// import animation from "../../../lottie/supply-chain.json";
import Stack from "@mui/material/Stack";
import { useState } from "react";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { getUserData } from "../../../utility/Utils";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Coffee, Truck, X } from "react-feather";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import Avatar from "@components/avatar";
import InputPasswordToggle from "@components/input-password-toggle";
import { LinearProgress } from "@mui/material";
// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { ErrorOutline, LoginOutlined } from "@mui/icons-material";
import "../../pages/authentication/login.scss";
const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>
          You have successfully logged in as an {role} user to Vuexy. Now you
          can start to explore. Enjoy!
        </span>
      </div>
    </div>
  );
};

const Login = () => {
  const user = getUserData();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [defaultValues, setDefaultValues] = useState({
    loginEmail: null,
    password: null,
  });
  const [EMAIL, setEMAIL] = useState();
  const [PWD, setPWD] = useState();

  if (user && user.role_name == "Admin") {
    return <Navigate to="/admin/dashboard" replace={true} />;
  }
  if (user && user.role_name == "Supplier") {
    return <Navigate to="/supplier/details" replace={true} />;
  }
  if (
    (user && user.role_name == "Approver") ||
    (user && user.role_name == "Verifier")
  ) {
    return <Navigate to="/dashboard" replace={true} />;
  }
  // ** Hooks
  useEffect(() => {}, [defaultValues]);
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const ability = useContext(AbilityContext);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const directLogin = (data) => {
    setDefaultValues({
      password: data.pass,
      loginEmail: data.email,
    });
  };

  const onSubmit = () => {
    if (defaultValues.loginEmail !== null && defaultValues.password !== null) {
      login(defaultValues);
    } else {
      const cred = {
        loginEmail: EMAIL ? EMAIL : null,
        password: PWD ? PWD : null,
      };
      if (cred.loginEmail == null && cred.password == null) {
        // toast.error("Enter Credentials");
        setMessage("Enter Credentials");
        setLoading(false);
      } else {
        login(cred);
      }
    }
  };
  const login = (data) => {
    setLoading(true);
    useJwt
      .login({ email: data.loginEmail, password: data.password })
      .then((res) => {
        // const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
        // dispatch(handleLogin(data))
        // ability.update(res.data.userData.ability)
        // navigate(getHomeRouteForLoggedInUser(data.role))
        // toast(t => (
        //   <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'John Doe'} />
        // ))
        setLoading(true);
        if (res.data.error) {
          // toast.error(res.data.message);
          setMessage(res.data.message);
          setLoading(false);
        } else {
          setLoading(false);
          const user = res.data.data.userData;
          const userdata = {
            id: user.id,
            role: user.role,
            role_name: user.role_name,
            approver_hr_level: user.approver_hr_level,
            approver_level: user.level,
            approver_level_name: user.approver_level_name,
            username: user.username,
            subscriber_id: user.subscriber_id,
            hierarchy_level: user.hierarchy_level,
          };
          localStorage.setItem(userdata, JSON.stringify(userdata));
          const supplierId = user.supplierId;
          localStorage.setItem("supplierId", supplierId);
          res.data.data.userData.ability = [
            {
              action: "manage",
              subject: "all",
            },
          ];
          const data = {
            ...res.data.data.userData,
            accessToken: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
          };
          data.username = `${data.firstname} ${data.lastname}`;
          dispatch(handleLogin(data));
          ability.update(res.data.data.userData.ability);
          let hasSupplierData =
            res.data.data.userData.hasOwnProperty("supplierDetails");
          let supplierDetails = hasSupplierData
            ? res.data.data.userData.supplierDetails
            : null;
          localStorage.setItem(
            "supplierDetails",
            JSON.stringify(supplierDetails)
          );
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.err(err.data.message);
      });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    // rendererSettings: {
    //   preserveAspectRatio: "xMidYMid slice",
    // },
  };

  return (
    <div className="">
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle3"></div>
      {/* <div className="circle4"></div>
      <div className="circle5"></div> */}
      <Link className="" to="/" onClick={(e) => e.preventDefault()}>
        {/* Logo HERE  */}
        <img
          src={themeConfig.app.appLogoImage}
          className="m-3 logo-img"
          height="50"
        />
        {/* <img src={aeonxLogo} height="40" /> */}
        {/* <h2 className="brand-text text-primary ms-1">
          Supplierx Panel
        </h2> */}
      </Link>
      <Row className="auth-inner">
        <Col className="d-none d-lg-flex align-items-center p-5" lg="7" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            {/* <img className="img-fluid" src={source} alt="Login Cover" /> */}
            <Lottie options={defaultOptions} height={"auto"} width={"75%"} />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center px-2 p-lg-5 backgroudShape"
          lg="5"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div className="d-flex justify-content-center m-2">
              <img
                className="small-logo"
                src={themeConfig.app.appLogoImage}
                // src="https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
                height="50"
              />
            </div>
            <div className="login">Welcome To SupplierX</div>
            <CardText className="mb-2 font text-center">
              Login to the SupplierX Portal for all your supplier needs.
            </CardText>
            <Form
              // style={{ marginLeft: "50%" }}
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1 px-3">
                <Label className="form-label font" for="login-email">
                  Email
                </Label>
                <Input
                  autoFocus
                  type="email"
                  value={defaultValues.loginEmail}
                  placeholder="john@example.com"
                  invalid={errors.loginEmail && true}
                  onChange={(e) => setEMAIL(e.target.value)}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1 px-3">
                <div className="d-flex justify-content-between">
                  <Label className="form-label font" for="login-password">
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  value={defaultValues.password}
                  invalid={errors.password && true}
                  onChange={(e) => setPWD(e.target.value)}
                />
                <div className="form-check mb-1 mt-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="font" for="remember-me">
                    Remember Me
                  </Label>
                </div>
              </div>

              {message ? (
                <h6 className="text-center" style={{ color: "red" }}>
                  <ErrorOutline />
                  {message}
                </h6>
              ) : (
                ""
              )}
              <div className="px-3">
                <Button
                  type="submit"
                  className="mb-1 btn-2"
                  color="primary"
                  block
                >
                  <LoginOutlined
                    style={{
                      color: "white",
                      marginRight: "15px",
                    }}
                    size={20}
                    className="pr-3"
                  />
                  Sign in
                </Button>
              </div>

              {loading ? (
                <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
                  <LinearProgress color="inherit" />
                </Stack>
              ) : (
                ""
              )}
            </Form>
            <p className="or white px-3">Or</p>
            <div className="mb-1 px-3">
              <Button
                tag={Link}
                to="/supplier/register"
                className="mb-1 mt-1 btn-2"
                color="primary"
                block
              >
                <Truck
                  style={{
                    color: "white",
                    marginRight: "15px",
                  }}
                  size={20}
                  className="pr-3"
                />
                Register as a Supplier
              </Button>
            </div>
            {/* <p>For Testing</p>   */}
            <Row className="px-3 py-1">
              <Col md={6}>
                <Button
                  onClick={() => {
                    const data = {
                      email: "admin@gmail.com",
                      pass: "12345678",
                    };
                    directLogin(data);
                  }}
                  type="submit"
                  className="mb-1"
                  color="success"
                  size="sm"
                  block
                  outline
                >
                  Login as Admin
                </Button>
              </Col>
              <Col md={6}>
                {" "}
                <Button
                  onClick={() => {
                    const data = {
                      email: "verifier@gmail.com",
                      pass: "12345678",
                    };
                    directLogin(data);
                  }}
                  type="submit"
                  className="mb-1"
                  color="primary"
                  size="sm"
                  block
                  outline
                >
                  Login as Approver
                </Button>
              </Col>
            </Row>

            <Row className="px-3">
              <Col md={6}>
                <Button
                  onClick={() => {
                    const data = {
                      email: "sebastian.vannier@aeonx.digital",
                      pass: "12345678",
                    };
                    directLogin(data);
                  }}
                  type="submit"
                  className="mb-1"
                  color="info"
                  outline
                  size="sm"
                  block
                >
                  Login as Supplier
                </Button>
              </Col>

              {/* <Col md={6}>
                {" "}
                <Button
                  onClick={() => {
                    const data = {
                      email: "approver@gmail.com",
                      pass: "12345678",
                    };
                    directLogin(data);
                  }}
                  type="submit"
                  className="mb-1"
                  color="primary"
                  size="sm"
                  block
                  outline
                >
                  Login as Approver
                </Button>
              </Col> */}
            </Row>
          </Col>
        </Col>
        <p className="mb-1 d-flex justify-content-center mt-1">
          © {new Date().getFullYear()} Designed By
          <a
            href="https://www.aeonx.digital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.aeonx.digital
          </a>
        </p>
      </Row>
    </div>
  );
};

export default Login;

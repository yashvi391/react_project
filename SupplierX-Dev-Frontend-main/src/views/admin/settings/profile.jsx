import React, { useState, useEffect } from "react";
// import { Grid } from "react-feather";
// import { Card, CardBody, Row } from "reactstrap";
import { Grid } from "@mui/material";
import toast from "react-hot-toast";
import {
  Button,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Row,
  Col,
  ModalFooter,
} from "reactstrap";
// import profileImg from "@src/assets/images/portrait/small/avatar-s-9.jpg";
import profileImg from "../../../assets/images/logo/logo.png";

// import { styled } from "@mui/material/styles";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { Edit, Key } from "react-feather";
// import { useDispatch } from "react-redux";

const profile = () => {
  //     const dispatch = useDispatch();
  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);
  const { id } = user;
  const userId = id;
  // console.log(user.firstname)
  const [editModal, setEditModal] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [userData, setUserData] = useState({});
  const request = () => {
    axios
      .post(new URL(`/api/admin/users/view/${userId}`, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        console.log(res.data);
        setUserData(res.data.data[0]);
      });
  };
  useEffect(() => {
    request();
  }, []);
  //     const VisuallyHiddenInput = styled("input")({
  //         clip: "rect(0 0 0 0)",
  //         clipPath: "inset(50%)",
  //         height: 1,
  //         overflow: "hidden",
  //         position: "absolute",
  //         bottom: 0,
  //         left: 0,
  //         whiteSpace: "nowrap",
  //         width: 1,
  //     });
  const EditModal = () => {
    const [form, setForm] = useState({
      id: userId,
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      status: userData.status,
    });

    const [cred, setCred] = useState({
      id: userId,
      email: userData.email,
      password: "",
      confirmPassword: "",
    });
    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(
          new URL("/api/admin/users/update_profile", themeConfig.backendUrl),
          {
            ...form,
            role: userData.role,
          }
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            request();
            window.location.reload();
            localStorage.setItem("username", form.username);
          }
          setEditModal(false);
        });
    };
    const ChangePassword = (e) => {
      e.preventDefault();

      if (cred.password !== cred.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const params = {
        id: cred.id,
        email: cred.email,
        password: cred.password,
      };
      axios
        .post(
          new URL("/api/admin/users/change_password", themeConfig.backendUrl),
          params
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            request();
          }
          setPwdModal(false);
        });
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <Row>
                <Col lg="6" className="mt-1" md="6">
                  {" "}
                  <div className="form-group">
                    <label>Username</label>
                    {/* {console.log(userData)} */}
                    <input
                      type="text"
                      name="username"
                      defaultValue={userData.username}
                      value={form.username}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          username: e.target.value,
                        });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      disabled
                      defaultValue={userData.email}
                      value={form.email}
                      // onChange={(e) => {
                      //   setForm({ ...form, name: e.target.value });
                      // }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Firstname</label>
                    <input
                      type="text"
                      name="firstname"
                      defaultValue={userData.firstname}
                      value={form.firstname}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          firstname: e.target.value,
                        });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Lastname</label>
                    <input
                      type="text"
                      name="lastname"
                      defaultValue={userData.lastname}
                      value={form.lastname}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          lastname: e.target.value,
                        });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Role Name</label>
                    <input
                      type="text"
                      name="roleName"
                      value={userData.role_name}
                      // onChange={(e) => {
                      //   setForm({ ...form, name: e.target.value });
                      // }}
                      disabled
                      className="form-control"
                      placeholder="---"
                    />
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Modal
          isOpen={pwdModal}
          toggle={() => setPwdModal(!pwdModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setPwdModal(!pwdModal)}>Edit</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    disabled
                    defaultValue={userData.email}
                    value={cred.email}
                    onChange={(e) => {
                      setCred({
                        ...cred,
                        email: e.target.value,
                      });
                    }}
                    className="form-control"
                    placeholder="---"
                    required
                  />
                </div>
              </Col>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={cred.password}
                    onChange={(e) => {
                      setCred({
                        ...cred,
                        password: e.target.value,
                      });
                    }}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
              </Col>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={cred.confirmPassword}
                    onChange={(e) => {
                      setCred({
                        ...cred,
                        confirmPassword: e.target.value,
                      });
                    }}
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ChangePassword}>
              Update Password
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <EditModal />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={4}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-center">
                <h4>Profile</h4>
              </div>
              <hr />
              <div className="d-flex flex-column w-100 align-items-center">
                <div className="p-1">
                  <img
                    className="rounded-circle"
                    src={profileImg}
                    alt="profile-img"
                    style={{ width: "10rem" }}
                  />
                </div>
                <h3 className="pb-1">
                  {userData
                    ? `${userData.firstname} ${userData.lastname}`
                    : "--"}
                </h3>
                <h5 className="pb-1">{userData ? userData.role_name : "--"}</h5>
                {/* <Button
                                    color="primary"
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload
                                    <VisuallyHiddenInput type="file" />
                                </Button> */}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-center">
                <h4>Details</h4>
              </div>

              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">First Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userData ? userData.firstname : "--"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Last Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userData ? userData.lastname : "--"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">User Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userData ? userData.username : "--"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userData ? userData.email : "--"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Role Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userData ? userData.role_name : "--"}
                </div>
              </div>
              <hr />
            </div>
            <div className="d-flex p-2 gap-2">
              <Button
                color="primary"
                onClick={() => {
                  setEditModal(true);
                }}
              >
                <Edit size={14} className="me-75" />
                Edit
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  setPwdModal(true);
                }}
              >
                <Key size={14} className="me-75" />
                Change Password
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default profile;

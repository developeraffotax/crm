import React, { useState } from "react";

import logo from "../../../Assets/Images/logo.png";

import secureLocalStorage from "react-secure-storage";
import { Store } from "react-notifications-component";

import axios from "../../../Api/Axios";
import * as axiosURL from "../../../Api/AxiosUrls";

var Login_Url = axiosURL.Login;

export default function Login() {
  const [credentials, setCredentials] = useState({
    uname: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCredsChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        Login_Url,
        {
          email: credentials.uname,
          password: credentials.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const accessToken = response.data.Token;
        secureLocalStorage.setItem("token", accessToken);
        Store.addNotification({
          title: "Success",
          message: "Login Successfull",
          type: "success",
          // type: "danger",
          // type: "info",
          // type: "default",
          // type: "warning",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        setLoading(false);

        setCredentials({
          uname: "",
          password: "",
        });
        window.location.href = "/";
      }
    } catch (err) {
      setLoading(false);
      if (!err.response) {
        Store.addNotification({
          title: "Success",
          message: "Login Successfull",
          type: "success",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else if (err.response.status === 400) {
        Store.addNotification({
          title: "Warning",
          message: "Username or Password is missing",

          type: "warning",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      } else if (err.response.status === 401) {
        Store.addNotification({
          title: "Failed",
          message: "User Not Found",
          type: "danger",

          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    }
  };

  return (
    <>
      <div className="login_main_screen">
        <div className="card login_center_signin_card">
          <div className="login_txt">
            <img src={logo} alt="" />
            {/* <p>
                Sign in
              </p> */}
          </div>
        </div>
        <div className="card card login_center_form_card">
          <form onSubmit={loginHandler} className="login_form_div">
            <div className="my-3">
              <input
                className="form-control"
                type="email"
                name="uname"
                placeholder="Email"
                onChange={handleCredsChange}
                value={credentials.uname}
              />
            </div>

            <div className="my-3">
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleCredsChange}
                value={credentials.password}
              />
            </div>

            {/* <input
              style={{
                height: "46px",
                backgroundColor: "#f16022",
                border: "none",
              }}
              className="form-control btn btn-primary"
              type="submit"
              value="Sign in"
            /> */}
            <button
              type="submit"
              className="form-control btn btn-primary"
              style={{
                height: "46px",
                backgroundColor: "#f16022",
                border: "none",
              }}
            >
              {loading ? "Login..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

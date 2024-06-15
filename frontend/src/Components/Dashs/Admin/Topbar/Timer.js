import React, { useState, useEffect } from "react";
import { Store } from "react-notifications-component";
import secureLocalStorage from "react-secure-storage";

import axios from "../../../../Api/Axios";
import * as axiosURL from "../../../../Api/AxiosUrls";
import loaderImg from "../../../../Assets/svgs/loader.svg";

import Select from "react-select";

import "./Timer.css";

var timerStateUrl = axiosURL.timerStateUrl;
var timerStartStopUrl = axiosURL.timerStartStopUrl;

function Timer(props) {
  const { setUser } = props;
  const token = secureLocalStorage.getItem("token");

  const [loader, setLoader] = useState(false);
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  const [timerState, setTimerState] = useState();

  const [clients, setClients] = useState();
  const [departments, setDepartments] = useState();
  const [filteredDepartments, setFilteredDepartments] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const [data, setData] = useState({
    clientName: "",
    departmentName: "",
    notes: secureLocalStorage.getItem("timerNote"),
  });

  const hadleTimeSetValues = () => {
    const startTime = new Date(timerState.startTime);
    const curTime = new Date();

    // Calculate the difference in milliseconds
    const differenceInMs = Math.abs(curTime - startTime);
    // difference in Seconds
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    setTime(differenceInSeconds);

    setData((prevState) => ({
      ...prevState,
      clientName: timerState.client,
      departmentName: timerState.department,
    }));
    setTimerOn(true);
  };

  const getData = async () => {
    setLoader(true);
    const state = await axios.get(timerStateUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    setTimerState(state.data);
    setUser(state.data.user);
    setClients(
      state?.data?.clients?.map((names) => {
        return { value: names?._id, label: names?.company_name };
      })
    );
    // setDepartments(state.data.jobs)
    setDepartments(
      state?.data?.jobs?.map((names) => {
        return {
          value: names._id,
          label: names.job_name,
          client_id: names.client_id,
        };
      })
    );
    setLoader(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (timerState) {
      if (timerState.message === "running") {
        hadleTimeSetValues();
      }
    }
  }, [timerState]);

  useEffect(() => {
    let interval;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  const handleNoteChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (timerOn) {
      secureLocalStorage.setItem("timerNote", value);
    }
  };

  const handleChange = (name, option) => {
    setData((prevState) => ({
      ...prevState,
      [name]: option,
    }));
    setErrorMessage(null);

    if (name === "clientName") {
      var filteredArray = departments;
      filteredArray = filteredArray.filter(
        (obj) => obj.client_id && option.value === obj.client_id
      );
      setFilteredDepartments(filteredArray);
    }
  };

  useEffect(() => {
    //
  }, [data]);

  const handleStart = async (e) => {
    e.preventDefault();
    const curTime = new Date();
    if (!timerOn) {
      //Off to on
      if (!data.clientName || !data.departmentName) {
        setErrorMessage("Please select an option");
        return;
      }
      const formData = {
        message: timerState.message,
        startTime: curTime,
        notes: data.notes,
        client_id: data.clientName.value,
        job_id: data.departmentName.value,
      };

      try {
        setLoader(true);
        const response = await axios.post(
          timerStartStopUrl,
          {
            data: formData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.status === 200) {
          setTimerOn(true);
          secureLocalStorage.setItem("timerNote", data.notes);
        }
        setLoader(false);
      } catch (err) {
        Store.addNotification({
          title: "Failed",
          message: "Could Not Start Timer, Please Try Again",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        setLoader(false);
      }
    } else if (timerOn) {
      //on to off

      const formData = {
        _id: timerState.time_id,
        message: timerState.message,
        endTime: curTime,
        notes: data.notes,
      };

      try {
        setLoader(true);
        const response = await axios.post(
          timerStartStopUrl,
          {
            data: formData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 200) {
          setTimerOn(false);
          setData((prevState) => ({
            ...prevState,
            notes: "",
          }));
          setTime(0);
          secureLocalStorage.removeItem("timerNote");
        }
        setLoader(false);
      } catch (err) {
        Store.addNotification({
          title: "Failed",
          message: "Could Not Stop Timer, Please Try Again",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        setLoader(false);
      }
    }
    getData();
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (timerOn) {
    document.title = formatTime(time) + " | " + data.notes;
  } else {
    document.title = "Affotax";
  }

  return (
    <>
      <div
        style={{ alignItems: "center", justifyContent: "center" }}
        className="d-flex"
      >
        <form style={{ width: "100%" }} onSubmit={handleStart}>
          <div className="row">
            <div className="col-9">
              <div
                style={{ alignItems: "center", justifyContent: "center" }}
                className="d-flex"
              >
                <Select
                  isRequired={true}
                  className="sel_width"
                  // classNamePrefix="select"
                  defaultValue={data && data.clientName}
                  value={data.clientName}
                  isSearchable={true}
                  name="clientName"
                  placeholder={"Client Name"}
                  options={clients}
                  onChange={(option) => {
                    handleChange("clientName", option);
                  }}
                  // getOptionLabel={(option) => option && option.company_name}
                  // getOptionValue={(option) => option && option._id}
                />

                <Select
                  isRequired={true}
                  className="mx-2 sel_width2"
                  // classNamePrefix="select"
                  placeholder={"Department"}
                  defaultValue={data.departmentName}
                  value={data.departmentName}
                  isSearchable={true}
                  name="departmentName"
                  options={filteredDepartments}
                  onChange={(option) => {
                    handleChange("departmentName", option);
                  }}
                />

                <input
                  required
                  style={{ width: "50%" }}
                  onChange={handleNoteChange}
                  value={data.notes}
                  className="form-control"
                  type="text"
                  name="notes"
                  placeholder="Note"
                  title={data.notes}
                />
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </div>
            <div className="col-3">
              <div style={{ alignItems: "center" }} className="d-flex">
                <p
                  style={{
                    fontSize: "27px",
                    fontWeight: "600",
                    width: "105px",
                  }}
                >
                  {formatTime(time)}
                </p>
                <div className="button-container">
                  {timerOn ? (
                    <button
                      type="submit"
                      disabled={loader}
                      className={`stop-button ${timerOn ? "on" : "off"}`}
                    >
                      {" "}
                      {loader ? (
                        <img
                          style={{ height: "25px" }}
                          src={loaderImg}
                          alt=""
                        />
                      ) : (
                        "Stop"
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loader}
                      className={`start-button ${timerOn ? "on" : "off"}`}
                    >
                      {loader ? (
                        <img
                          style={{ height: "25px" }}
                          src={loaderImg}
                          alt=""
                        />
                      ) : (
                        "Start"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Timer;

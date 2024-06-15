/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Store } from "react-notifications-component";

import axios from "../../../../Api/Axios";
import * as axiosURL from "../../../../Api/AxiosUrls";
import Loader from "../../../Common/Loader/Loader";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ViewTask from "./ViewTask";
import DropdownFilter from "../../../Jobs/JobPlaning/DropdownFilter";
import SelectUnSelectFilter from "../../../Jobs/JobPlaning/SelectUnSelectFilter";
import DropdownFilterWithDate from "../../../Jobs/JobPlaning/DropDownFilterWithDate";
import Select from "react-select";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { useSpring, animated } from "react-spring";
import secureLocalStorage from "react-secure-storage";

var addProjectName = axiosURL.addProjectName;
var editProjectName = axiosURL.editProjectName;
var deleteProjectName = axiosURL.deleteProjectName;
var getAllTasksUrl = axiosURL.getAllTasksUrl;
var addOneTasksUrl = axiosURL.addOneTasksUrl;
var ProjDeleteUrl = axiosURL.ProjDeleteUrl;
var Tasks_Update_One_Url = axiosURL.Tasks_Update_One_Url;
var ProjCopyUrl = axiosURL.ProjCopyUrl;

const Tasks = (props) => {
  const filterFromMyList = props.myListPageFData;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskIdFromUrl = queryParams.get("task_id");

  const formPage = props.fromPage;
  // const userNameFilter = props.userNameFilter;

  var defaultName = null;

  const [loader, setLoader] = useState(true);
  const [reRender, setReRender] = useState(true);
  const [reRender2, setReRender2] = useState(0);

  const [sumOfMarks, setSumOfMarks] = useState(0);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [addProjectFormData, setAddProjectFormData] = useState();
  const [editProjectFormData, setEditProjectFormData] = useState();
  const [editSelectedProject, setEditSelectedProject] = useState("");

  const [openProjectId, setOpenProjectId] = useState(null);
  const [openProjectTasks, setOpenProjectTasks] = useState(null);

  const [preData, setPreData] = useState(null);
  const [projectNames, setProjectNames] = useState(null);
  const [projectFNames, setProjectFNames] = useState(null);
  const [fPreData, setFPreData] = useState(null);

  const [statusFvalue, setStatusFvalue] = useState(null);
  const [statusFDuevalue, setStatusFDuevalue] = useState(null);
  const [projectFvalue, setProjectFvalue] = useState(null);
  const [jHolderFvalue, setJHolderFvalue] = useState("");
  const [leadFvalue, setLeadFvalue] = useState(null);

  const [startDateFvalueDate, setStartDateFvalueDate] = useState("");
  const [startDateFvalue, setStartDateFvalue] = useState("");
  const [deadlineFvalueDate, setDeadlineFvalueDate] = useState("");
  const [deadlineFvalue, setDeadlineFvalue] = useState("");
  const [jobDateFvalueDate, setJobDateFvalueDate] = useState("");
  const [jobDateFvalue, setJobDateFvalue] = useState("");

  const handleFunClear = () => {
    if (gridApi) {
      gridApi.api.setFilterModel({});
      gridApi.api.refreshHeader();
    }
    setStatusFvalue(null);
    setProjectFvalue(null);
    setLeadFvalue(null);
    setStartDateFvalueDate(null);
    setStartDateFvalue(null);
    setDeadlineFvalueDate(null);
    setDeadlineFvalue(null);
    setJobDateFvalueDate(null);
    setJobDateFvalue(null);
  };

  const [userRole, setUserRole] = useState("");

  const [usersForFilter, setUsersForFilter] = useState([]);

  const [addTaskFormData, setAddTaskFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    Jobholder_id: "",
    hrs: "",
    lead: "",
    job_date: "",
    status: "Progress",
    notes: "",
  });

  const [addTaskFormDataGoogle, setAddTaskFormDataGoogle] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    Jobholder_id: "",
    hrs: "",
    lead: "",
    job_date: "",
    status: "Progress",
    notes: "",
  });

  const handlePageRefresh = () => {
    setLoader(true);
    setReRender((prev) => !prev);
  };

  const [mainRowData, setMainRowData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [gridApi, setGridApi] = useState(null);

  const [selectedUserListValue, setSelectedUserListValue] = useState([]);
  const [selectedEditUserListValue, setSelectedEditUserListValue] = useState(
    []
  );

  const handleUserListChange = (e) => {
    setSelectedUserListValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const handleEditUserListChange = (e) => {
    setSelectedEditUserListValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const handleBeforEditOpen = (task) => {
    setEditSelectedProject(task);
    setEditProjectFormData(task.name);
    setSelectedEditUserListValue(task.users_list);
    setShowEditProjectModal(true);
  };

  const gridRef = useRef();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const dropdownAnimation = useSpring({
    maxHeight: isOpen ? "fit-content" : 0,
    opacity: isOpen ? 1 : 0,
    position: "absolute",
    backgroundColor: "white",
    width: "inherit",
    boxShadow:
      "rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px",
    borderRadius: "0px 0px 9px 9px",
  });

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const handleAddFormDataChange = (e) => {
    const { name, value } = e.target;
    setAddTaskFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const notificationRef = useRef(null);

  useEffect(() => {
    // Event listener callback function
    const handleDocumentClick = (event) => {
      // Check if the click occurred outside the notification bar
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        // Close the notification bar if it's open
        setIsOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("click", handleDocumentClick);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    console.log(jHolderFvalue, defaultName);
  }, [jHolderFvalue]);

  const handleAddTaskForm = async () => {
    //  Pass Data to Spread Sheet
    fetch("https://sheetdb.io/api/v1/11f65xzdukgnb", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            ...addTaskFormData,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    try {
      const response = await axios.post(
        addOneTasksUrl,
        {
          formData: addTaskFormData,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Task Response:", response.data);

      if (response) {
        setAddTaskFormData({
          name: "",
          description: "",
          startDate: "",
          deadline: "",
          Jobholder_id: "",
          status: "Progress",
          hrs: "",
          lead: "",
          job_date: "",
          notes: "",
        });
        setShowAddTaskModal(false);
        setLoader(false);
        setReRender((prev) => !prev);
      }
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: "Please Try Again",
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
  };

  const handleAddProjectForm = async () => {
    try {
      const response = await axios.post(
        addProjectName,
        {
          name: addProjectFormData,
          usersList: selectedUserListValue,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) {
        setAddProjectFormData("");
        setSelectedUserListValue([]);
        setShowAddProjectModal(false);
        setReRender((prev) => !prev);
      }
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: "Please Try Again",
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
  };

  const handleEditProjectForm = async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.post(
        `${editProjectName}/${editSelectedProject._id}`,
        {
          name: editProjectFormData,
          usersList: selectedEditUserListValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response) {
        setEditProjectFormData("");
        setSelectedEditUserListValue([]);
        setShowEditProjectModal(false);
        setReRender((prev) => !prev);
      }
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: "Please Try Again",
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
  };

  const handleDeleteProjectName = async (projId) => {
    // setLoader(true)
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      await axios.get(`${deleteProjectName}/${projId}`, {
        headers: { "Content-Type": "application/json" },
      });

      setReRender((prev) => !prev);
    }
  };

  const filter = async () => {
    var filteredArray = mainRowData;

    // Job Holder Filter
    if (
      filteredArray !== undefined &&
      jHolderFvalue !== null &&
      jHolderFvalue !== ""
    ) {
      filteredArray = filteredArray.filter(
        (obj) => obj.Jobholder_id && obj.Jobholder_id.name === jHolderFvalue
      );
    } else if (defaultName) {
      filteredArray = filteredArray.filter(
        (obj) => obj.Jobholder_id && obj.Jobholder_id.name === defaultName
      );
    }

    // Job Id Filter
    if (
      filteredArray !== undefined &&
      taskIdFromUrl !== null &&
      taskIdFromUrl !== ""
    ) {
      filteredArray = await filteredArray.filter(
        (obj) => obj._id && obj._id === taskIdFromUrl
      );
    }

    // Lead Filter
    if (
      filteredArray !== undefined &&
      leadFvalue !== null &&
      leadFvalue !== ""
    ) {
      filteredArray = filteredArray.filter(
        (obj) => obj.lead && obj.lead.name === leadFvalue
      );
    }

    //Project Filter
    if (
      filteredArray !== undefined &&
      projectFvalue !== null &&
      projectFvalue !== ""
    ) {
      filteredArray = filteredArray.filter(
        (obj) => obj.projectname_id && obj.projectname_id.name === projectFvalue
      );
    }

    //status Filter
    if (
      filteredArray !== undefined &&
      statusFDuevalue !== null &&
      statusFDuevalue !== ""
    ) {
      filteredArray = filteredArray.filter((obj) => {
        if (obj.deadline && obj.startDate) {
          const deadline = new Date(obj.deadline);
          const yearEnd = new Date(obj.startDate);
          var today = new Date();

          if (
            deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) &&
            yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
          ) {
            if (statusFDuevalue === "Overdue") return obj;
          } else if (
            deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
          ) {
            if (statusFDuevalue === "Overdue") return obj;
          } else if (
            yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0) &&
            !(deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0))
          ) {
            if (statusFDuevalue === "Due") return obj;
          } else if (
            deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
          ) {
            if (statusFDuevalue === "Due") return obj;
          }
        }
      });
    }

    //Status Filter
    if (
      filteredArray !== undefined &&
      statusFvalue !== null &&
      statusFvalue !== ""
    ) {
      filteredArray = filteredArray.filter(
        (obj) => obj.status && obj.status === statusFvalue
      );
    }

    //JobDate
    if (jobDateFvalue) {
      //Job Date Expired Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "Expired"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.job_date);
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            if (
              !(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Today Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "Today"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.job_date);
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            if (deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
              return obj;
            }
          }
        });
      }

      //Job Date Tomorrow Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "Tomorrow"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.job_date);
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            if (
              deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 7 days Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "In 7 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.job_date);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 15 days Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "In 15 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.job_date);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 15 * 24 * 60 * 60 * 1000
          );
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Month Wise Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "Month Wise"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(jobDateFvalueDate);
          const deadline = new Date(obj.job_date);
          if (obj.job_date && obj.job_date !== "Invalid Date") {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if (deadlineYear === todayYear && deadlineMonth === todayMonth) {
              return obj;
            }
          }
        });
      }

      //Job Date Custom Filter
      if (
        filteredArray !== undefined &&
        jobDateFvalue !== null &&
        jobDateFvalue !== "" &&
        jobDateFvalue === "Custom"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          var cellDate = obj.job_date !== "" && new Date(obj.job_date);
          var filterDate = new Date(jobDateFvalueDate);
          if (
            cellDate &&
            cellDate !== "Invalid Date" &&
            filterDate !== "Invalid Date"
          ) {
            // compare dates
            if (
              cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)
            ) {
              return 1; //exclude
            } else if (
              cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)
            ) {
              return 0; //include
            } else {
              return 1; //-1 include as exact match
            }
          }
        });
      }
    }

    //Deadline
    if (deadlineFvalue) {
      //Job Date Expired Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "Expired"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.deadline);
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            if (
              !(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Today Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "Today"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.deadline);
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            if (deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
              return obj;
            }
          }
        });
      }

      //Job Date Tomorrow Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "Tomorrow"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.deadline);
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            if (
              deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 7 days Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "In 7 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.deadline);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 15 days Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "In 15 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.deadline);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 15 * 24 * 60 * 60 * 1000
          );
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Month Wise Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "Month Wise"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(deadlineFvalueDate);
          const deadline = new Date(obj.deadline);
          if (obj.deadline && obj.deadline !== "Invalid Date") {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if (deadlineYear === todayYear && deadlineMonth === todayMonth) {
              return obj;
            }
          }
        });
      }

      //Job Date Custom Filter
      if (
        filteredArray !== undefined &&
        deadlineFvalue !== null &&
        deadlineFvalue !== "" &&
        deadlineFvalue === "Custom"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          var cellDate = obj.deadline !== "" && new Date(obj.deadline);
          var filterDate = new Date(deadlineFvalueDate);
          if (
            cellDate &&
            cellDate !== "Invalid Date" &&
            filterDate !== "Invalid Date"
          ) {
            // compare dates
            if (
              cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)
            ) {
              return 1; //exclude
            } else if (
              cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)
            ) {
              return 0; //include
            } else {
              return 1; //-1 include as exact match
            }
          }
        });
      }
    }

    //startDate
    if (startDateFvalue) {
      //Job Date Expired Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "Expired"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.startDate);
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            if (
              !(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Today Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "Today"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.startDate);
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            if (deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
              return obj;
            }
          }
        });
      }

      //Job Date Tomorrow Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "Tomorrow"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.startDate);
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            if (
              deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 7 days Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "In 7 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.startDate);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date 15 days Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "In 15 days"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date();
          const deadline = new Date(obj.startDate);
          const deadlineNextSevenDays = new Date(
            today.getTime() + 15 * 24 * 60 * 60 * 1000
          );
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            if (
              deadline >= today.setHours(0, 0, 0, 0) &&
              deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0)
            ) {
              return obj;
            }
          }
        });
      }

      //Job Date Month Wise Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "Month Wise"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(startDateFvalueDate);
          const deadline = new Date(obj.startDate);
          if (obj.startDate && obj.startDate !== "Invalid Date") {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if (deadlineYear === todayYear && deadlineMonth === todayMonth) {
              return obj;
            }
          }
        });
      }

      //Job Date Custom Filter
      if (
        filteredArray !== undefined &&
        startDateFvalue !== null &&
        startDateFvalue !== "" &&
        startDateFvalue === "Custom"
      ) {
        filteredArray = await filteredArray.filter((obj) => {
          var cellDate = obj.startDate !== "" && new Date(obj.startDate);
          var filterDate = new Date(startDateFvalueDate);
          if (
            cellDate &&
            cellDate !== "Invalid Date" &&
            filterDate !== "Invalid Date"
          ) {
            // compare dates
            if (
              cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)
            ) {
              return 1; //exclude
            } else if (
              cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)
            ) {
              return 0; //include
            } else {
              return 1; //-1 include as exact match
            }
          }
        });
      }
    }

    if (filteredArray) {
      var summ = 0;
      filteredArray.forEach((item) => {
        if (item.hrs && item.hrs !== "") {
          summ = +summ + +item.hrs;
        }
      });
      setSumOfMarks(summ);
    }

    setRowData(filteredArray);
  };

  useEffect(() => {
    // setRowData(mainRowData)
    // if(filterFromMyList ){
    //   setDeadlineFvalue(filterFromMyList && filterFromMyList.deadline)
    // }
    filter();
  }, [
    filterFromMyList,
    mainRowData,
    statusFDuevalue,
    statusFvalue,
    projectFvalue,
    jHolderFvalue,
    leadFvalue,
    startDateFvalueDate,
    startDateFvalue,
    deadlineFvalueDate,
    deadlineFvalue,
    jobDateFvalueDate,
    jobDateFvalue,
    taskIdFromUrl,
  ]);

  useEffect(() => {
    const tempArr = usersForFilter;

    const newObj = { value: null, label: "Select" };

    tempArr.unshift(newObj);

    setUsersForFilter(tempArr);
  }, [usersForFilter]);

  useEffect(() => {
    if (projectFNames) {
      const tempArr = projectFNames;

      const newObj = { value: null, label: "Select" };

      tempArr.unshift(newObj);

      setProjectFNames(tempArr);
    }
  }, [projectFNames]);

  const getData = async () => {
    // setLoader(true)
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.get(getAllTasksUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 200) {
        setUserRole(response.data.userRole);
        setPreData(response.data.users);
        setProjectNames(response.data.projectNames);

        setProjectFNames(
          response.data.projectNames.map((names) => {
            return { value: names._id, label: names.name };
          })
        );

        setUsersForFilter(
          response.data.users.map((names) => {
            return { value: names._id, label: names.name };
          })
        );
        setFPreData(
          response.data.users.map((names) => {
            return { value: names._id, label: names.name };
          })
        );

        const name = response.data.curUser && response.data.curUser;
        defaultName = name && name;
        setJHolderFvalue(name && name);
        setMainRowData(response.data.projects);
        setLoader(false);
      }
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: "Please Try Again",
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
  };

  // useEffect(()=>{
  //   if(openProjectId){
  //     if(rowData !== undefined){
  //       var filteredArray = rowData.filter(obj => obj && obj._id === openProjectId);
  //     }
  //     setOpenProjectTasks(filteredArray && filteredArray[0])
  //   }
  // }, rowData)

  const handleDeleteProject = async (projId) => {
    // setLoader(true)

    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      const filteredArray = rowData.filter((obj) => obj._id !== projId);
      setRowData(filteredArray);
      try {
        await axios.get(`${ProjDeleteUrl}/${projId}`, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {}

      setReRender((prev) => !prev);
    }
  };

  const handleCopyProject = async (projId, projData) => {
    // setLoader(true)

    const copiedProj = {
      projectname_id: projData.projectname_id,
      startDate: projData.startDate,
      deadline: projData.deadline,
      Jobholder_id: projData.Jobholder_id,
      status: "Progress",
      _id: `${projData._id}1001`,
    };
    setRowData((prev) => [...prev, copiedProj]);
    try {
      await axios.get(`${ProjCopyUrl}/${projId}`, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      //
    }

    setReRender((prev) => !prev);
  };

  const columnDefs = [
    {
      headerName: "Sr #",
      filter: false,
      flex: 0.6,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      headerName: "Project",
      field: "projectname_id",
      flex: 2,
      valueGetter: (params) => {
        return params.data.projectname_id
          ? params.data.projectname_id.name
            ? params.data.projectname_id.name
            : params.data.projectname_id_name
          : params.data.projectname_id_name;
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: projectFNames && projectFNames.map((option) => option.label),
      },
      floatingFilterComponent: "selectFloatingFilter",
      floatingFilterComponentParams: {
        options: projectNames && projectNames.map((option) => option.name),
        onValueChange: (value) => setProjectFvalue(value),
        value: projectFvalue,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    {
      headerName: "Job Holder",
      field: "Jobholder_id",
      flex: 1.4,
      valueGetter: (p) => {
        return p.data.Jobholder_id
          ? p.data.Jobholder_id.name
            ? p.data.Jobholder_id.name
            : p.data.Jobholder_id_name
          : p.data.Jobholder_id_name;
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: usersForFilter && usersForFilter.map((option) => option.label),
      },
      onCellValueChanged: function (event) {},
      floatingFilterComponent: "selectFloatingFilter",
      floatingFilterComponentParams: {
        options: fPreData && fPreData.map((option) => option.label),
        onValueChange: (value) => setJHolderFvalue(value && value),
        value: jHolderFvalue,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    {
      headerName: "Tasks",
      field: "description",
      flex: 6,
      cellRendererFramework: (params) => (
        <>
          <Link
            style={{ textDecoration: "none" }}
            onClick={() => {
              setOpenProjectId(params.data._id);
              setOpenProjectTasks(params.data);
              setShowViewTaskModal(true);
            }}
          >
            {params.data.description}
          </Link>
        </>
      ),
    },

    {
      headerName: "Hrs",
      field: "hrs",
      flex: 1,
    },

    {
      headerName: "Start Date",
      field: "startDate",
      flex: 1.5,
      valueGetter: (p) => {
        if (p.data.startDate && p.data.startDate !== "Invalid Date") {
          const deadline = new Date(p.data.startDate);
          let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
            deadline
          );
          let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(
            deadline
          );
          let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
            deadline
          );
          return `${da}-${mo}-${ye}`;
        } else {
          return "";
        }
      },
      floatingFilterComponent: "selectFloatingFilterWthDate",
      floatingFilterComponentParams: {
        options: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
          "Custom",
        ],
        onValueChange: (value) => setStartDateFvalue(value),
        value: startDateFvalue,
        onDateValueChange: (value) => setStartDateFvalueDate(value),
        dateValue: startDateFvalueDate,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    {
      headerName: "Deadline",
      field: "deadline",
      flex: 1.5,
      valueGetter: (p) => {
        if (p.data.deadline && p.data.deadline !== "Invalid Date") {
          const deadline = new Date(p.data.deadline);
          let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
            deadline
          );
          let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(
            deadline
          );
          let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
            deadline
          );
          return `${da}-${mo}-${ye}`;
        } else {
          return "";
        }
      },
      floatingFilterComponent: "selectFloatingFilterWthDate",
      floatingFilterComponentParams: {
        options: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
          "Custom",
        ],
        onValueChange: (value) => setDeadlineFvalue(value),
        value: deadlineFvalue,
        onDateValueChange: (value) => setDeadlineFvalueDate(value),
        dateValue: deadlineFvalueDate,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    // {
    //   headerName: 'Job Date',
    //   field: 'job_date',
    //   flex:1.5,
    //   valueGetter: p => {
    //     if(p.data.job_date && p.data.job_date !== "Invalid Date")
    //     {
    //       const deadline = new Date(p.data.job_date)
    //       let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
    //       let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
    //       let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
    //       return(`${da}-${mo}-${ye}`);
    //       }
    //       else{
    //         return ""
    //     }
    //   },
    //   floatingFilterComponent: 'selectFloatingFilterWthDate',
    //   floatingFilterComponentParams: {
    //     options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
    //     onValueChange:(value) => setJobDateFvalue(value),
    //     value: jobDateFvalue,
    //     onDateValueChange:(value) => setJobDateFvalueDate(value),
    //     dateValue: jobDateFvalueDate,
    //     suppressFilterButton: true,
    //     suppressInput: true
    //   },
    // },

    {
      headerName: "Status",
      field: "jStatus",
      flex: 1.5,
      editable: false,
      valueGetter: (p) => {
        const deadline = new Date(p.data.deadline);
        const yearEnd = new Date(p.data.startDate);
        var today = new Date();

        if (
          deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) &&
          yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
        ) {
          return "Overdue";
        } else if (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
          return "Overdue";
        } else if (
          yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0) &&
          !(deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0))
        ) {
          return "Due";
        } else if (
          deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
        ) {
          return "Due";
        }
      },
      floatingFilterComponent: "selectFloatingFilter",
      floatingFilterComponentParams: {
        options: ["Overdue", "Due"],
        onValueChange: (value) => setStatusFDuevalue(value),
        value: statusFDuevalue,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    { headerName: "Notes", field: "notes", flex: 3 },

    {
      headerName: "Status",
      field: "status",
      flex: 1.2,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Select",
          "To do",
          "Progress",
          "Review",
          "Recurring",
          "Completed",
        ],
      },
      floatingFilterComponent: "SelectUnSelectFilter",
      floatingFilterComponentParams: {
        options: ["To do", "Progress", "Review", "Recurring", "Completed"],
        onValueChange: (value) => setStatusFvalue(value),
        value: statusFvalue,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },

    {
      headerName: "Action",
      field: "delete",
      flex: 0.8,
      cellRendererFramework: (params) => (
        <>
          <Link
            onClick={() => {
              handleCopyProject(params.data._id, params.data);
            }}
            style={{
              all: "unset",
              cursor: "pointer",
              textAlign: "center !important",
            }}
          >
            <svg
              className="mx-1"
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 256 256"
            >
              <path
                d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401 4.636 0 8.397 1.719 13.594 5.67 5.196 3.953 13.052 10.56 16.942 14.962 3.89 4.402 5.532 6.972 5.532 10.604 0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881-9.257.124-29.135.124-29.135.124s.466 6.275.466 15.15-8.106 15.811-17.317 16.056c-9.21.245-71.944-.49-80.884-.245-8.94.245-16.975-6.794-16.975-15.422s.274-93.175.274-101.566zm16.734 3.946l-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.988 1.988 0 0 0-2.046-1.953s-21.866.64-31.767.293c-9.902-.348-16.672-6.807-16.675-15.516-.003-8.709.003-69.142.003-69.142a1.989 1.989 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606l-20.825-18.135zm-57.606.847a2.002 2.002 0 0 0-2.02 1.988l-.626 96.291a2.968 2.968 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.951 1.951 0 0 0-1.96-2.004s-26.172.042-30.783.042c-4.611 0-7.535-2.222-7.535-6.482S152.3 63.92 152.3 63.92a2.033 2.033 0 0 0-2.015-2.018l-36.464-.23z"
                stroke="#979797"
                fill-rule="evenodd"
              />
            </svg>
          </Link>
          <Link
            onClick={() => {
              handleDeleteProject(params.data._id);
            }}
            style={{
              all: "unset",
              cursor: "pointer",
              textAlign: "center !important",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x icon-16"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </>
      ),
    },

    {
      headerName: "Lead",
      field: "lead",
      flex: 1.5,
      valueGetter: (p) => {
        return p.data.lead
          ? p.data.lead.name
            ? p.data.lead.name
            : p.data.lead_name
          : p.data.lead_name;
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: usersForFilter && usersForFilter.map((option) => option.label),
      },
      onCellValueChanged: function (event) {},
      floatingFilterComponent: "selectFloatingFilter",
      floatingFilterComponentParams: {
        options: fPreData && fPreData.map((option) => option.label),
        onValueChange: (value) => setLeadFvalue(value),
        value: leadFvalue,
        suppressFilterButton: true,
        suppressInput: true,
      },
    },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    editable: true,
    resizable: true,
  }));

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const frameworkComponents = {
    selectFloatingFilter: DropdownFilter,
    SelectUnSelectFilter: SelectUnSelectFilter,
    selectFloatingFilterWthDate: DropdownFilterWithDate,
  };

  async function onGridReady(params) {
    setGridApi(params);
  }

  const onCellValueChanged = useCallback(
    (event) => {
      if (event.colDef.field === "Jobholder_id") {
        const selectedOption = fPreData.find(
          (option) => option.label === event.data.Jobholder_id
        );
        event.data.Jobholder_id = selectedOption ? selectedOption.value : "";
        event.data.Jobholder_id_name = selectedOption
          ? selectedOption.label
          : "";
      }

      if (event.colDef.field === "lead") {
        const selectedOption = fPreData.find(
          (option) => option.label === event.data.lead
        );
        event.data.lead = selectedOption ? selectedOption.value : "";
        event.data.lead_name = selectedOption ? selectedOption.label : "";
      }

      if (event.colDef.field === "projectname_id") {
        const selectedOption = projectFNames.find(
          (option) => option.label === event.data.projectname_id
        );
        event.data.projectname_id = selectedOption ? selectedOption.value : "";
        event.data.projectname_id_name = selectedOption
          ? selectedOption.label
          : "";
      }
    },
    [gridApi]
  );

  var i = 1;

  const onRowValueChanged = useCallback(async (event) => {
    var data = event.data;
    try {
      const token = secureLocalStorage.getItem("token");
      await axios.post(
        `${Tasks_Update_One_Url}/${data._id}`,
        {
          name: data.projectname_id,
          description: data.description,
          startDate: data.startDate,
          deadline: data.deadline,
          Jobholder_id: data.Jobholder_id,
          status: data.status,
          hrs: data.hrs,
          lead: data.lead,
          job_date: data.job_date,
          notes: data.notes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      // setLoader(true)
      setReRender2(i);
      i = i + 1;
    } catch (err) {}
  }, []);

  useEffect(() => {
    getData();
  }, [reRender, reRender2]);

  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault();
    try {
      const params = {
        sheetName: "Grid Data",
        fileName: `Tasks - ${new Date().toISOString().slice(0, 10)}`,
        allColumns: true,
      };

      const exportData = gridApi.api.exportDataAsCsv(params);
      const workbook = XLSX.read(exportData, { type: "binary" });
      const excelBuffer = XLSX.write(workbook, {
        bookType: "csv",
        type: "array",
        bookSST: false,
      });
      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        `${params.fileName}.csv`
      );
    } catch (error) {
      //
    }
  };

  // const gridOptions = {
  //   // Use the autoHeight option to adjust the table height to fit the content
  //   domLayout: 'autoHeight',
  //   // Other grid options if needed
  // };

  if (loader) {
    return <Loader />;
  } else {
    return (
      <>
        <div
          style={{
            border: "none",
          }}
          className={`${!formPage && "mt-3"} card`}
        >
          <div
            style={{ alignItems: "center", justifyContent: "space-between" }}
            className="d-flex"
          >
            <div style={{ alignItems: "center" }} className="d-flex">
              <div>
                <h4 style={{ padding: "20px 16px" }}>Tasks</h4>
              </div>

              <div className="table-col-numbers mx-2">
                <select
                  className="form-control"
                  onChange={onPageSizeChanged}
                  id="page-size"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>

              <div className="table-show-hide mx-2">
                <button
                  type="button"
                  onClick={handleFunClear}
                  className=" btn"
                  style={{
                    padding: "3px",
                    backgroundColor: "rgb(255, 255, 255)",
                    border: "1px solid rgb(242, 244, 246)",
                    color: "rgb(89, 89, 89)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    stroke="rgb(89, 89, 89)"
                    fill="rgb(89, 89, 89)"
                  >
                    <path
                      d="M16 8L8 16M8.00001 8L16 16"
                      stroke="#000000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="table-show-hide mx-2">
                <button
                  type="button"
                  onClick={handlePageRefresh}
                  className=" btn"
                  style={{
                    padding: "3px",
                    backgroundColor: "rgb(255, 255, 255)",
                    border: "1px solid rgb(242, 244, 246)",
                    color: "rgb(89, 89, 89)",
                  }}
                >
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
                        stroke="#000000"
                        stroke-width="0.696"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            <div className="d-flex">
              <Link
                onClick={exportToExcel}
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  borderColor: "lightgray",
                  alignSelf: "center",
                }}
                className="btn btn-primary mx-2"
              >
                Excel
              </Link>
              {userRole === "Admin" && (
                <div
                  style={{
                    width: "11rem",
                    overflow: "visible",
                    zIndex: "100",
                    alignSelf: "center",
                    marginRight: "19px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "1.5",
                      fontSize: "1rem",
                      borderBottom: "1px solid #ced4da",
                      padding: "8px",
                      borderRadius: "0rem",
                      cursor: "pointer",
                    }}
                    onClick={handleToggle}
                    ref={notificationRef}
                  >
                    <div style={{ width: "100%" }} className="row">
                      <div className="col-10">Projects</div>
                      <div
                        style={{ padding: "0px", textAlign: "right" }}
                        className="col-2"
                      >
                        <svg
                          style={{
                            width: "20px",
                            stroke: "rgb(123, 129, 144)",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7 10l5 5 5-5"
                            stroke="#7b8190"
                            stroke-width="2"
                            fill="none"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <animated.div style={dropdownAnimation}>
                    {isOpen && (
                      <div>
                        <div style={{ padding: 10 }}>
                          {projectNames &&
                            projectNames.map((task, ind) => {
                              return (
                                <div
                                  style={{ cursor: "default" }}
                                  key={ind}
                                  className="row recurringTask_task"
                                >
                                  <div className="col-9">
                                    <p> {task.name} </p>
                                  </div>

                                  <div
                                    style={{
                                      padding: "0px",
                                      display: "flex",
                                      alignSelf: "center",
                                    }}
                                    className="col-3"
                                  >
                                    <div
                                      onClick={() => {
                                        handleBeforEditOpen(task);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <svg
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          stroke-width="0"
                                        ></g>
                                        <g
                                          id="SVGRepo_tracerCarrier"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                          {" "}
                                          <path
                                            d="M20.1498 7.93997L8.27978 19.81C7.21978 20.88 4.04977 21.3699 3.32977 20.6599C2.60977 19.9499 3.11978 16.78 4.17978 15.71L16.0498 3.84C16.5979 3.31801 17.3283 3.03097 18.0851 3.04019C18.842 3.04942 19.5652 3.35418 20.1004 3.88938C20.6356 4.42457 20.9403 5.14781 20.9496 5.90463C20.9588 6.66146 20.6718 7.39189 20.1498 7.93997V7.93997Z"
                                            stroke="#000000"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          ></path>{" "}
                                        </g>
                                      </svg>
                                    </div>
                                    <div
                                      onClick={() => {
                                        handleDeleteProjectName(task._id);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-x icon-16"
                                      >
                                        <line
                                          x1="18"
                                          y1="6"
                                          x2="6"
                                          y2="18"
                                        ></line>
                                        <line
                                          x1="6"
                                          y1="6"
                                          x2="18"
                                          y2="18"
                                        ></line>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </animated.div>
                </div>
              )}
              <div className="">
                <Link
                  onClick={() => {
                    setShowAddProjectModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add Project
                </Link>
              </div>
              <div className="mx-4">
                <Link
                  onClick={() => {
                    setShowAddTaskModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add Task
                </Link>
              </div>
            </div>
          </div>

          <hr
            style={{
              marginBottom: "0px",
              marginTop: "0px",
              color: "rgb(131 131 131)",
            }}
          />

          <div>
            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine" style={{ height: "81vh" }}>
              {/* <button onClick={deleteHandler}>delete</button> */}

              <AgGridReact
                onGridReady={onGridReady}
                // gridOptions={formPage !== undefined ? gridOptions : undefined}
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                pagination={true}
                paginationPageSize={25}
                suppressDragLeaveHidesColumns={true}
                frameworkComponents={frameworkComponents}
                editType={"fullRow"}
                onCellValueChanged={onCellValueChanged}
                onRowValueChanged={onRowValueChanged}
              />

              <div className="fixed-row">
                <div className="fixed-row-cell">
                  Total Hours: {sumOfMarks.toFixed(1)}
                </div>

                {/* Add more cells or custom content as needed */}
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={showAddProjectModal}
          centered
          onHide={() => {
            setShowAddProjectModal(!showAddProjectModal);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddProjectForm}>
              <Form.Group className="mt-2">
                <Form.Control
                  name="projectName"
                  type="text"
                  placeholder="Project Name"
                  onChange={(e) => {
                    setAddProjectFormData(e.target.value);
                  }}
                  value={addProjectFormData}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Select
                  className="dropdown"
                  placeholder="Select Users"
                  value={fPreData.filter((obj) =>
                    selectedUserListValue.includes(obj.value)
                  )} // set selected values
                  options={fPreData} // set list of the data
                  onChange={handleUserListChange} // assign onChange function
                  isMulti
                  isClearable
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowAddProjectModal(!showAddProjectModal);
              }}
            >
              Close
            </Button>
            <Button onClick={handleAddProjectForm} className="btn btn-success">
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showEditProjectModal}
          centered
          onHide={() => {
            setShowEditProjectModal(!showEditProjectModal);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditProjectForm}>
              <Form.Group className="mt-2">
                <Form.Control
                  name="projectName"
                  type="text"
                  placeholder="Project Name"
                  onChange={(e) => {
                    setEditProjectFormData(e.target.value);
                  }}
                  value={editProjectFormData}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Select
                  className="dropdown"
                  placeholder="Select Users"
                  value={fPreData.filter(
                    (obj) =>
                      selectedEditUserListValue &&
                      selectedEditUserListValue.includes(obj.value)
                  )} // set selected values
                  options={fPreData} // set list of the data
                  onChange={handleEditUserListChange} // assign onChange function
                  isMulti
                  isClearable
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowEditProjectModal(!showEditProjectModal);
              }}
            >
              Close
            </Button>
            <Button onClick={handleEditProjectForm} className="btn btn-success">
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showAddTaskModal}
          centered
          onHide={handleCloseAddTaskModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddTaskForm}>
              <Form.Group className="mt-2">
                <Form.Select
                  name="name"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.name}
                >
                  <option>Project</option>
                  {projectNames &&
                    projectNames.map((proj, ind) => {
                      return (
                        <option key={ind} value={proj._id}>
                          {proj.name}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Control
                  name="hrs"
                  type="number"
                  placeholder="Hrs"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.hrs}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Control
                  name="description"
                  type="text"
                  placeholder="Task"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.description}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Control
                  name="startDate"
                  type="text"
                  placeholder="Start Date"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.startDate}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Control
                  name="deadline"
                  type="text"
                  placeholder="Deadline"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.deadline}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Control
                  name="job_date"
                  type="text"
                  placeholder="Job Date"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.job_date}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Select
                  name="Jobholder_id"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.Jobholder_id}
                >
                  <option>Job Holder</option>
                  {preData &&
                    preData.map((manager, index) => (
                      <option key={index} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Select
                  name="lead"
                  onChange={handleAddFormDataChange}
                  value={addTaskFormData.lead}
                >
                  <option>Lead</option>
                  {preData &&
                    preData.map((manager, index) => (
                      <option key={index} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseAddTaskModal}>Close</Button>
            <Button onClick={handleAddTaskForm} className="btn btn-success">
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          show={showViewTaskModal}
          centered
          onHide={() => {
            setShowViewTaskModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {openProjectTasks && openProjectTasks.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="task_modalbody_bg_color">
            <div style={{ height: "78vh" }}>
              <ViewTask
                openProjectId={openProjectId}
                data={openProjectTasks && openProjectTasks.task_id}
                setReRender={setReRender}
                reRender={reRender}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowViewTaskModal(false);
              }}
            >
              Close
            </Button>
            {/* <Button onClick={handleAddTaskForm} className='btn btn-success' >Save</Button> */}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
};

export default Tasks;

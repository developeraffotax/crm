import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Store } from 'react-notifications-component';
import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Link, useLocation } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';
import secureLocalStorage from 'react-secure-storage';

var proposalsGetAllUrl = axiosURL.proposalsGetAllUrl;
var proposalsAddOneUrl = axiosURL.proposalsAddOneUrl;
var proposalsUpdateOneUrl = axiosURL.proposalsUpdateOneUrl;
var proposalsDeleteUrl = axiosURL.proposalsDeleteUrl;
var proposalsCopyOneUrl = axiosURL.proposalsCopyOneUrl;


export default function Proposals(props) {

  const filterFromMyList = props.myListPageFData

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const clientNameFromUrl = queryParams.get('clientName');

  const gridRef = useRef();
  const [gridApi, setGridApi] = useState();
  const [reRender, setReRender] = useState(true);
  const [loader, setLoader] = useState(false);
  const [mainRowData, setMainRowData] = useState("");
  const [rowData, setRowData] = useState("");
  const [showAddProposalsModal, setShowAddProposalsModal] = useState(false);
  const [showViewDetailedModel, setShowViewDetailedModel] = useState(false);
  const [jobHolders, setJobHolders] = useState([]);
  const [clients, setClients] = useState(false);
  const [modelType, setModelType] = useState({
    type: "",
    id: ''
  });
  const [formData, setFormData] = useState({
    jobHolder: "",
    clientName: "",
    subject: "",
    detailedSubject: "",
    date: "",
    deadline: "",
    jobDate: "",
    note: "",
    source: "",
    status: "",
  })
  const [jobHolderFValue, setJobHolderFValue] = useState("");
  const [clientFValue, setClientFValue] = useState("");
  const [sourceFValue, setSourceFValue] = useState("");
  const [statusFValue, setStatusFValue] = useState("");

  const [dateFvalue, setDateFvalue] = useState("");
  const [dateFvalueDate, setDateFvalueDate] = useState("");
  const [deadlineFvalue, setDeadlineFvalue] = useState("");
  const [deadlineFvalueDate, setDeadlineFvalueDate] = useState("");
  const [jobDateFvalue, setJobDateFvalue] = useState("");
  const [jobDateFvalueDate, setJobDateFvalueDate] = useState("");
  
  const handleOpenModel = (type, data) => {

    if(type === "new"){
      setFormData({
        jobHolder: "",
        clientName: "",
        subject: "",
        detailedSubject: "",
        date: "",
        deadline: "",
        jobDate: "",
        note: "",
        source: "",
        status: "",
      })
      setModelType({
        type: "new",
        id: ''
      })
      setShowAddProposalsModal(true)
    }
    else if(type === "edit"){
      setFormData({
        jobHolder: data.jobHolder,
        clientName: data.clientName,
        subject: data.subject,
        detailedSubject: data.detailedSubject,
        date: data.date,
        deadline: data.deadline,
        jobDate: data.jobDate,
        note: data.note,
        source: data.source,
        status: data.status,
      })
      setModelType({
        type: "edit",
        id: data._id
      })
      setShowAddProposalsModal(true)
    }
    else if(type === "view"){
      setFormData({
        jobHolder: data.jobHolder,
        clientName: data.clientName,
        subject: data.subject,
        detailedSubject: data.detailedSubject,
        date: data.date,
        deadline: data.deadline,
        jobDate: data.jobDate,
        note: data.note,
        source: data.source,
        status: data.status,
      })
      setShowViewDetailedModel(true)
    }
  }

  const handleFormChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));

  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(modelType.type === "new"){
      const response = await axios.post(`${proposalsAddOneUrl}`,
        {
          formData
        },
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setFormData({
          jobHolder: "",
          clientName: "",
          subject: "",
          detailedSubject: "",
          date: "",
          deadline: "",
          jobDate: "",
          note: "",
          source: "",
          status: "",
        })
        setModelType({
          type: "",
          id: ""
        })
        setReRender(prev => !prev)
        setShowAddProposalsModal(false)
      }
    }

    if(modelType.type === "edit"){
      const response = await axios.post(`${proposalsUpdateOneUrl}/${modelType.id}`,
        {
          formData
        },
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setFormData({
          jobHolder: "",
          clientName: "",
          subject: "",
          detailedSubject: "",
          date: "",
          deadline: "",
          jobDate: "",
          note: "",
          source: "",
          status: "",
        })
        setModelType({
          type: "",
          id: ""
        })
        setReRender(prev => !prev)
        setShowAddProposalsModal(false)
      }
    }

  }

  const handleCompanyDelete = async (id) => {

    const response = await axios.get(`${proposalsDeleteUrl}/${id}`,
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setReRender(prev => !prev)
      }

  }

  const handleCopyClick = async (id) => {

    const response = await axios.get(`${proposalsCopyOneUrl}/${id}`,
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setReRender(prev => !prev)
      }

  }

  const filter = async () => {

    var filteredArray = mainRowData

     // companyName Filter
     if(filteredArray !== undefined && clientNameFromUrl !== null && clientNameFromUrl !== ""){
      filteredArray = filteredArray.filter(obj => obj.clientName && obj.clientName === clientNameFromUrl);
    }

    if(jobHolderFValue ){
      filteredArray = filteredArray.filter(obj => obj.jobHolder === jobHolderFValue);
    }

    if(clientFValue ){
      filteredArray = filteredArray.filter(obj => obj.clientName === clientFValue);
    }

    if(sourceFValue ){
      filteredArray = filteredArray.filter(obj => obj.source === sourceFValue);
    }

    if(statusFValue ){
      filteredArray = filteredArray.filter(obj => obj.status === statusFValue);
    }


    //Date
    if (dateFvalue) {

      // Year End Expired Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "Expired") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.date)
          if (obj.date && obj.date !== 'Invalid Date') {
            if (!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      // Year End Today Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "Today") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.date)
          if (obj.date && obj.date !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      // Year End Tomorrow Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "Tomorrow") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.date)
          if (obj.date && obj.date !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }


      // Year End 7 days Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "In 7 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.date)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if (obj.date && obj.date !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      // Year End 15 days Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "In 15 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.date)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if (obj.date && obj.date !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      // Year End Month Wise Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "Month Wise") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(dateFvalueDate)
          const deadline = new Date(obj.date)
          if (obj.date && obj.date !== 'Invalid Date') {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
              return obj;
            }
          }
        });
      }

      //Year End Custom Filter
      if (filteredArray != undefined && dateFvalue != null && dateFvalue !== "" && dateFvalue === "Custom") {
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.date !== "" && new Date(obj.date);
          var filterDate = new Date(dateFvalueDate)
          if (cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date') {
            // compare dates
            if (cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)) {
              return 1; //exclude
            } else if (cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)) {
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

      //Deadline Expired Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "Expired") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.deadline)
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            if (!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Today Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "Today") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.deadline)
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Tomorrow Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "Tomorrow") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.deadline)
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }


      //Deadline 7 days Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "In 7 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.deadline)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline 15 days Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "In 15 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.deadline)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Month Wise Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "Month Wise") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(deadlineFvalueDate)
          const deadline = new Date(obj.deadline)
          if (obj.deadline && obj.deadline !== 'Invalid Date') {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
              return obj;
            }
          }
        });
      }

      //Deadline Custom Filter
      if (filteredArray != undefined && deadlineFvalue != null && deadlineFvalue !== "" && deadlineFvalue === "Custom") {
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.deadline !== "" && new Date(obj.deadline);
          var filterDate = new Date(deadlineFvalueDate)
          if (cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date') {
            // compare dates
            if (cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)) {
              return 1; //exclude
            } else if (cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)) {
              return 0; //include 
            } else {
              return 1; //-1 include as exact match
            }
          }
        });
      }
    }
  
    //JobDate
    if (jobDateFvalue) {

      //Job Date Expired Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "Expired") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            if (!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Today Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "Today") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Tomorrow Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "Tomorrow") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.jobDate)
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }


      //Job Date 7 days Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "In 7 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date 15 days Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "In 15 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Month Wise Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "Month Wise") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(jobDateFvalueDate)
          const deadline = new Date(obj.jobDate)
          if (obj.jobDate && obj.jobDate !== 'Invalid Date') {
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
            const deadlineMonth = deadline.getMonth();
            const deadlineYear = deadline.getFullYear();

            if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
              return obj;
            }
          }
        });
      }

      //Job Date Custom Filter
      if (filteredArray != undefined && jobDateFvalue != null && jobDateFvalue !== "" && jobDateFvalue === "Custom") {
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.jobDate !== "" && new Date(obj.jobDate);
          var filterDate = new Date(jobDateFvalueDate)
          if (cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date') {
            // compare dates
            if (cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)) {
              return 1; //exclude
            } else if (cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)) {
              return 0; //include 
            } else {
              return 1; //-1 include as exact match
            }
          }
        });
      }
      
    }
  
    setRowData(filteredArray)
  }

  useEffect(()=>{


    if(filterFromMyList ){
      setJobHolderFValue(filterFromMyList && filterFromMyList.jobHolder)
      setDeadlineFvalue(filterFromMyList && filterFromMyList.deadline)
    }
      filter();
  },[filterFromMyList, mainRowData, jobHolderFValue, clientFValue, sourceFValue, dateFvalue, dateFvalueDate, deadlineFvalue, deadlineFvalueDate, jobDateFvalue, jobDateFvalueDate, statusFValue])

  const handleFunClear = () => {
    if (gridApi) {
      gridApi.api.setFilterModel({});
      gridApi.api.refreshHeader();
    }
    setJobHolderFValue(null); 
    setClientFValue(null); 
    setSourceFValue(null); 
    setDateFvalue(null); 
    setDateFvalueDate(null); 
    setDeadlineFvalue(null); 
    setDeadlineFvalueDate(null); 
    setJobDateFvalue(null); 
    setJobDateFvalueDate(null); 
    setStatusFValue(null);
  }

  
  const getData = async ()=>{
    setLoader(true)
    try {
      const token = secureLocalStorage.getItem('token') 
        const response = await axios.get(proposalsGetAllUrl,
            {
              headers:{ 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            }
        );
        if(response.status === 200){

            setMainRowData(response.data.data.proposals)
            setJobHolders(response.data.data.employees)
            setClients(response.data.data.clients)
            setLoader(false)
        }
        
    
        } catch (err) {
        Store.addNotification({
            title: 'Error',
            message: "Please Try Again",
            type: "danger",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
            });
    };
}

useEffect(() => {
    getData();
}, [reRender]);

  const columnDefs = [
    {
        headerName: "Sr #",
        filter: false,
        flex: 0.5,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        valueGetter: (params) => params.node.rowIndex + 1,
    },
    { 
        headerName: 'Job Holder',
        field: 'jobHolder', 
        flex:1,
        floatingFilterComponent: 'selectFloatingFilter', 
        floatingFilterComponentParams: { 
          options: jobHolders && jobHolders.map(option => option.name),
          onValueChange:(value) => setJobHolderFValue(value),
          value: jobHolderFValue,
          suppressFilterButton: true, 
          suppressInput: true 
        },
    },
    { 
        headerName: 'Client Name', 
        field: 'clientName', 
        flex:1.5,
        // floatingFilterComponent: 'selectFloatingFilter', 
        // floatingFilterComponentParams: { 
        //   options: clients && clients.map(option => option.client_name),
        //   onValueChange:(value) => setClientFValue(value),
        //   value: clientFValue,
        //   suppressFilterButton: true, 
        //   suppressInput: true 
        // },
    },
    { 
        headerName: 'Subject', 
        field: 'subject', 
        flex:3,
        cellRendererFramework: (params)=>
        <>
        <Link style={{textDecoration: 'none',}} onClick={(e)=>{handleOpenModel("view", params.data);}}>
          {params.data.subject}
        </Link>
        </>,
    },
    { 
        headerName: 'Date', 
        field: 'date', 
        flex:1,
        valueGetter: p => {
          if(p.data.date && p.data.date !== "Invalid Date")
          {
            const deadline = new Date(p.data.date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
            return(`${da}-${mo}-${ye}`);
            }
            else{
              return ""
          }    
        },
        floatingFilterComponent: 'selectFloatingFilterWthDate',
        floatingFilterComponentParams: {
          options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
          onValueChange: (value) => setDateFvalue(value),
          value: dateFvalue,
          onDateValueChange: (value) => setDateFvalueDate(value),
          dateValue: dateFvalueDate,
          suppressFilterButton: true,
          suppressInput: true
        },
    },
    { 
        headerName: 'Deadline', 
        field: 'deadline', 
        flex:1,
        valueGetter: p => {
          if(p.data.deadline && p.data.deadline !== "Invalid Date")
          {
            const deadline = new Date(p.data.deadline)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
            return(`${da}-${mo}-${ye}`);
            }
            else{
              return ""
          }    
        },
        floatingFilterComponent: 'selectFloatingFilterWthDate',
        floatingFilterComponentParams: {
          options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
          onValueChange: (value) => setDeadlineFvalue(value),
          value: deadlineFvalue,
          onDateValueChange: (value) => setDeadlineFvalueDate(value),
          dateValue: deadlineFvalueDate,
          suppressFilterButton: true,
          suppressInput: true
        },
    },
    { 
        headerName: 'Job Date', 
        field: 'jobDate', 
        flex:1,
        valueGetter: p => {
          if(p.data.jobDate && p.data.jobDate !== "Invalid Date")
          {
            const deadline = new Date(p.data.jobDate)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
            return(`${da}-${mo}-${ye}`);
            }
            else{
              return ""
          }    
        },
        floatingFilterComponent: 'selectFloatingFilterWthDate',
        floatingFilterComponentParams: {
          options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
          onValueChange: (value) => setJobDateFvalue(value),
          value: jobDateFvalue,
          onDateValueChange: (value) => setJobDateFvalueDate(value),
          dateValue: jobDateFvalueDate,
          suppressFilterButton: true,
          suppressInput: true
        },
    },
    { 
        headerName: 'Note', 
        field: 'note', 
        flex:3,
    },
    { 
        headerName: 'Source', 
        field: 'source', 
        flex:1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Email', 'UPW', 'PPH', 'Other'] },
        floatingFilterComponent: 'selectFloatingFilter', 
        floatingFilterComponentParams: { 
          options: ['Email', 'UPW', 'PPH', 'Other'],
          onValueChange:(value) => setSourceFValue(value),
          value: sourceFValue,
          suppressFilterButton: true, 
          suppressInput: true 
        },
    },
    { 
        headerName: 'Status', 
        field: 'status', 
        flex:1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Proposal', 'Lead', 'Client'] },
        floatingFilterComponent: 'selectFloatingFilter', 
        floatingFilterComponentParams: { 
          options: ['Proposal', 'Lead', 'Client'],
          onValueChange:(value) => setStatusFValue(value),
          value: statusFValue,
          suppressFilterButton: true, 
          suppressInput: true 
        },
    },
    { 
    headerName: 'Action', 
    field: 'actions', 
    flex:1,
    editable: false,
    cellRendererFramework: (params)=>
    <>
    
    <Link onClick={()=>{handleCopyClick(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
      <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 256 256">
        <path d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401 4.636 0 8.397 1.719 13.594 5.67 5.196 3.953 13.052 10.56 16.942 14.962 3.89 4.402 5.532 6.972 5.532 10.604 0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881-9.257.124-29.135.124-29.135.124s.466 6.275.466 15.15-8.106 15.811-17.317 16.056c-9.21.245-71.944-.49-80.884-.245-8.94.245-16.975-6.794-16.975-15.422s.274-93.175.274-101.566zm16.734 3.946l-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.988 1.988 0 0 0-2.046-1.953s-21.866.64-31.767.293c-9.902-.348-16.672-6.807-16.675-15.516-.003-8.709.003-69.142.003-69.142a1.989 1.989 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606l-20.825-18.135zm-57.606.847a2.002 2.002 0 0 0-2.02 1.988l-.626 96.291a2.968 2.968 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.951 1.951 0 0 0-1.96-2.004s-26.172.042-30.783.042c-4.611 0-7.535-2.222-7.535-6.482S152.3 63.92 152.3 63.92a2.033 2.033 0 0 0-2.015-2.018l-36.464-.23z" stroke="#979797" fill-rule="evenodd"/>
      </svg>
    </Link>
    <Link onClick={()=>{handleOpenModel("edit", params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
      <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
        <g id="Edit / Edit_Pencil_01">
        <title>Edit Template</title>
        <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
      </svg>
    </Link>
    <Link onClick={()=>{handleCompanyDelete(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </Link>
    </>
  }
    
  ];

  const defaultColDef = useMemo( ()=> ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    editable: true,
    resizable: true
   }));

   async function onGridReady(params) {
       setGridApi(params);
     }


     const frameworkComponents = {
      selectFloatingFilter: DropdownFilter,
      selectFloatingFilterWthDate: DropdownFilterWithDate,
    };
    
    const onRowValueChanged = useCallback(async (event) => {
      var data = event.data;
      
      try{
          const response = await axios.post(`${proposalsUpdateOneUrl}/${data._id}`,
            {
              formData: data
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setFormData({
              jobHolder: "",
              clientName: "",
              subject: "",
              detailedSubject: "",
              date: "",
              deadline: "",
              jobDate: "",
              note: "",
              source: "",
              status: "",
            })
            setModelType({
              type: "",
              id: ""
            })
            setReRender(prev => !prev)
          }

      }catch(err){
      }
    
    }, []);

    const handlePageRefresh =()=>{
      setLoader(true)
      setReRender(prev => !prev)
    }


     
  if(loader)
  {
    return(<Loader/>)
  }
  else{
return (
    <>


        <div style={{
    border: 'none'
    }}
    className="my-3 card" >
    
    <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

      <div style={{alignItems: 'center',}} className='d-flex'>

        <div >
          <h4 style={{padding: '20px 16px',}}>
            Proposals
          </h4>
        </div>

        <div className='table-show-hide mx-2'>
          <button type="button" onClick={handleFunClear}
            className=' btn'
            style={{
              padding: '3px',
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(242, 244, 246)',
              color: 'rgb(89, 89, 89)',
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" stroke='rgb(89, 89, 89)' fill="rgb(89, 89, 89)">
              <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div className='table-show-hide mx-2'>
          <button type="button" onClick={handlePageRefresh}
            className=' btn'
            style={{
              padding: '3px',
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(242, 244, 246)',
              color: 'rgb(89, 89, 89)',
            }}>
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916" stroke="#000000" stroke-width="0.696" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>
        </div>


      </div>

        <div>

        <Link onClick={()=>{handleOpenModel("new")}} className='btn btn-primary mx-4'>
          Add Proposals
        </Link>

        </div>

    </div>



    <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ height: '81vh'}}>

        {/* <button onClick={deleteHandler}>delete</button> */}

        <AgGridReact
            onGridReady={onGridReady}
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            ref={gridRef}
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='multiple' // Options - allows click selection of rows
            pagination = {true}
            paginationPageSize = {25}
            suppressDragLeaveHidesColumns={true}
            frameworkComponents={frameworkComponents}
            editType={'fullRow'}
            onRowValueChanged={onRowValueChanged}
        />
        
      </div>
    </div>

</div>

<Modal size="lg" show={showAddProposalsModal} centered onHide={()=>{setShowAddProposalsModal(!showAddProposalsModal)}}>
    <Modal.Header closeButton>
      <Modal.Title> {modelType.type === "new" ? "Add Comapny" : "Edit Comapny"} </Modal.Title>
    </Modal.Header>
    <Modal.Body>

    <Form 
      // onSubmit={handleAddManualEntry}
      >
        
                <Form.Group className='mt-2'>
                <Form.Label>Client Name</Form.Label>

                <Form.Control
                    name='clientName'
                    type="text"
                    placeholder="Enter Client Name"
                      onChange={handleFormChange}
                      value = {formData.clientName}
                />
                
                </Form.Group>

                <Form.Group className='mt-2'>
                <Form.Label>Job Holder</Form.Label>
                <Form.Select 
                  name='jobHolder'
                  onChange={handleFormChange}
                  value = {formData.jobHolder}
                  >
                      <option>Select Job Holder</option>
                      {jobHolders && jobHolders.map((proj, ind)=>{
                        return(
                          <option key={ind} value={proj.name}>{proj.name}</option>
                        )
                      })}
                    
                </Form.Select>
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                    name='subject'
                    type="text"
                    placeholder="Enter Subject"
                      onChange={handleFormChange}
                      value = {formData.subject}
                />
                </Form.Group>

                <Form.Group className='mt-2'>
                <Form.Label>Mail</Form.Label>
                <Form.Control
                    name='detailedSubject'
                    as="textarea"
                    placeholder="Enter Mail"
                    rows={4}
                      onChange={handleFormChange}
                      value = {formData.detailedSubject}
                />
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Date</Form.Label>
                <Form.Control
                    name='date'
                    type="date"
                    placeholder="Enter Name"
                      onChange={handleFormChange}
                      value = {formData.date}
                />
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                    name='deadline'
                    type="date"
                    placeholder="Enter Name"
                      onChange={handleFormChange}
                      value = {formData.deadline}
                />
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Job Date</Form.Label>
                <Form.Control
                    name='jobDate'
                    type="date"
                    placeholder="Enter Name"
                      onChange={handleFormChange}
                      value = {formData.jobDate}
                />
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Source</Form.Label>
                <Form.Select 
                  name='source'
                  onChange={handleFormChange}
                  value = {formData.source}
                  >
                      <option value="">Select Source</option>
                      <option value="Email">Email</option>
                      <option value="UPW">UPW</option>
                      <option value="PPH">PPH</option>
                      <option value="Other">Other</option>
                    
                    
                </Form.Select>
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Note</Form.Label>
                <Form.Control
                    name='note'
                    type="text"
                    placeholder="Enter Note"
                      onChange={handleFormChange}
                      value = {formData.note}
                />
                </Form.Group>
        
                <Form.Group className='mt-2'>
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  name='status'
                  onChange={handleFormChange}
                  value = {formData.status}
                  >
                      <option value="">Select Status</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Lead">Lead</option>
                      <option value="Client">Client</option>
                    
                    
                </Form.Select>
                </Form.Group>


               

      </Form>

    </Modal.Body>
    <Modal.Footer>
      <Button onClick={()=>{setShowAddProposalsModal(!showAddProposalsModal)}}>Close</Button>
      <Button onClick={handleFormSubmit} className='btn btn-success' >Save</Button>
    </Modal.Footer>
  </Modal>

  <Modal show={showViewDetailedModel} centered onHide={()=>{setShowViewDetailedModel(!showViewDetailedModel)}}>
        <Modal.Header closeButton>
          <Modal.Title>Mail View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div style={{ whiteSpace: 'pre-line' }}>
            {showTemplateModalData}
          </div> */}

          {/* <HTMLRenderer htmlContent={formData.detailedSubject} /> */}

          <div style={{ whiteSpace: 'pre-line' }}>
            {formData.detailedSubject}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowViewDetailedModel(!showViewDetailedModel)}}>Close</Button>
          {/* <Button onClick={()=>{handleCopyClick(showTemplateModalData);}} className='btn btn-success' >Copy</Button> */}
        </Modal.Footer>
      </Modal>

    </>
);
}

    
}



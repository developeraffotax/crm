/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link, useLocation } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Modal, Form } from 'react-bootstrap';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

var LeadsGetAllUrl = axiosURL.LeadsGetAllUrl;
var leadEditUrl = axiosURL.leadEditUrl;
var leadDeleteUrl = axiosURL.leadDeleteUrl;
var wonLostUrl = axiosURL.wonLostUrl;
var CopyLeadUrl = axiosURL.CopyLeadUrl;


const Leads = (props) => {

  const filterFromMyList = props.myListPageFData

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const companyNameFromUrl = queryParams.get('companyName');

  const [leadsSummary, setLeadsSummary] = useState({
    invitation: 0,
    proposal: 0,
    website: 0
  });

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [buttonTypeValue, setButtonTypeValue] = useState({
      type: "",
      id: ""
    });
    const [reviewValue, setReviewValue] = useState('');

    const [loader, setLoader] = useState(false)
    const [leadsSummaryToggle, setLeadsSummaryToggle] = useState(false)
    const [activeFilter, setActiveFilter] = useState("In-Progress")

    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([]);
    const [rowData, setRowData] = useState([]);

    const [preData, setPreData] = useState([]);
    
    const [jobHolderFvalue, setJobHoderFvalue] = useState(null);
    const [stageFvalue, setStageFvalue] = useState(null);
    const [sourceFvalue, setSourceFvalue] = useState(null);
    const [brandFvalue, setBrandFvalue] = useState(null);
    const [departmentFvalue, setDepartmentFvalue] = useState(null);
    const [leadSourceFvalue, setLeadSourceFvalue] = useState(null);

    const [createdDateFValue, setCreatedDateFValue] = useState('');
    const [createdDateFValueDate, setCreatedDateFValueDate] = useState('');
    const [followUpDateFValue, setFollowupDateFValue] = useState('');
    const [followUpDateFValueDate, setFollowupDateFValueDate] = useState('');
    const [jobdateFValue, setJobdateFValue] = useState('');
    const [jobdateFValueDate, setJobdateFValueDate] = useState('');

    const [gridApi, setGridApi] = useState(null);
    const gridRef = useRef();

    const [colVisibility, setColVisibility] = useState({
      companyName:true,
      clientName:false,
      department:true,
      source:true,
      brand:true,
      partner:false,
      createDate:false,
      followUpDate:false,
      jobDate:true,
      proposalTemplate:false,
      email:true,
      note:false,
      stage:false,
      reason:false,
    })

    const handleColHideOnStart = () => {
      if (gridApi) {
        gridApi.columnApi.setColumnVisible("companyName", false)
        gridApi.columnApi.setColumnVisible("department", false)
        gridApi.columnApi.setColumnVisible("source", false)
        gridApi.columnApi.setColumnVisible("brand", false)
        gridApi.columnApi.setColumnVisible("jobDate", false)
        gridApi.columnApi.setColumnVisible("email", false)
      }
  
    }

    const handleReviewChange = (e)=>{
      e.preventDefault()
      setReviewValue(e.target.value);
    }

    const handleShowReviewModal = (type, id) => {
      setButtonTypeValue(prevState => ({
        ...prevState,
        type: type,
        id: id
    }));
      setShowReviewModal(true);
    };
  
    const handleCloseReviewModal = () => {
      setShowReviewModal(false);
    };

    async function onGridReady(params) {
      setGridApi(params);
    }

    const handleFilters = async ()=>{
      // const roo = mainrowData; 
      
      var filteredArray = mainRowData

      if(gridApi){
        if(activeFilter === "Won" || activeFilter === "Lost"){
          const name = "reason"
          gridApi.columnApi.setColumnVisible(name, true)
          setColVisibility({ ...colVisibility, [name]: true })
        }else{
          const name = "reason"
          gridApi.columnApi.setColumnVisible(name, false)
          setColVisibility({ ...colVisibility, [name]: false })
        }
      }



      // job Holder Filter
      if(filteredArray !== undefined && jobHolderFvalue !== null && jobHolderFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.Jobholder_id && obj.Jobholder_id.name === jobHolderFvalue);
      }

      // companyName Filter
      if(filteredArray !== undefined && companyNameFromUrl !== null && companyNameFromUrl !== ""){
        filteredArray = filteredArray.filter(obj => obj.companyName && obj.companyName === companyNameFromUrl);
      }

      // Status Filter
      if(filteredArray !== undefined && activeFilter !== null && activeFilter !== ""){
        filteredArray = filteredArray.filter(obj => obj.status && obj.status === activeFilter);
      }

      // Stage Filter
      if(filteredArray !== undefined && stageFvalue !== null && stageFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.stage && obj.stage === stageFvalue);
      }

      // Source Filter
      if(filteredArray !== undefined && sourceFvalue !== null && sourceFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.source && obj.source === sourceFvalue);
      }

      // Brand Filter
      if(filteredArray !== undefined && brandFvalue !== null && brandFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.brand && obj.brand === brandFvalue);
      }

      // department Filter
      if(filteredArray !== undefined && departmentFvalue !== null && departmentFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.department && obj.department === departmentFvalue);
      }

      // Lead Source Filter
      if(filteredArray !== undefined && leadSourceFvalue !== null && leadSourceFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.partner && obj.partner === leadSourceFvalue);
      }


      //Created Date Filter
    if(createdDateFValue){

      // Year End Expired Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "Expired"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.createDate)
          if(obj.createDate && obj.createDate !== 'Invalid Date'){
            if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Today Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "Today"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.createDate)
          if(obj.createDate && obj.createDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Tomorrow Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "Tomorrow"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.createDate)
          if(obj.createDate && obj.createDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }


      // Year End 7 days Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "In 7 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.createDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if(obj.createDate && obj.createDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End 15 days Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "In 15 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.createDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if(obj.createDate && obj.createDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }
      
      // Year End Month Wise Filter
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "Month Wise"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(createdDateFValueDate)
          const deadline = new Date(obj.createDate)
          if (obj.createDate && obj.createDate !== 'Invalid Date') {
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
      if(filteredArray !== undefined && createdDateFValue !== null && createdDateFValue !== "" && createdDateFValue === "Custom"){
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.createDate !== "" && new Date(obj.createDate);
          var filterDate = new Date(createdDateFValueDate)
          if(cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date'){
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

    //FollowUp Date Filter
    if(followUpDateFValue){

      // Year End Expired Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "Expired"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.followUpDate)
          if(obj.followUpDate && obj.followUpDate !== 'Invalid Date'){
            if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Today Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "Today"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.followUpDate)
          if(obj.followUpDate && obj.followUpDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Tomorrow Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "Tomorrow"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.followUpDate)
          if(obj.followUpDate && obj.followUpDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }


      // Year End 7 days Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "In 7 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.followUpDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if(obj.followUpDate && obj.followUpDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End 15 days Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "In 15 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.followUpDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if(obj.followUpDate && obj.followUpDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }
      
      // Year End Month Wise Filter
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "Month Wise"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(followUpDateFValueDate)
          const deadline = new Date(obj.followUpDate)
          if (obj.followUpDate && obj.followUpDate !== 'Invalid Date') {
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
      if(filteredArray !== undefined && followUpDateFValue !== null && followUpDateFValue !== "" && followUpDateFValue === "Custom"){
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.followUpDate !== "" && new Date(obj.followUpDate);
          var filterDate = new Date(followUpDateFValueDate)
          if(cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date'){
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

    //Job Date Filter
    if(jobdateFValue){

      // Year End Expired Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "Expired"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          if(obj.jobDate && obj.jobDate !== 'Invalid Date'){
            if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Today Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "Today"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          if(obj.jobDate && obj.jobDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End Tomorrow Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "Tomorrow"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.jobDate)
          if(obj.jobDate && obj.jobDate !== 'Invalid Date'){
            if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }


      // Year End 7 days Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "In 7 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if(obj.jobDate && obj.jobDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }

      // Year End 15 days Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "In 15 days"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.jobDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if(obj.jobDate && obj.jobDate !== 'Invalid Date'){
            if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
              return obj;
            }
          }
        });
      }
      
      // Year End Month Wise Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "Month Wise"){
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(jobdateFValueDate)
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
      
      //Year End Custom Filter
      if(filteredArray !== undefined && jobdateFValue !== null && jobdateFValue !== "" && jobdateFValue === "Custom"){
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.jobDate !== "" && new Date(obj.jobDate);
          var filterDate = new Date(jobdateFValueDate)
          if(cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date'){
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
      //Leads Summary
      const invitationArray  = rowData.filter(obj => obj.status && obj.source === "Invitation");
      const proposalArray  = rowData.filter(obj => obj.status && obj.source === "Proposal");
      const websiteArray  = rowData.filter(obj => obj.status && obj.source === "Website");

      setLeadsSummary(prevState => ({
        ...prevState,
        invitation: invitationArray.length,
        proposal: proposalArray.length,
        website: websiteArray.length,
    }));
    }, [rowData])


    useEffect(()=>{
      setRowData(mainRowData)

      if(filterFromMyList ){
        setJobHoderFvalue(filterFromMyList && filterFromMyList && filterFromMyList.jobHolder)
        setJobdateFValue(filterFromMyList && filterFromMyList.deadline)
      }
      handleFilters()
    },[jobHolderFvalue, filterFromMyList, mainRowData, activeFilter, stageFvalue, sourceFvalue, brandFvalue, departmentFvalue, leadSourceFvalue, gridApi, jobdateFValue, jobdateFValueDate, followUpDateFValue, followUpDateFValueDate, jobdateFValue, jobdateFValueDate])


    const handleFunClear = () => {
      if (gridApi) {
        gridApi.api.setFilterModel({});
        gridApi.api.refreshHeader();
      }
      setActiveFilter(null);
      setStageFvalue(null);
      setSourceFvalue(null);
      setBrandFvalue(null);
      setDepartmentFvalue(null);
      setLeadSourceFvalue(null);
      setJobdateFValue(null);
      setJobdateFValueDate(null);
      setFollowupDateFValue(null);
      setFollowupDateFValueDate(null);
      setJobdateFValue(null);
      setJobdateFValueDate(null);
    }


    const getPreData = async () => {
      setLoader(true)
      try {
        
          const resp = await axios.get(LeadsGetAllUrl,
              {
                  headers:{ 'Content-Type': 'application/json' }
              }
          );
          if(resp.status === 200){
              setMainRowData(resp.data.leads)
              setPreData(resp.data.users.map(names => {
                return { value: names._id, label: names.name };
              }));
            }
            
          setLoader(false)
    
        } catch (err) {
  
          Store.addNotification({
              title: 'Error',
              message: 'Please Try Again',
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


    const getData = async ()=>{
        
        try {
            const response = await axios.get(LeadsGetAllUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setMainRowData(response.data.leads)
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
        handleColHideOnStart();
        
    }, [gridApi]);

    useEffect(() => {
        getData();
        
    }, [reRender]);

    useEffect(() => {
        setLoader(true)

        getPreData();

    }, []);

    useEffect(()=>{
      const tempArr = preData
          const newObj = { value: null, label: 'Select' };
  
          tempArr.unshift(newObj);
  
          setPreData(tempArr)
  
     }, [preData])


     const handleActionButtons = async (type, id)=>{

      if(type === "Delete"){
        const confirmed = window.confirm('Are you sure you want to delete this lead?');
        if (confirmed) {
          if(id !== "New"){
            await axios.get(`${leadDeleteUrl}/${id}`,
            {
              headers:{ 'Content-Type': 'application/json' }
            }
            );
          }
        }
      }
      
      if(type === "Won"){
        await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "Won",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      if(type === "Lost"){
        await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "Lost",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      if(type === "In-Progress"){
        await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "In-Progress",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      
      setShowReviewModal(false);
      setReRender(!reRender)

     }
    
    

    const handleAddRow = () => {
      const newRowData = { _id: 'New', company_name: null, client_name: null, department: null, source: null, brand: null, partner: null, createDate: null, followUpDate: null, manager_id: null, proposalTemplate: null, email: null, note: null, stage: null };
      setRowData([newRowData, ...rowData]);
    };

    const handleCopyLead = async (projId)=>{
      setLoader(true)
      await axios.get(`${CopyLeadUrl}/${projId}`,
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setReRender(!reRender);
    }
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.3,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            valueGetter: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Co Name', field: 'companyName', flex:1.3 },
        { headerName: 'Client Name', field: 'clientName', flex:1.3 },
        { 
          headerName: 'Job Holder', 
          field: 'Jobholder_id', 
          flex:0.5,
          valueGetter: p => {
              return p.data.Jobholder_id ? p.data.Jobholder_id.name : "" //to get value from obj inside obj
            },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: preData && preData.map(option => option.label),
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: preData && preData.map(option => option.label),
            onValueChange:(value) => setJobHoderFvalue(value),
            value: jobHolderFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { 
          headerName: 'Department', 
          field: 'department', 
          flex:1.3,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Book Keeping', 'Payroll', 'VAT Return', 'Accounts', 'Personal Tax', 'Company Sec', 'Address', 'Billing'],
            onValueChange:(value) => setDepartmentFvalue(value),
            value: departmentFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Book Keeping', 'Payroll', 'VAT Return', 'Accounts', 'Personal Tax', 'Company Sec', 'Address', 'Billing'] },
        },
        { 
          headerName: 'Source', 
          field: 'source', 
          flex:1.3,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Invitation', 'Proposal', 'Website'],
            onValueChange:(value) => setSourceFvalue(value),
            value: sourceFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Invitation', 'Proposal', 'Website'] },
        },
        { 
          headerName: 'Brand', 
          field: 'brand', 
          flex:1.3,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Outsource', 'Affotax', 'OTL'],
            onValueChange:(value) => setBrandFvalue(value),
            value: brandFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Outsource', 'Affotax', 'OTL'] },
        },
        { 
          headerName: 'Lead Source', 
          field: 'partner', 
          flex:0.5,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Upwork', 'Fiver', 'PPH', 'Referral', 'Partner', 'Google', 'Facebook', 'Linkedin', 'Others'],
            onValueChange:(value) => setLeadSourceFvalue(value),
            value: leadSourceFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Upwork', 'Fiver', 'PPH', 'Referral', 'Partner', 'Google', 'Facebook', 'Linkedin', 'Others'] },
        },
        { headerName: 'Created Date', field: 'createDate', flex:0.5, editable: true,
        valueGetter: p => {
          if(p.data.createDate  && p.data.createDate !== "Invalid Date")
          {
            const deadline = new Date(p.data.createDate)
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
            onValueChange:(value) => setCreatedDateFValue(value),
            value: createdDateFValue,
            onDateValueChange:(value) => setCreatedDateFValueDate(value),
            dateValue: createdDateFValueDate,
            suppressFilterButton: true, 
            suppressInput: true 
          },
        },
        { headerName: 'Followup Date', field: 'followUpDate', flex:0.5,
        valueGetter: p => {
          if(p.data.followUpDate  && p.data.followUpDate !== "Invalid Date")
          {
            const deadline = new Date(p.data.followUpDate)
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
            onValueChange:(value) => setFollowupDateFValue(value),
            value: followUpDateFValue,
            onDateValueChange:(value) => setFollowupDateFValueDate(value),
            dateValue: followUpDateFValueDate,
            suppressFilterButton: true, 
            suppressInput: true 
          },
        },
        { 
          headerName: 'Job Date', 
          field: 'jobDate', 
          flex:1.3,
          valueGetter: p => {
            if(p.data.jobDate  && p.data.jobDate !== "Invalid Date")
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
            onValueChange:(value) => setJobdateFValue(value),
            value: jobdateFValue,
            onDateValueChange:(value) => setJobdateFValueDate(value),
            dateValue: jobdateFValueDate,
            suppressFilterButton: true, 
            suppressInput: true 
          },
        },
        { headerName: 'Email', field: 'email', flex:1.3 },
        { headerName: 'Note', field: 'note', flex:3 },
        { 
          headerName: 'Stages', 
          field: 'stage', 
          flex:0.5,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Interest', 'Decision', 'Action'],
            onValueChange:(value) => setStageFvalue(value),
            value: stageFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Interest', 'Decision', 'Action']          
        },
        },
        { headerName: 'Review', field: 'reason', flex:1, editable: false },
        {
            headerName: 'Action', 
            field: 'status',
            floatingFilter: false,
            // flex:2,
            editable:false,
            width: activeFilter === "In-Progress" ? 230 : 265 ,
            cellRendererFramework: (params)=>
            <>
                <div>
                  {/* {params.data.status !== "Won" && <Link onClick={()=>{handleActionButtons("Won", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485',}} className='btn mx-1 '> Won</Link>  } */}

                  {/* {params.data.status !== "Lost" && <Link onClick={()=>{handleActionButtons("Lost", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Lost</Link> }
                       
                  {params.data.status !== "In-Progress" && <Link onClick={()=>{handleActionButtons("In-Progress", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485', color: 'black',}} className='btn mx-1 '> InProgress</Link>}
                              */}

                   <Link onClick={() => handleCopyLead(params.data._id)} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485',}} className='btn mx-1 '> Copy </Link>
                  
                  {params.data.status !== "Won" && <Link onClick={() => handleShowReviewModal('Won', params.data._id)} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485',}} className='btn mx-1 '> Won</Link>  }

                  {params.data.status !== "Lost" && <Link onClick={()=>{handleShowReviewModal("Lost", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Lost</Link> }
                       
                  {params.data.status !== "In-Progress" && <Link onClick={()=>{handleActionButtons("In-Progress", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485', color: 'black',}} className='btn mx-1 '> Progress</Link>}

                  <Link onClick={()=>{handleActionButtons("Delete", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Delete</Link>    
                    
                  {/* <Link style={{border: '1px solid grey', height: '25px', width:"fit-content", padding: '0px 5px'}} className='btn mx-1 '>Make Customer</Link> */}
                    
                </div> 
            </>
        }
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: true,
        resizable: true
       }), []);

       const onCellValueChanged = useCallback((event) => {
        if(event.colDef.field === "Jobholder_id"){
          console.log(preData)
          const selectedOption = preData.find(option => option.label === event.data.Jobholder_id);
          event.data.Jobholder_id = selectedOption ? selectedOption.value : '';
        }
      }, [gridApi]);

       const onRowValueChanged = useCallback(async (event) => {
        var data = event.data;
        await axios.post(leadEditUrl, 
          {
            data
          },
          {
            headers:{ 'Content-Type': 'application/json' }
          }
        );

        setReRender(!reRender)
      
      }, []);

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

      function handleMenuClick(e) {
        // Prevent the default behavior of the click event
        e.preventDefault();
      
        // Stop the click event from propagating to the dropdown menu
        e.stopPropagation();
      }

      const toggleColHandler = (e, name) => {
        handleMenuClick(e);
        gridApi.columnApi.setColumnVisible(name, colVisibility[name])
        setColVisibility({ ...colVisibility, [name]: !colVisibility[name] })
      }

      const frameworkComponents = {
        selectFloatingFilter: DropdownFilter,
        selectFloatingFilterWthDate: DropdownFilterWithDate,
      };

      

  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Leads - ${new Date().toISOString().slice(0, 10)}`,
      allColumns: true
    };

    const exportData = gridApi.api.exportDataAsCsv(params);
    const workbook = XLSX.read(exportData, { type: 'binary' });
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'array',
      bookSST: false
    });
    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      `${params.fileName}.csv`
    );
    } catch (error) {
  }
  };

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
        className="mt-3 card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Leads
              </h4>
            </div>

            <div  className='table-col-numbers mx-2'>
              <select className='form-control' onChange={onPageSizeChanged} id="page-size">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>

            <div  className='table-col-numbers mx-2'>
              <button onClick={(e)=>{e.preventDefault(); setLeadsSummaryToggle(!leadsSummaryToggle)}} className='form-control'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 10.5V17.5M11.5 5.5V17.5M16 10.5V17.5M20.5 5.5V17.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div className='table-show-hide mx-2'>
              <div className="dropdown">
                <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
                <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "companyName")}} className={`dropdown-item ${!colVisibility.companyName? "" : "active"}`}  >Co Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "clientName")}} className={`dropdown-item ${!colVisibility.clientName? "" : "active"}`} >Client Name</button></li> 
                        <li><button onClick={(e)=>{toggleColHandler(e, "department")}} className={`dropdown-item ${!colVisibility.department? "" : "active"}`} >Department</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "source")}} className={`dropdown-item ${!colVisibility.source? "" : "active"}`} >Source</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "brand")}} className={`dropdown-item ${!colVisibility.brand? "" : "active"}`} >Brand</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "partner")}} className={`dropdown-item ${!colVisibility.partner? "" : "active"}`} >Partner</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "createDate")}} className={`dropdown-item ${!colVisibility.createDate? "" : "active"}`} >Created Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "followUpDate")}} className={`dropdown-item ${!colVisibility.followUpDate? "" : "active"}`} >Followup Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "jobDate")}} className={`dropdown-item ${!colVisibility.jobDate? "" : "active"}`} >Job Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "proposalTemplate")}} className={`dropdown-item ${!colVisibility.proposalTemplate? "" : "active"}`} >Prop.Template</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "email")}} className={`dropdown-item ${!colVisibility.email? "" : "active"}`} >Email</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "note")}} className={`dropdown-item ${!colVisibility.note? "" : "active"}`} >Note</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "stage")}} className={`dropdown-item ${!colVisibility.Stages? "" : "active"}`} >stage</button></li>
                      </ul>
                </div>
              </div>
            </div>


            <div>
                <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "In-Progress">
                      Progress
                    </option>
                    <option value = "Won">
                        Won
                    </option>
                    <option value = "Lost">
                        Lost
                    </option>
                </select>
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

          </div>

          <div className=''>
          <Link onClick={exportToExcel} style={{
          backgroundColor: 'transparent',
          color: 'black',
          borderColor: 'lightgray',
          alignSelf: 'center',
        }} className='btn btn-primary'>
            Excel
          </Link>
            <button onClick={handleAddRow} className='btn btn-primary mx-4'>
              Add Lead
            </button>
          </div>
          

        </div>

        <div className={`leadsSummary ${leadsSummaryToggle ? 'open' : 'closed'}`}>
          <hr style={{marginBottom: '0.1rem', color: 'rgb(131, 131, 131)',}}/>

          <div  className='p-2 m-2'>
            <div >
              <p style={{fontWeight: '500',}} className='mb-3'>
                Leads Summary
              </p>
              <div className='row'>

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.invitation}</span> Invitation
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.proposal}</span> Proposal
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.website}</span> Website
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{ ((+leadsSummary.invitation / (+leadsSummary.invitation + +leadsSummary.website + +leadsSummary.proposal)) * 100).toFixed(1) }%</span> { activeFilter === "In-Progress" ? "Invitation" : activeFilter === "Won" ? " Conv.Invitation " : activeFilter === "Lost" && "Lost.Invitation"}
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{ ((+leadsSummary.proposal / (+leadsSummary.invitation + +leadsSummary.website + +leadsSummary.proposal)) * 100).toFixed(1) }%</span> { activeFilter === "In-Progress" ? "Proposal" : activeFilter === "Won" ? " Conv.Proposal " : activeFilter === "Lost" && "Lost.Proposal"}
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{ ((+leadsSummary.website / (+leadsSummary.invitation + +leadsSummary.website + +leadsSummary.proposal)) * 100).toFixed(1) }%</span> { activeFilter === "In-Progress" ? "Website" : activeFilter === "Won" ? " Conv.Website " : activeFilter === "Lost" && "Lost.Website"}
                  </p>
                </div>
                
              </div>

            </div>
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
                editType={'fullRow'}
                onCellValueChanged={onCellValueChanged}
                onRowValueChanged={onRowValueChanged}
                frameworkComponents={frameworkComponents}
            />
            
          </div>
        </div>
    </div>

    <Modal show={showReviewModal} centered onHide={handleCloseReviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          // onSubmit={handleSubmit}
          >
            <Form.Group style={{marginTop: "10px"}} controlId="formName">
              <Form.Label>Review</Form.Label>
              <Form.Select 
              value={reviewValue} onChange={handleReviewChange}
              >
                <option value="">Select an Review</option>
                <option value="Pricing">Pricing</option>
                <option value="Proposal">Proposal</option>
                <option value="1st Reach">1st Reach</option>
                <option value="Invitation">Invitation</option>
              </Form.Select>
            </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseReviewModal}>Close</Button>
          <Button onClick={()=>{handleActionButtons(buttonTypeValue.type, buttonTypeValue.id)}} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

        </>
    );
}
}

export default Leads;

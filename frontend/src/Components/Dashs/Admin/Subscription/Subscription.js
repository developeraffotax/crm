/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Store } from 'react-notifications-component';
import Loader from '../../../Common/Loader/Loader';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import MyFloatingFilter from '../../../Jobs/JobPlaning/MyFloatingFilter';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';
import { Form } from 'react-bootstrap';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import secureLocalStorage from 'react-secure-storage';

var preDataUrl = axiosURL.addJobPreData;
var jobPlanningUrl = axiosURL.jobPlanning;
var JobPlaning_Update_One_Url = axiosURL.JobPlaning_Update_One_Url;
var JobPlaning_Update_Many_Url = axiosURL.JobPlaning_Update_Many_Url;







export default function Subscription() {

  const [departmentSummaryToggle, setDepartmentSummaryToggle] = useState(false)
  const [multipleRowEditToggle, setMultipleRowEditToggle] = useState(false)
  
  const [preData, setPreData] = useState([])
  const [fPreData, setFPreData] = useState([])
  const [loader, setLoader] = useState(false)
  const [gridApi, setGridApi] = useState(null);
  const [rerender, setRerender] = useState(false);

  const [multipleRowFormData, setMultipleRowFormData] = useState({
    job_date: null,
    deadline: null,
    year_end: null,
    hours: null,
    job_holder: null,
    job_status: null,
    note: null,
  })
  
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState();

  useEffect(()=>{
    const tempArr = preData
    
        const newObj = { value: null, label: 'Select' };

        tempArr.unshift(newObj);

        setPreData(tempArr)

  }, [preData])

  const getPreData = async () => {
    setLoader(true)
    try {
        const response = await axios.get(preDataUrl,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
            );
      if(response.status === 200)
      {  
        setPreData(response.data.usersSubs.map(names => {
          return { value: names._id, label: names.name };
        }));

        setFPreData(response.data.usersSubs.map(names => {
          return { value: names._id, label: names.name };
        }));

        
        setRerender(prev => !prev);
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

    
const gridRef = useRef(); // Optional - for accessing Grid's API



const [colVisibility, setColVisibility] = useState({
  comName:false,
  cliName:false,
  jHolder:false,
  job_name:false,
  hours:false,
  year_end:true,
  job_deadline:false,
  work_deadline:false,
  stat:false,
  notes:false,
  job_status:false,
  cManager:false,
  //////////////
  source: true,
  partner: true,
  fee:false,
  subscription:false,
  vat_login:true,
  payee_login:true,
  ct_login:true,
  tr_login:true,
  utr:true,
  auth_code:true,
  email:true,
  phone:true,
  country:true,
});

const {state} = useLocation();
const location = useLocation();
const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const companyNameFromUrl = queryParams.get('companyName');

const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
const [mainrowData, setMainRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
const [mainReRender, setMainReRender] = useState(false);

const [sourceFValue, setSourceFValue] = useState(null)
const [partnerFValue, setPartnerFValue] = useState(null)
const [jStatusFvalue, setJStatusFvalue] = useState(null);
const [cManagerFvalue, setCManagerFvalue] = useState(null);
const [statusFvalue, setStatusFvalue] = useState(state ? state.filterType : null);
const [departmentFvalue, setDepartmentFvalue] = useState(state ? state.departmentName : null);

const [yearEndFvalue, setYearEndFvalue] = useState(null);
const [yearEndFvalueDate, setYearEndFvalueDate] = useState(null);

const [deadlineFvalue, setDeadlineFvalue] = useState(null);
const [deadlineFvalueDate, setDeadlineFvalueDate] = useState(null);

const [jobDateFvalue, setJobDateFvalue] = useState(null);
const [jobDateFvalueDate, setJobDateFvalueDate] = useState(null);

const [jHolderFvalue, setJHolderFvalue] = useState(null);
const [subscriptionFvalue, setSubscriptionFvalue] = useState(null);

const [departmentSummaryValue, setDepartmentSummaryValue] = useState({
  weeklyDue: 0,
  weeklyOverDue: 0,
  monthlyDue: 0,
  monthlyOverDue: 0,
  quarterlyDue: 0,
  quarterlyOverDue: 0,
  yearlyDue: 0,
  yearlyOverDue: 0,
});

const [sumOfMarks, setSumOfMarks] = useState(0);





const filter = async ()=>{

  if(state)
  {
    setStatusFvalue(state ? state.filterType : null);
    setDepartmentFvalue(state ? state.departmentName : null);
  }

  // const roo = mainrowData; 
  var filteredArray = mainrowData

  var weeklyDue = 0;
  var weeklyOverDue = 0;
  var monthlyDue = 0;
  var monthlyOverDue = 0;
  var quarterlyDue = 0;
  var quarterlyOverDue = 0;
  var yearlyDue = 0;
  var yearlyOverDue = 0;


  var today = new Date();

  if(filteredArray !== undefined){
    filteredArray = await filteredArray.filter(obj => obj.client_id && obj.client_id.isActive);
  }

  if(filteredArray){
    if(filteredArray !== undefined){
        filteredArray = filteredArray.filter(obj => obj.job_name && obj.job_name === 'Billing');
      }
  }

  if(filteredArray){
    for(var arr of filteredArray){
      var deadline = new Date(arr.job_deadline)
      var yearEnd = new Date(arr.work_deadline)
  
      if(arr.subscription === "Weekly")
      {        
        
          if ( ( (yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) ) ) {
            weeklyOverDue = weeklyOverDue + 1;
            }
          else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) )) {
            weeklyDue = weeklyDue + 1; 
            } 
      }
      else if(arr.subscription === "Monthly")
      {        
        if ( ( (yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) ) )
        {
          monthlyOverDue = monthlyOverDue + 1;
        }
        else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) )) {
          monthlyDue = monthlyDue + 1;
        }

         
      }
      else if(arr.subscription === "Quarterly")
      { 
        if ( ( (yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) ) )
        {
          quarterlyOverDue = quarterlyOverDue + 1;
        }
        else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) )) {
          quarterlyDue = quarterlyDue + 1;
        }
         
      }
      else if(arr.subscription === "Yearly")
      {        
        if ( ( (yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) ) )
        {
          yearlyOverDue = yearlyOverDue + 1;
        }
        else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) )) {
          yearlyDue = yearlyDue + 1;
        } 
      }
  
    }
  }
  

  setDepartmentSummaryValue(prevState => ({
    ...prevState,
    weeklyDue,
    weeklyOverDue,
    monthlyDue,
    monthlyOverDue,
    quarterlyDue,
    quarterlyOverDue,
    yearlyDue,
    yearlyOverDue
}));

  // JobStatus Filter
  if(filteredArray !== undefined && jStatusFvalue !== null && jStatusFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_status && obj.job_status === jStatusFvalue);
  }
  // Source Filter
  if(filteredArray !== undefined && sourceFValue !== null && sourceFValue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.client_id && obj.client_id.source === sourceFValue);
  }

  // C Manger Filter
  if(filteredArray !== undefined && cManagerFvalue !== null && cManagerFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.manager_id && obj.manager_id.name === cManagerFvalue);
  }

  //status Filter
  if(filteredArray !== undefined && statusFvalue !== null && statusFvalue !== ""){

    filteredArray = filteredArray.filter(obj => {
      if (obj.job_deadline && obj.year_end) {

        const deadline = new Date(obj.job_deadline);
        const yearEnd = new Date(obj.year_end);
        var today = new Date();


        if (((yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)))) {
          if (statusFvalue === "Overdue")
            return obj;
        }
        else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))))) {
          if (statusFvalue === "Due")
            return obj;
        }

      }
    });
    
  }

 // Client Name
 if (filteredArray !== undefined && companyNameFromUrl !== null && companyNameFromUrl !== "") {
  filteredArray = await filteredArray.filter(obj => obj.client_id && obj.client_id.company_name === companyNameFromUrl);
}

  // Department Filter
  if(filteredArray !== undefined && departmentFvalue !== null && departmentFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_name && obj.job_name === departmentFvalue);
  }

  // Job Holder Filter
  if(filteredArray !== undefined && jHolderFvalue !== null && jHolderFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_holder_id && obj.job_holder_id.name === jHolderFvalue);
  }

  // Subscription Filter
  if(filteredArray !== undefined && subscriptionFvalue !== null && subscriptionFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.subscription && obj.subscription === subscriptionFvalue);
  }

  //YearEnd
  if(yearEndFvalue){

    // Year End Expired Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "Expired"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.year_end)
        if(obj.year_end && obj.year_end !== 'Invalid Date'){
          if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    // Year End Today Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "Today"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.year_end)
        if(obj.year_end && obj.year_end !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    // Year End Tomorrow Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "Tomorrow"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const deadline = new Date(obj.year_end)
        if(obj.year_end && obj.year_end !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }


    // Year End 7 days Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "In 7 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.year_end)
        const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
        if(obj.year_end && obj.year_end !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    // Year End 15 days Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "In 15 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.year_end)
        const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
        if(obj.year_end && obj.year_end !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }
    
    // Year End Month Wise Filter
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "Month Wise"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        // const today = new Date()
        var today = new Date(yearEndFvalueDate)
        const deadline = new Date(obj.year_end)
        if (obj.year_end && obj.year_end !== 'Invalid Date') {
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
    if(filteredArray !== undefined && yearEndFvalue !== null && yearEndFvalue !== "" && yearEndFvalue === "Custom"){
      filteredArray = await filteredArray.filter(obj => {
        var cellDate = obj.year_end !== "" && new Date(obj.year_end);
        var filterDate = new Date(yearEndFvalueDate)
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

  //Deadline
  if(deadlineFvalue){

    //Deadline Expired Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "Expired"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.job_deadline)
        if(obj.job_deadline && obj.job_deadline !== 'Invalid Date'){
          if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Deadline Today Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "Today"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.job_deadline)
        if(obj.job_deadline && obj.job_deadline !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Deadline Tomorrow Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "Tomorrow"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const deadline = new Date(obj.job_deadline)
        if(obj.job_deadline && obj.job_deadline !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }


    //Deadline 7 days Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "In 7 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.job_deadline)
        const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
        if(obj.job_deadline && obj.job_deadline !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Deadline 15 days Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "In 15 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.job_deadline)
        const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
        if(obj.job_deadline && obj.job_deadline !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Deadline Month Wise Filter
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "Month Wise"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        // const today = new Date()
        var today = new Date(deadlineFvalueDate)
        const deadline = new Date(obj.job_deadline)
        if (obj.job_deadline && obj.job_deadline !== 'Invalid Date') {
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
    if(filteredArray !== undefined && deadlineFvalue !== null && deadlineFvalue !== "" && deadlineFvalue === "Custom"){
      filteredArray = await filteredArray.filter(obj => {
        var cellDate = obj.job_deadline !== "" && new Date(obj.job_deadline);
        var filterDate = new Date(deadlineFvalueDate)
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

  //JobDate
  if(jobDateFvalue){

    //Job Date Expired Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Expired"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.work_deadline)
        if(obj.work_deadline && obj.work_deadline !== 'Invalid Date'){
          if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Job Date Today Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Today"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.work_deadline)
        if(obj.work_deadline && obj.work_deadline !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Job Date Tomorrow Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Tomorrow"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const deadline = new Date(obj.work_deadline)
        if(obj.work_deadline && obj.work_deadline !== 'Invalid Date'){
          if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }


    //Job Date 7 days Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "In 7 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.work_deadline)
        const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
        if(obj.work_deadline && obj.work_deadline !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Job Date 15 days Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "In 15 days"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        const today = new Date()
        const deadline = new Date(obj.work_deadline)
        const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
        if(obj.work_deadline && obj.work_deadline !== 'Invalid Date'){
          if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
            return obj;
          }
        }
      });
    }

    //Job Date Month Wise Filter
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Month Wise"){
      filteredArray = await filteredArray.filter(obj => {
        // obj.manager_id && obj.manager_id.name === cManagerFvalue
        // const today = new Date()
        var today = new Date(jobDateFvalueDate)
        const deadline = new Date(obj.work_deadline)
        if (obj.work_deadline && obj.work_deadline !== 'Invalid Date') {
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
    if(filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Custom"){
      filteredArray = await filteredArray.filter(obj => {
        var cellDate = obj.work_deadline !== "" && new Date(obj.work_deadline);
        var filterDate = new Date(jobDateFvalueDate)
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

  if(filteredArray){
    var summ = 0;
    filteredArray.forEach((item) => {summ = +summ + +item.fee})
    setSumOfMarks(summ);
  }

  setRowData(filteredArray)
  
}


useEffect(()=>{
  setRowData(mainrowData)
  filter()
  
  
},[statusFvalue, sourceFValue, subscriptionFvalue, jStatusFvalue, cManagerFvalue, departmentFvalue, jHolderFvalue, yearEndFvalue, yearEndFvalueDate, deadlineFvalue, deadlineFvalueDate, jobDateFvalue, jobDateFvalueDate, mainrowData])



// DefaultColDef sets props common to all Columns
const defaultColDef = useMemo( ()=> ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    editable: true,
    resizable: true
  }));

// Example of consuming Grid Event
const cellClickedListener = useCallback( event => {
}, []);

function handleMenuClick(e) {
  // Prevent the default behavior of the click event
  e.preventDefault();

  // Stop the click event from propagating to the dropdown menu
  e.stopPropagation();
}

// Example load data from sever
useEffect(() => {
  fetch(jobPlanningUrl)
    .then(result => result.json())
    .then(rowData => {
      setMainRowData(rowData);
      Promise.all([
        getPreData(),
        handleColHideOnStart(),
      ]);
    });
}, [mainReRender]);

useEffect(()=>{
  if(gridApi){
    handleColHideOnStart();
  }
}, [gridApi])

const handleFunClear = ()=>{
  navigate(location.pathname);
  if(gridApi){
    gridApi.api.setFilterModel({});
    gridApi.api.refreshHeader();
  }
    setJHolderFvalue((...prev) => null)
    setDepartmentFvalue((...prev) => null)
    setStatusFvalue((...prev) => null)
    setCManagerFvalue((...prev) => null)
    setJStatusFvalue((...prev) => null)
    setYearEndFvalue((...prev) => null)
    setYearEndFvalueDate((...prev) => null)
    setDeadlineFvalue((...prev) => null)
    setDeadlineFvalueDate((...prev) => null)
    setJobDateFvalue((...prev) => null)
    setJobDateFvalueDate((...prev) => null)
}


const handleDepartmentFilterSet = (department, status)=>{
  if(gridApi){
    setJHolderFvalue(null)
    setDepartmentFvalue(null)
    setStatusFvalue(null)
    setCManagerFvalue(null)
    setJStatusFvalue(null)
    setYearEndFvalue(null)
    setYearEndFvalueDate(null)
    setDeadlineFvalue(null)
    setDeadlineFvalueDate(null)
    setJobDateFvalue(null)
    setJobDateFvalueDate(null)
    // gridApi.api.setFilterModel({});
    // gridApi.api.refreshHeader();
    setSubscriptionFvalue(department)
    setStatusFvalue(status)
  }
}


const handleMultipleRowFormDataChange = (e)=>{
e.preventDefault()
const { name, value } = e.target;
setMultipleRowFormData(prevState => ({
  ...prevState,
  [name]: value
}));
}

useEffect(()=>{
  setColumnDefs([
    {
      headerName: "Subscription#",
      filter: false,
      flex: 2.3,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      valueGetter: (params) => `Subscription# ${params.node.rowIndex + 1}`,
     
    },
    {
      headerName: "Company Name",
      field:"comName",
      flex: 2.7,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.company_name //to get value from obj inside obj
      }
    },
    {
      headerName: "Client",
      field:"cliName",
      flex: 2,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.client_name //to get value from obj inside obj
      }
      // valueFormatter: p => {
      //   return "$ " + p.value
      // }
    },
    {
      headerName: "Job Holder",
      field:"jHolder",
      flex: 1.5,
      valueGetter: p => {
        return p.data.job_holder_id !== null ? p.data.job_holder_id.name : p.data.job_holder_name //to get value from obj inside obj
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: preData.map(option => option.label),
      },  
      onCellValueChanged: function(event) {
      },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: fPreData.map(option => option.label),
        onValueChange:(value) => setJHolderFvalue(value),
        value: jHolderFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      }
    },
    {
      headerName: "Department",
      field: 'job_name',
      flex: 1.5,
      editable: false,
      hide: true,
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ["Bookkeeping", "Payroll", "Vat Return", "Accounts", "Personal Tax", "Company Sec", "Address", "Billing"],
        onValueChange:(value) => setDepartmentFvalue(value),
        value: departmentFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
  
    },
    
    {
      headerName: "Start Date",
      field: 'year_end',
      // filter: 'agDateColumnFilter',
      // filterParams: filterParams,
      floatingFilterComponent: 'selectFloatingFilterWthDate', 
      floatingFilterComponentParams: { 
        options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
        onValueChange:(value) => setYearEndFvalue(value),
        value: yearEndFvalue,
        onDateValueChange:(value) => setYearEndFvalueDate(value),
        dateValue: yearEndFvalueDate,
        suppressFilterButton: true, 
        suppressInput: true 
      },
      flex: 1.5,
      cellEditorFramework: 'agCellEditorDatePicker',
      valueGetter: p => {
        if(p.data.year_end && p.data.year_end !== "Invalid Date")
        {
          
          const deadline = new Date(p.data.year_end)
          let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
          return(`${da}-${mo}-${ye}`);
          }
          else{
            return ""
        }    
      },
    },
    {
      headerName: "Billing Start",
      field: 'job_deadline',
      // filter: 'agDateColumnFilter',
      // filterParams: filterParams,
      floatingFilterComponent: 'selectFloatingFilterWthDate', 
      floatingFilterComponentParams: { 
        options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
        onValueChange:(value) => setDeadlineFvalue(value),
        value: deadlineFvalue,
        onDateValueChange:(value) => setDeadlineFvalueDate(value),
        dateValue: deadlineFvalueDate,
        suppressFilterButton: true, 
        suppressInput: true 
      },
      flex: 1.5,
      cellEditorFramework: 'agCellEditorDatePicker',
      valueGetter: p => {
        if(p.data.job_deadline && p.data.job_deadline !== "Invalid Date")
        {
          const deadline = new Date(p.data.job_deadline)
          let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
          return(`${da}-${mo}-${ye}`);
        }
        else{
          return ""
        }
      },
      cellStyle:(params)=>{
        const today = new Date()
        const deadline = new Date(params.value)
        if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "red"}
        }
        if((deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "black"}
        }
      },
    },
    {
      headerName: "Billing End",
      field: 'year_end',
      floatingFilterComponent: 'selectFloatingFilterWthDate', 
      floatingFilterComponentParams: { 
        options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
        onValueChange:(value) => setYearEndFvalue(value),
        value: yearEndFvalue,
        onDateValueChange:(value) => setYearEndFvalueDate(value),
        dateValue: yearEndFvalueDate,
        suppressFilterButton: true, 
        suppressInput: true 
      },
      flex: 1.5,
      cellEditorFramework: 'agCellEditorDatePicker',
      valueGetter: p => {
        if(p.data.year_end && p.data.year_end !== "Invalid Date")
        {
          const deadline = new Date(p.data.year_end)
          let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
          return(`${da}-${mo}-${ye}`);
        }
        else{
          return ""
        }
      },
      cellStyle:(params)=>{
        const today = new Date()
        const deadline = new Date(params.value)
        if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "red"}
        }
        if((deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "black"}
        }
      },
    },
    {
      headerName: "Deadline",
      field: 'work_deadline',
      // filter: 'agDateColumnFilter',
      // filterParams: filterParams,
      floatingFilterComponent: 'selectFloatingFilterWthDate', 
      floatingFilterComponentParams: { 
        options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
        onValueChange:(value) => setJobDateFvalue(value),
        value: jobDateFvalue,
        onDateValueChange:(value) => setJobDateFvalueDate(value),
        dateValue: jobDateFvalueDate,
        suppressFilterButton: true, 
        suppressInput: true 
      },
      flex: 1.5,
      editable: true,
      valueGetter: p => {
        if(p.data.work_deadline  && p.data.work_deadline !== "Invalid Date")
        {
          const deadline = new Date(p.data.work_deadline)
          let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
          return(`${da}-${mo}-${ye}`);
        }
        else{
          return ""
        }
      },
      cellStyle:(params)=>{
        const today = new Date()
        const deadline = new Date(params.value)
        if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "red"}
        }
        if((deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
          return{color: "black"}
        }
      },
      // cellEditorFramework: AgDatePicker,
    },
    {
      headerName: "Status",
      field:"stat",
      flex: 1.5,
      editable: false,
      valueGetter: p => {
        const deadline = new Date(p.data.job_deadline)
        const yearEnd = new Date(p.data.year_end)
        var today = new Date();

        if( !p.data.job_deadline || !p.data.job_deadline )
        {
          return " "
        }
        else{
          if ( ( (yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) ) ) {
            return "Overdue"
          }
          else if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) || (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) )) {
            return "Due";
          }

        }
        
      },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['Overdue', 'Due'],
        onValueChange:(value) => setStatusFvalue(value),
        value: statusFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      }
    },
    {
        headerName: "Fee",
        field:"fee",
        flex: 1,
        editable: true,
    },
    {
      headerName: "Source",
      field: "source",
      flex: 1,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.source //to get value from obj inside obj
      },
      floatingFilterComponent: 'selectFloatingFilter',
      floatingFilterComponentParams: {
        options: ['FIV', 'UPW', 'PPH', 'Website', 'Referal', 'Partner'],
        onValueChange: (value) => setSourceFValue(value),
        value: sourceFValue,
        suppressFilterButton: true,
        suppressInput: true
      }
    },
    {
      headerName: "Partner",
      field: "partner",
      flex: 1.2,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.partner //to get value from obj inside obj
      },
      floatingFilterComponent: 'selectFloatingFilter',
      floatingFilterComponentParams: {
        options: ['Affotax', 'Outsource', 'OTL'],
        onValueChange: (value) => setPartnerFValue(value),
        value: partnerFValue,
        suppressFilterButton: true,
        suppressInput: true
      }
    },
    {
      headerName: "Note",
      field: 'notes',
      flex: 6,
    },
    {
      headerName: "Job Status",
      field: 'job_status',
      flex: 1.3,
      valueGetter: p => {
        return p.data.job_status === "Select" ? "" : p.data.job_status
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ["Select", 'Data', 'Progress', 'Queries', 'Approval', 'Submission'] },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['Data', 'Progress', 'Queries', 'Approval', 'Submission'],
        onValueChange:(value) => setJStatusFvalue(value),
        value: jStatusFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
      },
    {
      headerName: "Manager",
      field:"cManager",
      flex: 1.5 ,
      valueGetter: p => {
        return p.data.manager_id !== null ? p.data.manager_id.name : p.data.manager_id_name //to get value from obj inside obj
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: preData.map(option => option.label),
      },  
      onCellValueChanged: function(event) {

      },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: fPreData.map(option => option.label),
        onValueChange:(value) => setCManagerFvalue(value),
        value: cManagerFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
    },
    {
      headerName: "Subscription",
      field:"subscription",
      flex: 2,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values:['Weekly', 'Monthly', 'Quarterly', 'Yearly'] },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'],
        onValueChange:(value) => setSubscriptionFvalue(value),
        value: subscriptionFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
    },

    ///////////
    {
      headerName: "Vat Login",
      field:"vat_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Vat Return"){
          return p.data.client_id.vat_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "PAYE Login",
      field:"payee_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Payroll"){
          return p.data.client_id.paye_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "CT Login",
      field:"ct_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Accounts"){
          return p.data.client_id.ct_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "TR Login",
      field:"tr_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Personal Tax"){
          return p.data.client_id.tr_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "UTR",
      field:"utr",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.utr //to get value from obj inside obj
      },
    },
    {
      headerName: "Auth Code",
      field:"auth_code",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.auth_code //to get value from obj inside obj
      },
    },
    {
      headerName: "Email",
      field:"email",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.email //to get value from obj inside obj
      },
      editable: false,
    },
    {
      headerName: "Phone",
      field:"phone",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.phone //to get value from obj inside obj
      },
    },
    {
      headerName: "Country",
      field:"country",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.country //to get value from obj inside obj
      },
      editable: false,
    },
  //   {
  //     field: 'actions',
  //     flex: 1,
  //     editable: false,
  //     filter: false,
  //     cellRendererFramework: ()=><div>
  //       <button className='btn btn-danger h1'> delete</button>
  //     </div>
  //   }
  ])

}, [rerender])


//Row Id
const getRowId = useCallback(params => {
  return params.data._id
})

// const deleteHandler = ()=> {
//   const selectedNodes = gridRef.current.api.getSelectedNodes();
//   const selectedIds = selectedNodes.map(node => node.data.id);
//   //Delete api here
//   //set table data without reloading
// }

const onCellValueChanged = useCallback((event) => {
  if(event.colDef.field === "jHolder"){
    const selectedOption = preData.find(option => option.label === event.data.jHolder);
    event.data.jHolder = selectedOption ? selectedOption.value : '';
    event.data.job_holder_id ? event.data.job_holder_id.name = selectedOption ? selectedOption.label : '' : event.data.job_holder_name = selectedOption && selectedOption.label !=="Select" ? selectedOption.label : '' ;
  }
  if(event.colDef.field === 'cManager')
  {
    const selectedOption = preData.find(option => option.label === event.data.cManager);
    event.data.cManager = selectedOption ? selectedOption.value : '';
    event.data.manager_id ? event.data.manager_id.name = selectedOption ? selectedOption.label : '' : event.data.manager_id_name = selectedOption && selectedOption.label !=="Select" ? selectedOption.label : '' ;
  }
}, [gridApi]);



const onRowValueChanged = useCallback(async (event) => {
  var data = event.data;
  
  const token = secureLocalStorage.getItem('token')
  await axios.post(JobPlaning_Update_One_Url, 
    {
      _id: data._id,
      job_holder_id: data.jHolder,
      hours: data.hours,
      year_end: data.year_end,
      job_deadline: data.job_deadline,
      work_deadline: data.work_deadline,
      notes: data.notes,
      job_status: data.job_status,
      manager_id: data.cManager,
      subscription: data.subscription,

      fee: data.fee,
      client_id: data.client_id._id,
      vat_login: data.vat_login,
      paye_login: data.paye_login,
      ct_login: data.ct_login,
      tr_login: data.tr_login,
      utr: data.utr,
      auth_code: data.auth_code,
      email: data.email,
      phone: data.phone,
    },
    {
      headers:{ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
       }
    }
  );
  
  setRerender(prev => !prev)


}, []);

const onPageSizeChanged = useCallback(() => {
  var value = document.getElementById('page-size').value;
  gridRef.current.api.paginationSetPageSize(Number(value));
}, []);



  async function onGridReady(params) {
  setGridApi(params);
}

const handleColHideOnStart= ()=>{
  if(gridApi){
    gridApi.columnApi.setColumnVisible("year_end", false)
    gridApi.columnApi.setColumnVisible("vat_login", false)
    gridApi.columnApi.setColumnVisible("payee_login", false)
    gridApi.columnApi.setColumnVisible("ct_login", false)
    gridApi.columnApi.setColumnVisible("tr_login", false)
    gridApi.columnApi.setColumnVisible("utr", false)
    gridApi.columnApi.setColumnVisible("auth_code", false)
    gridApi.columnApi.setColumnVisible("email", false)
    gridApi.columnApi.setColumnVisible("phone", false)
    gridApi.columnApi.setColumnVisible("country", false)
    gridApi.columnApi.setColumnVisible("source", false)
    gridApi.columnApi.setColumnVisible("partner", false)
  }
  
}

const toggleColHandler = (e, name) => {
  handleMenuClick(e);
  gridApi.columnApi.setColumnVisible(name, colVisibility[name])
  setColVisibility({ ...colVisibility, [name]: !colVisibility[name] })
}

const frameworkComponents = {
  myFloatingFilter: MyFloatingFilter,
  selectFloatingFilter: DropdownFilter,
  selectFloatingFilterWthDate: DropdownFilterWithDate,
};

const handleMultipleEditSubmit = async (e)=>{
  e.preventDefault();
  const selectedNodes  = gridApi.api.getSelectedNodes();
  const selectedIds = selectedNodes.map(node => node.data._id);
  
  // JobPlaning_Update_Many_Url

  const data = {
    idToUpdate: selectedIds,
    FormData: multipleRowFormData,
  }

  const resp = await axios.post(JobPlaning_Update_Many_Url, 
    {
      data
    },
    {
      headers:{ 'Content-Type': 'application/json' }
    }
  );
  if(resp.status === 200){
    setMultipleRowFormData({
      job_date: null,
      deadline: null,
      year_end: null,
      hours: null,
      job_holder: null,
      job_status: null,
      note: null,
    });
    setMultipleRowEditToggle(false);
  setMainReRender(prev => !prev)
  }


}



const exportToExcel = (e) => {
  e.preventDefault()
  const columnDefs = gridApi.columnApi.getAllDisplayedColumns();
  const exportData = [columnDefs.map((columnDef) => columnDef.userProvidedColDef.headerName)];



  gridApi.api.forEachNodeAfterFilterAndSort((node) => {
    const rowData = columnDefs.map((columnDef) => {
      const cellValue = gridApi.api.getValue(columnDef, node);
      return cellValue !== undefined ? cellValue : '';
    });
    exportData.push(rowData);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `Jobplanning - ${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const exportToPdf = () => {
  // Get the grid column headers
  const columnDefs = gridApi.columnApi.getAllDisplayedColumns();
  const headerData = columnDefs.map((columnDef) => columnDef.userProvidedColDef.headerName);

  // Get the grid row data
  const rowData = [];
  gridApi.api.forEachNodeAfterFilterAndSort((node) => {
    const rowDataItem = columnDefs.map((columnDef) => {
      const cellValue = gridApi.api.getValue(columnDef, node);
      return cellValue !== undefined ? cellValue : '';
    });
    rowData.push(rowDataItem);
  });

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set the table headers and data
  doc.autoTable({ head: [headerData], body: rowData });

  // Save the PDF file
  doc.save(`Jobplanning - ${new Date().toISOString().slice(0, 10)}.pdf`);
};



// Export grid data to CSV
const exportToCsv = (e) => {
  e.preventDefault()
  try {
  const params = {
    sheetName: 'Grid Data',
    fileName: `Jobplanning - ${new Date().toISOString().slice(0, 10)}`,
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




if(loader){
  return(
      <Loader />
  )
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
                  Subscriptions
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

            {/* <div  className='table-col-numbers mx-2'>
              <button 
              onClick={(e)=>{e.preventDefault(); setDownloadOptionsToggle(!downloadOptionsToggle)}} 
              className='form-control'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <g id="Interface / Download">
                  <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </svg>
              </button>
            </div> */}

            <div  className='table-col-numbers mx-2'>
              <button 
              onClick={(e)=>{e.preventDefault(); setDepartmentSummaryToggle(!departmentSummaryToggle)}} 
              className='form-control'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 10.5V17.5M11.5 5.5V17.5M16 10.5V17.5M20.5 5.5V17.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            
            {/* <div  className='table-col-numbers mx-2'>
              <button 
              onClick={(e)=>{e.preventDefault(); setMultipleRowEditToggle(!multipleRowEditToggle)}} 
              className='form-control'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.75 5.5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-10zm5 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5 12a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100-2 1 1 0 000 2z"/><path d="M19.309 7.918l-2.245-2.501A.25.25 0 0117.25 5h4.49a.25.25 0 01.185.417l-2.244 2.5a.25.25 0 01-.372 0z"/></svg>
              </button>
            </div> */}

            <div className='table-show-hide mx-2'>
              <div className="dropdown">
                <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
                <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                  {/* <div className="row">
                    <div className="col-6">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "comName")}} className={`dropdown-item ${!colVisibility.comName? "" : "active"}`}  >Company Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "cliName")}} className={`dropdown-item ${!colVisibility.cliName? "" : "active"}`} >Client Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "jHolder")}} className={`dropdown-item ${!colVisibility.jHolder? "" : "active"}`} >J.Holder</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "job_name")}} className={`dropdown-item ${!colVisibility.job_name? "" : "active"}`} >Department</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "hours")}} className={`dropdown-item ${!colVisibility.hours? "" : "active"}`} >Hours</button></li> */}
                        <li><button onClick={(e) => { toggleColHandler(e, "source") }} className={`dropdown-item ${!colVisibility.source ? "" : "active"}`} >Source</button></li>
                        <li><button onClick={(e) => { toggleColHandler(e, "partner") }} className={`dropdown-item ${!colVisibility.partner ? "" : "active"}`} >Partner</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "year_end")}} className={`dropdown-item ${!colVisibility.year_end? "" : "active"}`} >First Billing Date</button></li>
                        {/* <li><button onClick={(e)=>{toggleColHandler(e, "job_deadline")}} className={`dropdown-item ${!colVisibility.job_deadline? "" : "active"}`} >Deadline</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "work_deadline")}} className={`dropdown-item ${!colVisibility.work_deadline? "" : "active"}`} >Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "stat")}} className={`dropdown-item ${!colVisibility.stat? "" : "active"}`} >Status</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "notes")}} className={`dropdown-item ${!colVisibility.notes? "" : "active"}`} >Note</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "job_status")}} className={`dropdown-item ${!colVisibility.job_status? "" : "active"}`} >J.Status</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "cManager")}} className={`dropdown-item ${!colVisibility.cManager? "" : "active"}`} >Lead</button></li>
                      </ul>
                    </div>
                    <div className="col-6">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "fee")}} className={`dropdown-item ${!colVisibility.fee? "" : "active"}`}  >Fee</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "subscription")}} className={`dropdown-item ${!colVisibility.subscription? "" : "active"}`}>Subscription</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "vat_login")}} className={`dropdown-item ${!colVisibility.vat_login? "" : "active"}`} >Vat Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "payee_login")}} className={`dropdown-item ${!colVisibility.payee_login? "" : "active"}`} >PAYEE Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "ct_login")}} className={`dropdown-item ${!colVisibility.ct_login? "" : "active"}`} >CT Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "tr_login")}} className={`dropdown-item ${!colVisibility.tr_login? "" : "active"}`} >TR Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "utr")}} className={`dropdown-item ${!colVisibility.utr? "" : "active"}`} >UTR</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "auth_code")}} className={`dropdown-item ${!colVisibility.auth_code? "" : "active"}`} >Auth Code</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "email")}} className={`dropdown-item ${!colVisibility.email? "" : "active"}`} >Email</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "phone")}} className={`dropdown-item ${!colVisibility.phone? "" : "active"}`} >Phone</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "country")}} className={`dropdown-item ${!colVisibility.country? "" : "active"}`} >Country</button></li>
                      </ul>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>

            <div  className='table-show-hide mx-2'>
              <button type="button" onClick={handleFunClear} 
              className=' btn' 
              style={{
                  padding: '3px',
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(242, 244, 246)',
                  color: 'rgb(89, 89, 89)',
              }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" stroke='rgb(89, 89, 89)' fill="rgb(89, 89, 89)">
                      <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
              </button>
            </div>


          </div>


          <div >
          <Link onClick={exportToExcel} style={{
                backgroundColor: 'transparent',
                color: 'black',
                borderColor: 'lightgray',
                alignSelf: 'center',
              }} className='btn btn-primary mx-2'>
                  Excel
          </Link>

            <Link to="/clients/add" className=' mx-2 btn btn-primary'>
              Add Client
            </Link>
          </div>
          

        </div>

        <div className={`multipleRowEdit ${multipleRowEditToggle ? 'open' : 'closed'} `}>
          <hr style={{marginBottom: '0.1rem', color: 'rgb(131, 131, 131)',}}/>

          <div  className='p-2 m-2'>
            <form onSubmit={handleMultipleEditSubmit}>
              <div style={{alignItems: 'self-end',}} className='row'>
                <div style={{marginBottom: '15px',}} className="col-2">
                <Form.Group controlId="validationCustom03">
                  <Form.Label>Job Holder</Form.Label>
                    <Form.Select 
                    name='job_holder'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.job_holder}
                    >
                        {preData && preData.map((manager, index)=>
                            <option key={index} value={manager.value}>{manager.label}</option>
                        )}
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div style={{marginBottom: '15px',}} className="col-1">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Hours</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Hours" 
                    name='hours'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.hours}
                      />
                  </Form.Group>
                </div>
                
                <div style={{marginBottom: '15px',}} className="col-1">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Year End</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Year End" 
                    name='year_end'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.year_end}
                      />
                  </Form.Group>
                </div>
                
                <div style={{marginBottom: '15px',}} className="col-1">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Deadline</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Deadline" 
                    name='deadline'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.deadline}
                      />
                  </Form.Group>
                </div>
                
                <div style={{marginBottom: '15px',}} className="col-1">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Job Date</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Job Date" 
                    name='job_date'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.job_date}
                      />
                  </Form.Group>
                </div>
                
              
                
                <div style={{marginBottom: '15px',}} className="col-1">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Job Status</Form.Label>
                  {/* "Select", 'Data', 'Progress', 'Queries', 'Approval', 'Submission' */}
                  <Form.Select 
                    name='job_status'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.job_status}
                    >
                      <option value= 'Select'> Select</option>
                      <option value= 'Data'> Data</option>
                      <option value= 'Progress'> Progress</option>
                      <option value= 'Queries'> Queries</option>
                      <option value= 'Approval'> Approval</option>
                      <option value= 'Submission'> Submission</option>
                        
                    </Form.Select>
                  </Form.Group>
                </div>

                <div style={{marginBottom: '15px',}} className="col-4">
                  <Form.Group controlId="validationCustom03">
                  <Form.Label>Note</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Note" 
                    name='note'
                    onChange={handleMultipleRowFormDataChange}
                    value = {multipleRowFormData.note}
                      />
                  </Form.Group>
                </div>

                <div style={{marginBottom: '15px', textAlign: 'center',}} className="col-1">
                  <button style={{width: '90%',}} type='submit' className='btn btn-success'>
                    Save
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
        <div className={`departmentSummary ${departmentSummaryToggle ? 'open' : 'closed'} `}>
          <hr style={{marginBottom: '0.1rem', color: 'rgb(131, 131, 131)',}}/>

          <div  className='p-2 m-2'>
            <div >
              <p style={{fontWeight: '500',}} className='mb-3'>
                Department Summary
              </p>
              <div className='row' style={{textAlign: 'center',}}>

                    
                    <div className='col-3'>
                      <p className='mb-1'>
                        Weekly
                      </p>

                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Weekly', 'Overdue')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.weeklyOverDue}</span> Overdue
                        </p>
                      </Link>


                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Weekly', 'Due')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.weeklyDue}</span> Due
                        </p>
                      </Link>

                    </div>
                    
                    <div className='col-2'>
                      <p className='mb-1'>
                        Monthly
                      </p>

                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Monthly', 'Overdue')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.monthlyOverDue}</span> Overdue
                        </p>
                      </Link>


                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Monthly', 'Due')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.monthlyDue}</span> Due
                        </p>
                      </Link>

                    </div>
                    
                    <div className='col-2'>
                      <p className='mb-1'>
                        Quartelry
                      </p>

                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Quarterly', 'Overdue')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.quarterlyOverDue}</span> Overdue
                        </p>
                      </Link>


                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Quarterly', 'Due')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.quarterlyDue}</span> Due
                        </p>
                      </Link>

                    </div>
                    
                    <div className='col-2'>
                      <p className='mb-1'>
                        Yearly
                      </p>

                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Yearly', 'Overdue')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.yearlyOverDue}</span> Overdue
                        </p>
                      </Link>


                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('Yearly', 'Due')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.yearlyDue}</span> Due
                        </p>
                      </Link>

                    </div>
                    
                    <div className='col-3'>
                      <p className='mb-1'>
                        Total
                      </p>

                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('', 'Overdue')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.yearlyOverDue + departmentSummaryValue.quarterlyOverDue + departmentSummaryValue.monthlyOverDue + departmentSummaryValue.weeklyOverDue}</span> Overdue
                        </p>
                      </Link>


                      <Link style={{textDecoration: 'none'}} onClick={()=>{handleDepartmentFilterSet('', 'Due')}}>
                        <p>
                          <span style={{fontWeight: "700"}}>{departmentSummaryValue.yearlyDue + departmentSummaryValue.quarterlyDue + departmentSummaryValue.monthlyDue + departmentSummaryValue.weeklyDue}</span> Due
                        </p>
                      </Link>

                    </div>

                
              </div>

            </div>
          </div>
        </div>


        <div className={`downloadOptions `}>

        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

          <div style={{justifyContent: 'right',}} className='d-flex mx-2'>
            
            <p style={{
              fontSize: '12px',
              border: '1px solid #b1b0b0',
              borderRadius: '2px',
              color: '#6e6e6e',
              padding: '1px 4px 1px 4px',
              margin: '4px 2px 4px 2px',
              cursor: 'pointer',
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e3dcdc';
              e.target.style.color = 'black';
              e.target.style.border = '1px solid black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#6e6e6e';
              e.target.style.border = '1px solid #b1b0b0';
            }} onClick={exportToCsv}> CSV </p>
            
            <p style={{
              fontSize: '12px',
              border: '1px solid #b1b0b0',
              borderRadius: '2px',
              color: '#6e6e6e',
              padding: '1px 4px 1px 4px',
              margin: '4px 2px 4px 2px',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e3dcdc';
              e.target.style.color = 'black';
              e.target.style.border = '1px solid black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#6e6e6e';
              e.target.style.border = '1px solid #b1b0b0';
            }} onClick={exportToExcel}> Excel </p>
            
            <p style={{
              fontSize: '12px',
              border: '1px solid #b1b0b0',
              borderRadius: '2px',
              color: '#6e6e6e',
              padding: '1px 4px 1px 4px',
              margin: '4px 2px 4px 2px',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e3dcdc';
              e.target.style.color = 'black';
              e.target.style.border = '1px solid black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#6e6e6e';
              e.target.style.border = '1px solid #b1b0b0';
            }} onClick={exportToPdf}> PDF </p>
          
          </div>
        </div>

        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>
        
        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}
            
            <AgGridReact
                getRowId={getRowId}

                onGridReady={onGridReady}

                ref={gridRef} // Ref for accessing Grid's API

                rowData={rowData} // Row Data for Rows

                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties

                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                // rowMultiSelectWithClick = {true} //Optional - allow to select rows without hloding ctrl

                pagination = {true}
                paginationPageSize = {25}

                //  enableCellChangeFlash = {true}

                onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                editType={'fullRow'}
                onCellValueChanged={onCellValueChanged}
                onRowValueChanged={onRowValueChanged}

                suppressDragLeaveHidesColumns={true} // disable move above header to hide column
                frameworkComponents={frameworkComponents}
                />
                  <div className="fixed-row">
                    <div className="fixed-row-cell">Total Fee: {sumOfMarks.toFixed(1)}</div>
                
                    {/* Add more cells or custom content as needed */}
                  </div>
              
          </div>
        </div>
    </div>

    

    </>
  )
}
}



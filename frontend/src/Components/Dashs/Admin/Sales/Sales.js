/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link, useLocation } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { v4 as uuidv4 } from 'uuid';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Modal } from 'react-bootstrap';
import CustomAgSelectCellEditor from './CustomAgSelect';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';

var SalesgetAllUrl = axiosURL.SalesgetAllUrl;
var SalesAddOneUrl = axiosURL.SalesAddOneUrl;
var SalesDeleteOneUrl = axiosURL.SalesDeleteOneUrl;
var SalesEditOneUrl = axiosURL.SalesEditOneUrl;
var SalesEditOneNoteUrl = axiosURL.SalesEditOneNoteUrl;
var SalesEditOneMarkPaidUrl = axiosURL.SalesEditOneMarkPaidUrl;



const Sales = () => {

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const companyNameFromUrl = queryParams.get('companyName');

    const [gridApi, setGridApi] = useState(null);
  

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    const [ClientsPreData, setClientsPreData] = useState('');
    const [coaPreData, setCoaPreData] = useState('');
    const [usersForJobHolder, setUsersForJobHolder] = useState([]);
    const [modelType, setModelType] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [totalSales, setTotalSales] = useState(0)
    const [companiesNames, setCompaniesNames] = useState([])

    const [ saleData, setSaleData ] = useState({
      to: "",
      date: "", 
      dueDate: "",
      jobDate: "",
      invoiceNo: '1',
      currency: "GBP",
      status: "Due",
      source: "",
      company_id: ""

    })

    const [itemsRowData, setItemsRowData] = useState([
      {
        unique_id: uuidv4(),
        description: '',
        qty: '',
        unit_price: '',
        discount_percentage: '',
        account: '',
        tax_rate: '',
        amount: '',
        product: ""
      }
    ]);

    const [itemsTotalSec, setItemsTotalSec] = useState({
        subTotal: 0,
        tax: 0,
        total: 0,
        disc: 0,
      }
    );

    const [activeFilter, setActiveFilter] = useState("Active")

    const [addSaleIsOpen, setAddSaleIsOpen] = useState(false)
    
    
    const [jHolderFvalue, setJHolderFvalue] = useState('')
    const [dateFvalue, setDateFvalue] = useState('')
    const [dateFvalueDate, setDateFvalueDate] = useState('')
    const [dueDateFvalue, setDueDateFvalue] = useState('')
    const [dueDateFvalueDate, setDueDateFvalueDate] = useState('')
    const [jobDateFvalue, setJobDateFvalue] = useState('')
    const [jobDateFvalueDate, setJobDateFvalueDate] = useState('')
    const [paidDateFvalue, setPaidDateFvalue] = useState('')
    const [paidDateFvalueDate, setPaidDateFvalueDate] = useState('')
    const [statusFvalue, setStatusFvalue] = useState('')
    const [sourceFvalue, setSourceFvalue] = useState('')


    const gridRef = useRef();


    const handleFilters = async ()=>{

      var filteredArray = mainRowData

      // // JobStatus Filter
      // if(filteredArray !== undefined && activeFilter !== null && activeFilter !== "" && activeFilter === "Active"){
      //   filteredArray = filteredArray.filter(obj => obj.isActive === true);
      // }

      // companyName Filter
      if(filteredArray !== undefined && companyNameFromUrl !== null && companyNameFromUrl !== ""){
        filteredArray = filteredArray.filter(obj => obj.client_id && obj.client_id.company_name === companyNameFromUrl);
      }


      if(filteredArray !== undefined && statusFvalue !== null && statusFvalue !== "" ){
        filteredArray = filteredArray.filter(obj => obj.status === statusFvalue);
      }

      if(filteredArray !== undefined && jHolderFvalue !== null && jHolderFvalue !== "" ){
        filteredArray = filteredArray.filter(obj => obj.jobHolder === jHolderFvalue);
      }

      if(filteredArray !== undefined && sourceFvalue !== null && sourceFvalue !== "" ){
        filteredArray = filteredArray.filter(obj => obj.source === sourceFvalue);
      }


      //Date
    if (dateFvalue) {

      // Year End Expired Filter
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "Expired") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "Today") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "Tomorrow") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "In 7 days") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "In 15 days") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "Month Wise") {
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
      if (filteredArray !== undefined && dateFvalue !== null && dateFvalue !== "" && dateFvalue === "Custom") {
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

    //Due Date
    if (dueDateFvalue) {

      //Deadline Expired Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "Expired") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.due_date)
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
            if (!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Today Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "Today") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.due_date)
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Tomorrow Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "Tomorrow") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.due_date)
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }


      //Deadline 7 days Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "In 7 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.due_date)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline 15 days Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "In 15 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.due_date)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Deadline Month Wise Filter
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "Month Wise") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(dueDateFvalueDate)
          const deadline = new Date(obj.due_date)
          if (obj.due_date && obj.due_date !== 'Invalid Date') {
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
      if (filteredArray !== undefined && dueDateFvalue !== null && dueDateFvalue !== "" && dueDateFvalue === "Custom") {
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.due_date !== "" && new Date(obj.due_date);
          var filterDate = new Date(dueDateFvalueDate)
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Expired") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Today") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Tomorrow") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "In 7 days") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "In 15 days") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Month Wise") {
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
      if (filteredArray !== undefined && jobDateFvalue !== null && jobDateFvalue !== "" && jobDateFvalue === "Custom") {
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

    //Paid Date
    if (paidDateFvalue) {

      //Job Date Expired Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "Expired") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.paidDate)
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
            if (!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Today Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "Today") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.paidDate)
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Tomorrow Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "Tomorrow") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const deadline = new Date(obj.paidDate)
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
            if ((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }


      //Job Date 7 days Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "In 7 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.paidDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date 15 days Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "In 15 days") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          const today = new Date()
          const deadline = new Date(obj.paidDate)
          const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
            if ((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))) {
              return obj;
            }
          }
        });
      }

      //Job Date Month Wise Filter
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "Month Wise") {
        filteredArray = await filteredArray.filter(obj => {
          // obj.manager_id && obj.manager_id.name === cManagerFvalue
          // const today = new Date()
          var today = new Date(paidDateFvalueDate)
          const deadline = new Date(obj.paidDate)
          if (obj.paidDate && obj.paidDate !== 'Invalid Date') {
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
      if (filteredArray !== undefined && paidDateFvalue !== null && paidDateFvalue !== "" && paidDateFvalue === "Custom") {
        filteredArray = await filteredArray.filter(obj => {
          var cellDate = obj.paidDate !== "" && new Date(obj.paidDate);
          var filterDate = new Date(paidDateFvalueDate)
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

      var totalSaleValue = 0;
      filteredArray.forEach(val => {
        totalSaleValue = totalSaleValue + +val.total;
      })

      setTotalSales(totalSaleValue);

      setRowData(filteredArray)

    }


    useEffect(()=>{
      setRowData(mainRowData)
      handleFilters()
    },[mainRowData, activeFilter, dateFvalue, dateFvalueDate, dueDateFvalue, dueDateFvalueDate, jobDateFvalue, jobDateFvalueDate, statusFvalue, paidDateFvalue, paidDateFvalueDate, jHolderFvalue, sourceFvalue])

    const handleFunClear = () => {
      if (gridApi) {
        gridApi.api.setFilterModel({});
        gridApi.api.refreshHeader();
      }
      setActiveFilter(null); 
      setDateFvalue(null); 
      setDateFvalueDate(null); 
      setDueDateFvalue(null); 
      setDueDateFvalueDate(null); 
      setJobDateFvalue(null); 
      setJobDateFvalueDate(null); 
      setStatusFvalue(null); 
      setPaidDateFvalue(null); 
      setPaidDateFvalueDate(null); 
      setJHolderFvalue(null); 
      setSourceFvalue(null);
    }


    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(SalesgetAllUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setMainRowData(response.data.sales)
                setCompaniesNames(response.data.companies)
                setClientsPreData(response.data.clients)
                setCoaPreData(response.data.COA)
                setUsersForJobHolder(response.data.users)
                setSaleData(prevState => ({
                  ...prevState,
                  invoiceNo: response.data.invoice_no
                }));
                setInvoiceNumber(response.data.invoice_no)
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

    const beforeAddModelHandler = ()=>{
      setSaleData({
        to: "",
        date: "", 
        dueDate: "",
        jobDate: "",
        invoiceNo: invoiceNumber,
        currency: "GBP",
        status: "Due",
        source: "",
        company_id: ""
  
      })
      setItemsRowData([
        {
          unique_id: uuidv4(),
          description: '',
          qty: '',
          unit_price: '',
          discount_percentage: '',
          account: '',
          tax_rate: '',
          amount: '',
          product: ""
        }
      ]);
      setItemsTotalSec({
        subTotal: 0,
        tax: 0,
        total: 0,
        disc: 0,
      });
      setModelType("New");
      setAddSaleIsOpen(!addSaleIsOpen)
    }

    const handleFormSubmit = (e)=>{
      e.preventDefault();
     if(modelType === "New"){
       handleAddSale();
    }else{
       handleActionButtons('Edit', saleData._id);
     }
    }

    
    const beforeEditModelHandler =(data)=>{

      setSaleData({
        to: data.client_id._id,
        date: data.date, 
        dueDate: data.due_date,
        jobDate: data.jobDate,
        invoiceNo: data.invoice_no,
        currency: data.currency,
        status: data.status,
        _id: data._id,
        source: data.source,
        company_id: data.company_id
  
      })
  
      data.saleitem_id && setItemsRowData(data.saleitem_id);
  
      setItemsTotalSec({
          subTotal: +data.subtotal,
          tax: +data.tax,
          total: +data.total,
          disc: +data.discount,
        }
      );

      
      setAddSaleIsOpen(!addSaleIsOpen)
    }
    
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
        { headerName: 'Invoice No', field: 'invoice_no', flex:0.8 },
        { headerName: 'Client Name', field: 'book_start_date', flex:1,
          valueGetter: p => {
              return p.data.client_id.client_name //to get value from obj inside obj
          },  
        },
        
        { headerName: 'Company Name', field: 'company_name', flex:2,
          valueGetter: p => {
              return p.data.client_id.company_name //to get value from obj inside obj
          },  
        },
        
        
        { 
          headerName: 'Job Holder', 
          field: 'jobHolder', 
          flex:1.2,
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: usersForJobHolder.map(option => option.name),
          },
          floatingFilterComponent: 'selectFloatingFilter',
          floatingFilterComponentParams: {
            options: usersForJobHolder.map(option => option.name),
            onValueChange: (value) => setJHolderFvalue(value),
            value: jHolderFvalue,
            suppressFilterButton: true,
            suppressInput: true
          }
           
        },


        { headerName: 'Date', field: 'date', flex:1.5,
        valueGetter: p => {
          if(p.data.date  && p.data.date !== "Invalid Date")
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
        { headerName: 'Due Date', field: 'due_date', flex:1.5, 
        valueGetter: p => {
          if(p.data.due_date  && p.data.due_date !== "Invalid Date")
          {
            const deadline = new Date(p.data.due_date)
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
          onValueChange: (value) => setDueDateFvalue(value),
          value: dueDateFvalue,
          onDateValueChange: (value) => setDueDateFvalueDate(value),
          dateValue: dueDateFvalueDate,
          suppressFilterButton: true,
          suppressInput: true
        },
        },
        { headerName: 'Paid Date', field: 'paidDate', flex:1.5, 
        valueGetter: p => {
          if(p.data.status === "Paid")
          {
            if(p.data.paidDate  && p.data.paidDate !== "Invalid Date")
            {
              const deadline = new Date(p.data.paidDate)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye}`);
            }
            else{
              return ""
            }
          }
          else{
            return ""
          }
        },
        floatingFilterComponent: 'selectFloatingFilterWthDate',
        floatingFilterComponentParams: {
          options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
          onValueChange: (value) => setPaidDateFvalue(value),
          value: paidDateFvalue,
          onDateValueChange: (value) => setPaidDateFvalueDate(value),
          dateValue: paidDateFvalueDate,
          suppressFilterButton: true,
          suppressInput: true
        },
        },
        { headerName: 'Job Date', field: 'jobDate', flex:1.5, 
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
          flex:4,
          editable: true,
        },
        { 
          headerName: 'Amount', 
          field: 'total', 
          flex:1,
        },
        { 
          headerName: 'Status', 
          field: 'status', 
          flex:1,
          floatingFilterComponent: 'selectFloatingFilter',
          floatingFilterComponentParams: {
            options: ['Paid', 'Due', 'Overdue'],
            onValueChange: (value) => setStatusFvalue(value),
            value: statusFvalue,
            suppressFilterButton: true,
            suppressInput: true
          }
        },
        { 
          headerName: 'Source', 
          field: 'source', 
          flex:1,
          floatingFilterComponent: 'selectFloatingFilter',
          floatingFilterComponentParams: {
            options: ['FIV', 'UPW', 'PPH', 'Website', 'Referal', 'Partner'],
            onValueChange: (value) => setSourceFvalue(value),
            value: sourceFvalue,
            suppressFilterButton: true,
            suppressInput: true
          }
        },
        {
            headerName: 'Action', 
            field: 'actions',
            floatingFilter: false,
            flex:2,
            cellRendererFramework: (params)=>
            // <>
            //     <div>
            //         <Link to={'/client/' + params.data._id} className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
            //         <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</Link>
            //     </div> 
            // </>
            <>
              {params.data.status !== "Paid" && 
                <Link onClick={()=>{handleActionButtons('MarkPaid', params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                  <svg width="20px" height="20px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#000000" stroke-width="4.8"> <path opacity="0.5" d="M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z" stroke="#000000" stroke-width="0.624"></path> <path d="M9.5 10.4L10.9286 12L14.5 8" stroke="#000000" stroke-width="0.624" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7.5 15.5H16.5" stroke="#000000" stroke-width="0.624" stroke-linecap="round"></path> </g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z" stroke="#000000" stroke-width="0.624"></path> <path d="M9.5 10.4L10.9286 12L14.5 8" stroke="#000000" stroke-width="0.624" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7.5 15.5H16.5" stroke="#000000" stroke-width="0.624" stroke-linecap="round"></path> </g></svg>
                </Link>
              }

              <Link to={`/tickets?company_name=${params.data.client_id.company_name}&client_name=${params.data.client_id.client_name}`} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px'}}>
                <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>ticket-blank</title> <path d="M30 13.75c0.414-0 0.75-0.336 0.75-0.75v0-5c-0-0.414-0.336-0.75-0.75-0.75h-28c-0.414 0-0.75 0.336-0.75 0.75v0 5c0 0.414 0.336 0.75 0.75 0.75v0c1.243 0 2.25 1.007 2.25 2.25s-1.007 2.25-2.25 2.25v0c-0.414 0-0.75 0.336-0.75 0.75v0 5c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-5c-0-0.414-0.336-0.75-0.75-0.75v0c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25v0zM29.25 19.674v3.576h-26.5v-3.576c1.724-0.361 3-1.869 3-3.674s-1.276-3.313-2.975-3.67l-0.024-0.004v-3.576h26.5v3.576c-1.724 0.361-3 1.869-3 3.674s1.276 3.313 2.975 3.67l0.024 0.004z"></path> </g></svg>
              </Link>


              <Link onClick={()=>{setModelType("View"); beforeEditModelHandler(params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 52 52" enable-background="new 0 0 52 52">
                  <g>
                    <path d="M51.8,25.1C47.1,15.6,37.3,9,26,9S4.9,15.6,0.2,25.1c-0.3,0.6-0.3,1.3,0,1.8C4.9,36.4,14.7,43,26,43   s21.1-6.6,25.8-16.1C52.1,26.3,52.1,25.7,51.8,25.1z M26,37c-6.1,0-11-4.9-11-11s4.9-11,11-11s11,4.9,11,11S32.1,37,26,37z"/>
                    <path d="M26,19c-3.9,0-7,3.1-7,7s3.1,7,7,7s7-3.1,7-7S29.9,19,26,19z"/>
                  </g>
                </svg>
              </Link>

              <Link to="/view/invoice" state = {{ data: params.data }} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V11C20.6569 11 22 12.3431 22 14V18C22 19.6569 20.6569 21 19 21H5C3.34314 21 2 19.6569 2 18V14C2 12.3431 3.34315 11 5 11V5ZM5 13C4.44772 13 4 13.4477 4 14V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V14C20 13.4477 19.5523 13 19 13V15C19 15.5523 18.5523 16 18 16H6C5.44772 16 5 15.5523 5 15V13ZM7 6V12V14H17V12V6H7ZM9 9C9 8.44772 9.44772 8 10 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H10C9.44772 10 9 9.55228 9 9ZM9 12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H10C9.44772 13 9 12.5523 9 12Z" fill="#000000"/>
                </svg>
              </Link>


              <Link onClick={()=>{setModelType("Edit"); beforeEditModelHandler(params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px', marginRight: '5px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"> <title/> <g id="Complete">
                  <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g>
                  </g> </g>
                </svg>  
              </Link>


              <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Link>
            </>
        }
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: false,
        resizable: true
       }));

       const ItemsColSet = [
        { 
          headerName: 'Product', 
          field: 'product', 
          flex:2,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["Bookkeeping", "Payroll", "Vat Return", "Accounts", "Personal Tax", "Company Sec", "Address"],
          },
        },
        { headerName: 'Description', field: 'description', flex:4 },
        { headerName: 'Qty', field: 'qty', flex:1 },
        { headerName: 'Unit Price', field: 'unit_price', flex:1,
          valueGetter: p => {
            return p.data.unit_price && p.data.unit_price //to get value from obj inside obj
          },
        },
        { headerName: 'Disc', field: 'discount_percentage', flex:1 },
        { 
          headerName: 'Account', 
          field: 'account',
          flex:3,
          cellEditor: 'customAgSelectCellEditor',
          valueGetter: p => {
            return p.data.account && p.data.account.label //to get value from obj inside obj
          }, 
          cellEditorParams: (params) => ({
            values: coaPreData,
            params,
            selectedAccountId: selectedAccountId,
            setSelectedAccountId: (unique_id, selectedValuee) => {
              setSelectedAccountId(selectedValuee)
            },
          })
        },
        { headerName: 'Tax Rate %', field: 'tax_rate', flex:2 },
        { headerName: 'Amount', field: 'amount', flex:2, editable: false, },
        { headerName: '', field: 'actt', flex:1, editable: false,
        cellRendererFramework: (params)=>
        <>
          <Link onClick={()=>{onItemsRowDelete(params.data.unique_id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
              <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </Link>
        </>
      },
      ]
      
      const defaultItemsColSet = useMemo( ()=> ({
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: true,
        resizable: true
       }));



       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

      const handleActionButtons = async (type, id)=>{
        
        if(type === "Delete"){

          const confirmed = window.confirm('Are you sure you want to delete this item?');

          if (confirmed) {
            const response = await axios.get(`${SalesDeleteOneUrl}/${id}`,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setReRender(!reRender)
          }
          } else {
            // user clicked Cancel, do nothing
          }
        }

        if(type === "MarkPaid"){

          const confirmed = window.confirm('Are you sure you want to Mark this item as Paid?');

          if (confirmed) {
            const response = await axios.get(`${SalesEditOneMarkPaidUrl}/${id}`,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setReRender(!reRender)
          }
          } else {
            // user clicked Cancel, do nothing
          }
        }

        if(type === "Edit"){
  
          const response = await axios.post(`${SalesEditOneUrl}/${id}`,
            {
              saleData: saleData,
              totalData: itemsTotalSec,
              saleItems: itemsRowData
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setSaleData({
              to: "",
              date: "", 
              dueDate: "",
              jobDate: "",
              invoiceNo: '1',
              currency: "GBP",
              status: "Due",
              source: "",
              company_id: ""
        
            })
            setItemsRowData([
              {
                unique_id: uuidv4(),
                description: '',
                qty: '',
                unit_price: '',
                discount_percentage: '',
                account: '',
                tax_rate: '',
                amount: '',
                product: ""
              }
            ]);
            setItemsTotalSec({
              subTotal: 0,
              tax: 0,
              total: 0,
              disc: 0,
            }
          );
          setAddSaleIsOpen(false)
            setReRender(!reRender)
          }
        }
  
       }


       const handleAddNewLine = ()=>{
        const newItem = {
          unique_id: uuidv4(),
          description: '',
          qty: '',
          unit_price: '',
          discount_percentage: '',
          account: '',
          tax_rate: '',
          amount: '',
          product: ""
        };

        setItemsRowData(prevItems => [...prevItems, newItem]);
       }

       const updateItem = (itemId, updatedItem) => {
        setItemsRowData(prevItems =>
          prevItems.map(item =>
            item.unique_id === itemId ? { ...item, ...updatedItem } : item
          )
        );
      };

      const deleteItem = itemIdToDelete => {
        setItemsRowData(prevItems =>
          prevItems.filter(item => item.unique_id !== itemIdToDelete)
        );
      };

      const onItemsRowDelete = (unique_idd)=>{
        const itemIdToDelete = unique_idd;
        deleteItem(itemIdToDelete);
      }


      const onItemsRowValueChanged = useCallback(async (event) => {
        var data = event.data;

        console.log(data)

        var unitPrice = data.unit_price;
        var quantity = data.qty;
        var discount = data.discount_percentage;
        var totalAmt = 0;

        if(unitPrice && quantity){
          totalAmt = (+unitPrice * +quantity) - +discount;
        }
        // setSelectedAccountId(prev => prev)
        var ac_id = selectedAccountId && selectedAccountId.value;
        var ac_name = selectedAccountId && selectedAccountId.label;

      
        const itemIdToUpdate = data.unique_id;
        const updatedItem = {
          description: data.description,
          qty: data.qty,
          unit_price: data.unit_price,
          discount_percentage: data.discount_percentage,
          account: ac_name,
          account_id: ac_id,
          tax_rate: data.tax_rate,
          amount: totalAmt,
        };
        setSelectedAccountId(null)
        updateItem(itemIdToUpdate, updatedItem);

      
      }, [selectedAccountId]);



      useEffect(()=>{

        var subtotalPr = 0;
        var taxAmt = 0;
        var discAmt = 0;
        var totalAmt = 0;

        for (const itemm of itemsRowData){
          if( itemm.unit_price && itemm.unit_price !== "" && itemm.qty && itemm.qty !== ""){
            taxAmt = ((itemm.tax_rate * itemm.unit_price) / 100) + taxAmt;
            subtotalPr = +subtotalPr + +itemm.amount;
            discAmt = +discAmt + +itemm.discount_percentage
          }
        }

        totalAmt = +subtotalPr + +taxAmt

        setItemsTotalSec(prevState => ({
                ...prevState,
                subTotal: subtotalPr,
                total: totalAmt,
                tax: taxAmt,
                disc: discAmt
            }));
      }, [itemsRowData])


      const handleFormChange = (e)=>{
        e.preventDefault();
        const { name, value } = e.target;
        setSaleData(prevState => ({
          ...prevState,
          [name]: value
      }));
      }

      const handleAddSale = async ()=>{
        // SalesAddOneUrl
        setLoader(true)
        try {
            const response = await axios.post(SalesAddOneUrl,
              {
                saleData: saleData,
                totalData: itemsTotalSec,
                saleItems: itemsRowData
              },
              {
                headers:{ 'Content-Type': 'application/json' }
              }
            );
            if(response.status === 200){
              setSaleData({
                to: "",
                date: "", 
                dueDate: "",
                jobDate: "",
                invoiceNo: '1',
                currency: "GBP",
                status: "Due",
                source: "",
                company_id: ""
          
              })
              setItemsRowData([
                {
                  unique_id: uuidv4(),
                  description: '',
                  qty: '',
                  unit_price: '',
                  discount_percentage: '',
                  account: '',
                  tax_rate: '',
                  amount: '',
                  product: ""
                }
              ]);
              setItemsTotalSec({
                subTotal: 0,
                tax: 0,
                total: 0,
                disc: 0,
              }
            );
            setAddSaleIsOpen(false)
              setReRender(!reRender)
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


      
  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Sales - ${new Date().toISOString().slice(0, 10)}`,
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
      

  async function onGridReady(params) {
    setGridApi(params);
  }

  const frameworkComponents = {
    // myFloatingFilter: MyFloatingFilter,
    selectFloatingFilter: DropdownFilter,
    selectFloatingFilterWthDate: DropdownFilterWithDate,
  };

  const onCellValueChanged = useCallback(async (event) => {
    const note = event.data.note;
    const jobHolder = event.data.jobHolder;

    if (event.colDef.field === "note") {
      await axios.post(`${SalesEditOneNoteUrl}/${event.data._id}`,
        {
          note: note,
          jobHolder: jobHolder,
        },
        {
          headers:{ 
            'Content-Type': 'application/json',
          }
        }
      );
    }
    if (event.colDef.field === "jobHolder") {
      await axios.post(`${SalesEditOneNoteUrl}/${event.data._id}`,
        {
          note: note,
          jobHolder: jobHolder,
        },
        {
          headers:{ 
            'Content-Type': 'application/json',
          }
        }
      );
    }

  }, [gridApi]);

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
                  Sales
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


            {/* <div>
                <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "Active">
                        Active
                    </option>
                    <option value = "Inactive">
                        Inactive
                    </option>
                </select>
            </div> */}

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
            <Link onClick={beforeAddModelHandler} className='btn btn-primary mx-4'>
              Add Sale
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
                onCellValueChanged={onCellValueChanged}
            />

                    <div className="fixed-row">
                      <div className="fixed-row-cell">Total Sales: {totalSales.toFixed(1)}</div>
                  
                      {/* Add more cells or custom content as needed */}
                    </div>
            
          </div>
        </div>
    </div>

    <Modal 
    // size="xl"
    dialogClassName="modal-90w" 
    show={addSaleIsOpen} 
    centered 
    onHide={()=>{setAddSaleIsOpen(!addSaleIsOpen)}}>
      <Modal.Header closeButton>
        <Modal.Title> { modelType === "View" ? "View" : modelType === "New" ? "Add New" : "Edit"} Sale</Modal.Title>
      </Modal.Header>
      <form onSubmit={ handleFormSubmit }>
      <Modal.Body className='task_modalbody_bg_color'>

        

        <div  style={{height: '78vh', overflow: 'scroll',}}>

            <div className='row'>

              <div className='col-8'>
                <div className='row'>

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlSelect1">To</label>
                      <select disabled = {modelType === "View" ? true : false} required value={saleData.to} onChange={handleFormChange} name='to' style={{fontSize: '12px'}} class="form-control" id="exampleFormControlSelect1">
                        <option value="" selected disabled>Select Client</option>
                        {ClientsPreData && ClientsPreData.map((client, index)=>{
                          return(
                            <option key={index} value={client._id}>{client.company_name}</option>
                          )
                        })}
                      </select>
                    </div>
                  </div>

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Date</label>
                      <input disabled = {modelType === "View" ? true : false} value={saleData.date} style={{fontSize: '12px'}} onChange={handleFormChange} name='date' type="date" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>
                  

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Due Date</label>
                      <input disabled = {modelType === "View" ? true : false} value={saleData.dueDate} style={{fontSize: '12px'}} onChange={handleFormChange} name='dueDate' type="date" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>
                  

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Job Date</label>
                      <input disabled = {modelType === "View" ? true : false} value={saleData.jobDate} style={{fontSize: '12px'}} onChange={handleFormChange} name='jobDate' type="date" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>

                  

                </div>
              </div>

              <div className='col-4'>

                <div className='row'>
                
                  <div className='col-6'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Invoice #</label>
                      <input disabled style={{fontSize: '12px'}} onChange={handleFormChange} name='invoiceNo' value={saleData.invoiceNo} type="text" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Status</label>
                      <select style={{fontSize: '12px'}} className='form-control' name='status' value={saleData.status === "Paid" ? "" : saleData.status} onChange={handleFormChange}>
                        <option disabled value=""> Select </option>
                        <option value="Due"> Due </option>
                        <option value="Overdue"> Overdue </option>
                      </select>
                      {/* <input disabled style={{fontSize: '12px'}} onChange={handleFormChange} name='invoiceNo' value={saleData.invoiceNo} type="text" class="form-control" id="exampleFormControlInput1"/> */}
                    </div>

                  </div>  

                </div>


              </div>
            </div>

            <hr/>

            <div className='row'>
              <div className='col-2'>
                <div class="form-group">
                <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Currency</label>
                  <select disabled = {modelType === "View" ? true : false} defaultValue={saleData.currency} style={{fontSize: '12px'}} onChange={handleFormChange} name='currency' class="form-control" id="exampleFormControlSelect1">
                    <option value="؋">Afghan Afghani - ؋</option>
                    <option value="Lek">Albanian Lek - Lek</option>
                    <option value="دج">Algerian Dinar - دج</option>
                    <option value="Kz">Angolan Kwanza - Kz</option>
                    <option value="$">Argentine Peso - $</option>
                    <option value="֏">Armenian Dram - ֏</option>
                    <option value="ƒ">Aruban Florin - ƒ</option>
                    <option value="$">Australian Dollar - $</option>
                    <option value="m">Azerbaijani Manat - m</option>
                    <option value="B$">Bahamian Dollar - B$</option>
                    <option value=".د.ب">Bahraini Dinar - .د.ب</option>
                    <option value="৳">Bangladeshi Taka - ৳</option>
                    <option value="Bds$">Barbadian Dollar - Bds$</option>
                    <option value="Br">Belarusian Ruble - Br</option>
                    <option value="fr">Belgian Franc - fr</option>
                    <option value="$">Belize Dollar - $</option>
                    <option value="$">Bermudan Dollar - $</option>
                    <option value="Nu.">Bhutanese Ngultrum - Nu.</option>
                    <option value="฿">Bitcoin - ฿</option>
                    <option value="Bs.">Bolivian Boliviano - Bs.</option>
                    <option value="KM">Bosnia-Herzegovina Convertible Mark - KM</option>
                    <option value="P">Botswanan Pula - P</option>
                    <option value="R$">Brazilian Real - R$</option>
                    <option value="£">British Pound Sterling - £</option>
                    <option value="B$">Brunei Dollar - B$</option>
                    <option value="Лв.">Bulgarian Lev - Лв.</option>
                    <option value="FBu">Burundian Franc - FBu</option>
                    <option value="KHR">Cambodian Riel - KHR</option>
                    <option value="$">Canadian Dollar - $</option>
                    <option value="$">Cape Verdean Escudo - $</option>
                    <option value="$">Cayman Islands Dollar - $</option>
                    <option value="CFA">CFA Franc BCEAO - CFA</option>
                    <option value="FCFA">CFA Franc BEAC - FCFA</option>
                    <option value="₣">CFP Franc - ₣</option>
                    <option value=" $">Chilean Peso - $</option>
                    <option value="¥">Chinese Yuan - ¥</option>
                    <option value="$">Colombian Peso - $</option>
                    <option value="CF">Comorian Franc - CF</option>
                    <option value="FC">Congolese Franc - FC</option>
                    <option value="₡">Costa Rican ColÃ³n - ₡</option>
                    <option value="kn">Croatian Kuna - kn</option>
                    <option value="$">Cuban Convertible Peso - $</option>
                    <option value="Kč">Czech Republic Koruna - Kč</option>
                    <option value="Kr.">Danish Krone - Kr.</option>
                    <option value="Fdj">Djiboutian Franc - Fdj</option>
                    <option value="$">Dominican Peso - $</option>
                    <option value="$">East Caribbean Dollar - $</option>
                    <option value="ج.م">Egyptian Pound - ج.م</option>
                    <option value="Nfk">Eritrean Nakfa - Nfk</option>
                    <option value="kr">Estonian Kroon - kr</option>
                    <option value="Nkf">Ethiopian Birr - Nkf</option>
                    <option value="€">Euro - €</option>
                    <option value="£">Falkland Islands Pound - £</option>
                    <option value="FJ$">Fijian Dollar - FJ$</option>
                    <option value="D">Gambian Dalasi - D</option>
                    <option value="ლ">Georgian Lari - ლ</option>
                    <option value="DM">German Mark - DM</option>
                    <option value="GH₵">Ghanaian Cedi - GH₵</option>
                    <option value="£">Gibraltar Pound - £</option>
                    <option value="₯">Greek Drachma - ₯, Δρχ, Δρ</option>
                    <option value="Q">Guatemalan Quetzal - Q</option>
                    <option value="FG">Guinean Franc - FG</option>
                    <option value="$">Guyanaese Dollar - $</option>
                    <option value="G">Haitian Gourde - G</option>
                    <option value="L">Honduran Lempira - L</option>
                    <option value="$">Hong Kong Dollar - $</option>
                    <option value="Ft">Hungarian Forint - Ft</option>
                    <option value="Kr">Icelandic KrÃ³na - kr</option>
                    <option value="₹">Indian Rupee - ₹</option>
                    <option value="Rp">Indonesian Rupiah - Rp</option>
                    <option value="﷼">Iranian Rial - ﷼</option>
                    <option value="د.ع">Iraqi Dinar - د.ع</option>
                    <option value="₪">Israeli New Sheqel - ₪</option>
                    <option value="L">Italian Lira - L,£</option>
                    <option value="J$">Jamaican Dollar - J$</option>
                    <option value="¥">Japanese Yen - ¥</option>
                    <option value="ا.د">Jordanian Dinar - ا.د</option>
                    <option value="лв">Kazakhstani Tenge - лв</option>
                    <option value="KSh">Kenyan Shilling - KSh</option>
                    <option value="ك.د">Kuwaiti Dinar - ك.د</option>
                    <option value="лв">Kyrgystani Som - лв</option>
                    <option value="₭">Laotian Kip - ₭</option>
                    <option value="Ls">Latvian Lats - Ls</option>
                    <option value="£">Lebanese Pound - £</option>
                    <option value="L">Lesotho Loti - L</option>
                    <option value="$">Liberian Dollar - $</option>
                    <option value="د.ل">Libyan Dinar - د.ل</option>
                    <option value="Lt">Lithuanian Litas - Lt</option>
                    <option value="$">Macanese Pataca - $</option>
                    <option value="ден">Macedonian Denar - ден</option>
                    <option value="Ar">Malagasy Ariary - Ar</option>
                    <option value="MK">Malawian Kwacha - MK</option>
                    <option value="RM">Malaysian Ringgit - RM</option>
                    <option value="Rf">Maldivian Rufiyaa - Rf</option>
                    <option value="MRU">Mauritanian Ouguiya - MRU</option>
                    <option value="₨">Mauritian Rupee - ₨</option>
                    <option value="$">Mexican Peso - $</option>
                    <option value="L">Moldovan Leu - L</option>
                    <option value="₮">Mongolian Tugrik - ₮</option>
                    <option value="MAD">Moroccan Dirham - MAD</option>
                    <option value="MT">Mozambican Metical - MT</option>
                    <option value="K">Myanmar Kyat - K</option>
                    <option value="$">Namibian Dollar - $</option>
                    <option value="₨">Nepalese Rupee - ₨</option>
                    <option value="ƒ">Netherlands Antillean Guilder - ƒ</option>
                    <option value="$">New Taiwan Dollar - $</option>
                    <option value="$">New Zealand Dollar - $</option>
                    <option value="C$">Nicaraguan CÃ³rdoba - C$</option>
                    <option value="₦">Nigerian Naira - ₦</option>
                    <option value="₩">North Korean Won - ₩</option>
                    <option value="kr">Norwegian Krone - kr</option>
                    <option value=".ع.ر">Omani Rial - .ع.ر</option>
                    <option value="₨">Pakistani Rupee - ₨</option>
                    <option value="B/.">Panamanian Balboa - B/.</option>
                    <option value="K">Papua New Guinean Kina - K</option>
                    <option value="₲">Paraguayan Guarani - ₲</option>
                    <option value="S/.">Peruvian Nuevo Sol - S/.</option>
                    <option value="₱">Philippine Peso - ₱</option>
                    <option value="zł">Polish Zloty - zł</option>
                    <option value="ق.ر">Qatari Rial - ق.ر</option>
                    <option value="lei">Romanian Leu - lei</option>
                    <option value="₽">Russian Ruble - ₽</option>
                    <option value="FRw">Rwandan Franc - FRw</option>
                    <option value="₡">Salvadoran ColÃ³n - ₡</option>
                    <option value="SAT">Samoan Tala - SAT</option>
                    <option value="﷼">Saudi Riyal - ﷼</option>
                    <option value="din">Serbian Dinar - din</option>
                    <option value="SRe">Seychellois Rupee - SRe</option>
                    <option value="Le">Sierra Leonean Leone - Le</option>
                    <option value="SGD">Singapore Dollar - $</option>
                    <option value="SKK">Slovak Koruna - Sk</option>
                    <option value="SBD">Solomon Islands Dollar - Si$</option>
                    <option value="SOS">Somali Shilling - Sh.so.</option>
                    <option value="ZAR">South African Rand - R</option>
                    <option value="KRW">South Korean Won - ₩</option>
                    <option value="XDR">Special Drawing Rights - SDR</option>
                    <option value="LKR">Sri Lankan Rupee - Rs</option>
                    <option value="SHP">St. Helena Pound - £</option>
                    <option value="SDG">Sudanese Pound - .س.ج</option>
                    <option value="SRD">Surinamese Dollar - $</option>
                    <option value="SZL">Swazi Lilangeni - E</option>
                    <option value="SEK">Swedish Krona - kr</option>
                    <option value="CHF">Swiss Franc - CHf</option>
                    <option value="SYP">Syrian Pound - LS</option>
                    <option value="STD">São Tomé and Príncipe Dobra - Db</option>
                    <option value="TJS">Tajikistani Somoni - SM</option>
                    <option value="TZS">Tanzanian Shilling - TSh</option>
                    <option value="THB">Thai Baht - ฿</option>
                    <option value="TOP">Tongan pa'anga - $</option>
                    <option value="$">Trinidad & Tobago Dollar - $</option>
                    <option value="ت.د">Tunisian Dinar - ت.د</option>
                    <option value="₺">Turkish Lira - ₺</option>
                    <option value="T">Turkmenistani Manat - T</option>
                    <option value="USh">Ugandan Shilling - USh</option>
                    <option value="₴">Ukrainian Hryvnia - ₴</option>
                    <option value="إ.د">United Arab Emirates Dirham - إ.د</option>
                    <option value="$">Uruguayan Peso - $</option>
                    <option value="$">US Dollar - $</option>
                    <option value="лв">Uzbekistan Som - лв</option>
                    <option value="VT">Vanuatu Vatu - VT</option>
                    <option value="Bs">Venezuelan BolÃ­var - Bs</option>
                    <option value="₫">Vietnamese Dong - ₫</option>
                    <option value="﷼">Yemeni Rial - ﷼</option>
                    <option value="ZK">Zambian Kwacha - ZK</option>
                  </select>
                </div>
              </div>


              <div className='col-2'>
                <div class="form-group">
                    <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Source</label>
                    <select style={{fontSize: '12px'}} className='form-control' name='source' value={saleData.source} onChange={handleFormChange}>
                      <option disabled value=""> Select </option>
                      <option value="FIV"> FIV </option>
                      <option value="UPW"> UPW </option>
                      <option value="PPH"> PPH </option>
                      <option value="Website"> Website </option>
                      <option value="Referal"> Referal </option>
                      <option value="Partner"> Partner </option>
                    </select>
                  </div>
              </div>

              <div className='col-2'>
                <div class="form-group">
                    <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Company</label>
                    <select style={{fontSize: '12px'}} className='form-control' name='company_id' value={saleData.company_id} onChange={handleFormChange}>
                      <option disabled value=""> Select </option>

                        {companiesNames.map((company, ind) =>{
                          return(
                            <option key={ind} value={company._id}> {company.name} </option>
                          )
                        })}

                      
                    </select>
                  </div>
              </div>

            </div>

            <div className='my-3 salesTable'>
              <div className="ag-theme-alpine" style={{height: '40vh'}}>
                <AgGridReact
                  columnDefs={ItemsColSet}
                  rowData={itemsRowData}
                  defaultColDef={defaultItemsColSet}
                  editType={'fullRow'}
                  // animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                  // rowSelection='multiple' // Options - allows click selection of rows
                  // pagination = {true}
                  // paginationPageSize = {25}
                  // onCellValueChanged={onCellValueChanged}
                  onRowValueChanged={onItemsRowValueChanged}
                  suppressDragLeaveHidesColumns={true}
                  frameworkComponents={{
                    customAgSelectCellEditor: CustomAgSelectCellEditor,
                  }}
                />
              </div>

              <div className='mt-3'>
                <div className='row'>
                  <div className='col-6'>
                    <button type='button' onClick={handleAddNewLine} style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      border: 'none',
                      backgroundColor: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                      }}> Add a new line</button>
                  </div>

                  <div className='col-6'>
                    <div className='px-3' style={{
                      textAlign: '-webkit-right',
                      }}>
                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  SubTotal
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.subTotal}
                                </p>
                              </div>
                          </div>
                        </div>

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  Tax
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.tax}
                                </p>
                              </div>
                          </div>
                        </div>

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  Discount
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.disc}
                                </p>
                              </div>
                          </div>
                        </div>

                        <hr style={{
                          width: '60%',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                          height: '2px',
                          border: 'none',
                          color: '#333',
                          backgroundColor: '#333',}} />

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p style={{
                                  fontSize: '25px',
                                  fontWeight: '600',
                                }} >
                                  Total
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p style={{
                                  fontSize: '25px',
                                  fontWeight: '600',
                                }}>
                                  {itemsTotalSec.total}
                                </p>
                              </div>
                          </div>
                        </div>

                        <hr style={{    
                          width: '60%',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                          height: '3px',
                          border: 'none',
                          color: '#333',
                          backgroundColor: '#333',
                          }} />


                    </div>
                  </div>
                </div>
              </div>

            </div>


        </div>


      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>{setAddSaleIsOpen(!addSaleIsOpen)}}>Close</Button>
        {modelType === "View" ? <></> :
        modelType === "New" ?
         <Button type='submit' className='btn btn-success' >Save</Button> 
         : modelType === "Edit" && <Button type='submit' className='btn btn-success' >Update</Button> 
         }
        
      </Modal.Footer>
      </form>
    </Modal>



        </>
    );
}
}

export default Sales;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import SelectUnSelectFilter from '../../../Jobs/JobPlaning/SelectUnSelectFilter';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import secureLocalStorage from 'react-secure-storage';

var UserRecurringTasksGetAllUrl = axiosURL.UserRecurringTasksGetAllUrl;
var UserRecurringTasksAddOneUrl = axiosURL.UserRecurringTasksAddOneUrl;
var UserRecurringTasksEditOneUrl = axiosURL.UserRecurringTasksEditOneUrl;
var UserRecurringTasksDeleteOneUrl = axiosURL.UserRecurringTasksDeleteOneUrl;
var UserRecurringTasksCopyOneUrl = axiosURL.UserRecurringTasksCopyOneUrl;
var UserRecurringTasksMarkCompleteOneUrl = axiosURL.UserRecurringTasksMarkCompleteOneUrl;



const UserRecurringTasks = (props) => {

  const filterFromMyList = props.myListPageFData

    const [historyMode, setHistoryMode] = useState(false)
    const [checkLoading, setCheckLoading] = useState(false)
    const [loader, setLoader] = useState(true)
    const [reRender, setReRender] = useState(true)
    const [reRender2, setReRender2] = useState(0)

    const [sumOfMarks, setSumOfMarks] = useState(0)

    const [showAddTaskModal, setShowAddTaskModal] = useState(false);

    const [preData, setPreData] = useState(null);
    const [projectNames, setProjectNames] = useState(null);
    const [projectFNames, setProjectFNames] = useState(null);
    const [fPreData, setFPreData] = useState(null);

    const [projectFvalue, setProjectFvalue] = useState(null);
    const [jHolderFvalue, setJHolderFvalue] = useState(null);
    const [jHolderPreFvalue, setJHolderPreFvalue] = useState(null);
    const [intervalFvalue, setIntervalFvalue] = useState(null);
    const [statusFvalue, setStatusFvalue] = useState(null);
    
    const [startDateFvalueDate, setStartDateFvalueDate] = useState('');
    const [startDateFvalue, setStartDateFvalue] = useState('');

    const handleFunClear = () => {
      if (gridApi) {
        gridApi.api.setFilterModel({});
        gridApi.api.refreshHeader();
      }
      setProjectFvalue(null);
      setJHolderFvalue(null);
      setJHolderPreFvalue(null);
      setStartDateFvalueDate(null);
      setStartDateFvalue(null);
    }

    const [userRole, setUserRole] = useState("");

    const [usersForFilter, setUsersForFilter] = useState([]);

    const [addTaskFormData, setAddTaskFormData] = useState({
        projectname_id: '',
        Jobholder: '',
        description: '',
        hrs: '',
        interval: 'Daily'
    })

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    const [gridApi, setGridApi] = useState(null);


    
    const gridRef = useRef();
    
    
   

    const handleCloseAddTaskModal = () => {
      setShowAddTaskModal(false);
    };

    const handleAddFormDataChange = (e)=>{
      const { name, value } = e.target;
      setAddTaskFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
    }



    const handleAddTaskForm = async ()=>{
      try {
        const response = await axios.post(UserRecurringTasksAddOneUrl,
            {
              formData:addTaskFormData 
            },
            {
              headers:{ 'Content-Type': 'application/json' }
            }
        );
        
        if(response){
          setAddTaskFormData({
            projectname_id: '',
            Jobholder: '',
            description: '',
            hrs: '',
            interval: 'Daily'
          })
          setShowAddTaskModal(false);
          setLoader(false);
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
    

    const filter = (mainData)=>{


      var filteredArray = [];
      filteredArray = [...mainData];

      
      if(!historyMode){
        var secondArr = [];
        filteredArray.forEach(item => {

          const object = {
            _id: item._id,
            projectname_id: item.projectname_id,
            Jobholder: item.Jobholder,
            description: item.description,
            hrs: item.hrs,
            interval: item.interval,
            dates: [ item.dates[ item.dates.length - 1 ] ]
          }
          secondArr.push(object)
        })
        filteredArray = secondArr;
        console.log(secondArr)
        secondArr = [];
      } else if(historyMode) {
        var secondArr = [];
          filteredArray.forEach(item => {    
            item.dates.forEach(innerItem => {
              const object = {
                _id: item._id,
                projectname_id: item.projectname_id,
                Jobholder: item.Jobholder,
                description: item.description,
                hrs: item.hrs,
                interval: item.interval,
                dates:[{
                  date: innerItem.date,
                  isCompleted: innerItem.isCompleted,
                  notes: innerItem.notes
                }]
              }
              secondArr.push(object)  
              });
          });
          
          filteredArray = secondArr;
          secondArr = [];

      }

      // Job Holder Filter
      if(filteredArray !== undefined && jHolderFvalue !== null && jHolderFvalue !== ""){
          filteredArray = filteredArray.filter(obj => obj.Jobholder && obj.Jobholder === jHolderFvalue);
      }

      // Interval Filter
      if(filteredArray !== undefined && intervalFvalue !== null && intervalFvalue !== ""){
          filteredArray = filteredArray.filter(obj => obj.interval && obj.interval === intervalFvalue);
      }
      
      //Project Filter
      if(filteredArray !== undefined && projectFvalue !== null && projectFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.projectname_id && obj.projectname_id.name === projectFvalue);
      }
      
      //Status Filter
      if( statusFvalue !== null){
        if(filteredArray !== undefined && statusFvalue !== null && statusFvalue === "Completed"){
          filteredArray = filteredArray.filter(obj => obj.dates[0].isCompleted );
        }
        if(filteredArray !== undefined && statusFvalue !== null && statusFvalue === "In-Complete"){
          filteredArray = filteredArray.filter(obj => !obj.dates[0].isCompleted );
        }
      }

      //startDate
      if(startDateFvalue){

        //Job Date 7 days Filter
        if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "In 7 days"){
          filteredArray =  filteredArray.filter(obj => {
            // obj.manager_id && obj.manager_id.name === cManagerFvalue
            const today = new Date()
            const deadline = new Date(obj.dates[0].date)
            const deadlineNextSevenDays = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
            if(obj.dates[0].date && obj.dates[0].date !== 'Invalid Date'){
              if((deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) && (deadline.setHours(0, 0, 0, 0) >= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
                return obj;
              }
            }
          });
        }

        //Job Date 15 days Filter
        if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "In 15 days"){
          filteredArray =  filteredArray.filter(obj => {
            // obj.manager_id && obj.manager_id.name === cManagerFvalue
            const today = new Date()
            const deadline = new Date(obj.dates[0].date)
            const deadlineNextSevenDays = new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000))
            if(obj.dates[0].date && obj.dates[0].date !== 'Invalid Date'){
              if((deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) && (deadline.setHours(0, 0, 0, 0) >= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
                return obj;
              }
            }
          });
        }

        //Job Date Month Wise Filter
        if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Month Wise"){
          filteredArray = filteredArray.filter(obj => {
            // obj.manager_id && obj.manager_id.name === cManagerFvalue
            // const today = new Date()
            var today = new Date(startDateFvalueDate)
            const deadline = new Date(obj.dates[0].date)
            if (obj.dates[0].date && obj.dates[0].date !== 'Invalid Date') {
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
      }

      if(filteredArray){
        var summ = 0;
        filteredArray.forEach((item) => {
          if(item.hrs && item.hrs !== ""){
            summ = +summ + +item.hrs
          }
        })
        setSumOfMarks(summ);
      }
    
      setRowData(filteredArray)
    }

    useEffect(()=>{
      // setRowData(mainRowData)

      if(filterFromMyList){
        setJHolderFvalue(filterFromMyList && filterFromMyList.jobHolder)
        setStartDateFvalue(filterFromMyList && filterFromMyList.deadline)
      }
      
      filter(mainRowData)
    }, [mainRowData, projectFvalue, jHolderFvalue, jHolderPreFvalue, startDateFvalueDate, startDateFvalue, historyMode, intervalFvalue, statusFvalue])

    useEffect(()=>{
      
      const tempArr = usersForFilter
      
          const newObj = { value: null, label: 'Select' };
  
          tempArr.unshift(newObj);
  
          setUsersForFilter(tempArr)
  
     }, [usersForFilter])

     useEffect(()=>{
      if(projectFNames){
        const tempArr = projectFNames
        
            const newObj = { value: null, label: 'Select' };
    
            tempArr.unshift(newObj);
    
            setProjectFNames(tempArr)
  
      }
     }, [projectFNames])

     const handlePageRefresh =()=>{
      setLoader(true)
      setReRender(prev => !prev)
    }


    const getData = async ()=>{
        // setLoader(true)
        try {

            const token = secureLocalStorage.getItem('token') 
            const response = await axios.get(UserRecurringTasksGetAllUrl,
                {
                    headers:{ 
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token
                    }
                }
            );
            if(response.status === 200){
              setUserRole(response.data.userRole)
              setPreData(response.data.users)
              setProjectNames(response.data.projectNames)
              
              setProjectFNames(response.data.projectNames.map(names => {
                return { value: names._id, label: names.name };
              }));
              
              setUsersForFilter(response.data.users.map(names => {
                return { value: names._id, label: names.name };
              }));
              setFPreData(response.data.users.map(names => {
                return { value: names._id, label: names.name };
              }))
              setMainRowData(response.data.projects)
              setJHolderPreFvalue(response.data.curUser)
              setLoader(false)
              setCheckLoading(false);
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

    

    const handleDeleteProject = async (projId)=>{
      // setLoader(true)
      
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (confirmed) {

        const filteredArray = rowData.filter(obj => obj._id !== projId);
        setRowData(filteredArray)
        try{
          await axios.get(`${UserRecurringTasksDeleteOneUrl}/${projId}`,
              {
              headers:{ 'Content-Type': 'application/json' }
              }
          );
        } catch (err) {

        }

        setReRender(!reRender);
      }
    }

    const handleTaskCompletion = async (taskId, state) => {
        try{
          setCheckLoading(true);
          await axios.post(`${UserRecurringTasksMarkCompleteOneUrl}/${taskId}`,
            {
              isChecked: !state
              
            },
              {
              headers:{ 'Content-Type': 'application/json' }
              }
          );
        } catch (err) {

        }
        setReRender(!reRender);
    }

    const handleCopyProject = async (projId)=>{
      try {
        await axios.get(`${UserRecurringTasksCopyOneUrl}/${projId}`,
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );


      } catch (err) {
        //
      }

      setReRender(!reRender);
    }
    
    
    
      var columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.6,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            valueGetter: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Project', field: 'projectname_id', flex:2,
        valueGetter: (params)=>{
          return(params.data.projectname_id ? params.data.projectname_id.name ? params.data.projectname_id.name : params.data.projectname_id_name : params.data.projectname_id_name)
          
        } ,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams:  {
          values: projectFNames && projectFNames.map(option => option.label),
        },
        floatingFilterComponent: 'selectFloatingFilter', 
        floatingFilterComponentParams: { 
          options: projectNames && projectNames.map(option => option.name),
          onValueChange:(value) => setProjectFvalue(value),
          value: projectFvalue,
          suppressFilterButton: true, 
          suppressInput: true 
        } 
        },

        { 
          headerName: 'Job Holder', 
          field: 'Jobholder', 
          flex:1.4,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: usersForFilter && usersForFilter.map(option => option.label),
          },
          onCellValueChanged: function(event) {
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: fPreData && fPreData.map(option => option.label),
            onValueChange:(value) => setJHolderFvalue(value),
            value: jHolderFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        
        { headerName: 'Tasks', field: 'description', flex:5,
        cellRendererFramework: (params)=>
        <>
          {params.data.description}
        </>,
        },
        
        { 
          headerName: 'Hrs', 
          field: 'hrs', 
          flex:1,
        },

        { 
          headerName: 'Date', 
          field: 'date', 
          flex:1.5, 
          editable: true,
          valueGetter: p => {
            if(p.data){
                if(p.data.dates[0] && p.data.dates[0].date !== "Invalid Date")
                {
                  const deadline = new Date(p.data.dates[0].date)
                  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
                  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
                  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
                  return(`${da}-${mo}-${ye}`);
                  }
                  else{
                    return ""
                }    
            }

          },
          floatingFilterComponent: 'selectFloatingFilterWthDate', 
          floatingFilterComponentParams: { 
            options: ["In 7 days", "In 15 days", "Month Wise"],
            onValueChange:(value) => setStartDateFvalue(value),
            value: startDateFvalue,
            onDateValueChange:(value) => setStartDateFvalueDate(value),
            dateValue: startDateFvalueDate,
            suppressFilterButton: true, 
            suppressInput: true 
          },
        },
        
        { 
          headerName: 'Interval', 
          field: 'interval', 
          flex:1,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["Daily", "Weekly", "Monthly", "Quarterly"],
          },
          onCellValueChanged: function(event) {
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ["Daily", "Weekly", "Monthly", "Quarterly"],
            onValueChange:(value) => setIntervalFvalue(value),
            value: intervalFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },

        { headerName: 'Status', 
          field: 'status', 
          flex:1.2,
          editable: false,
          cellRendererFramework: (p)=>
            <>
              {checkLoading ? <div style={{textAlign: 'center',}}> 
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
                    viewBox="0 0 38 38"
                    stroke="#000000"
                    style={{ color: "black" }}
                  >
                    <g fill="none" fillRule="evenodd">
                      <g transform="translate(1 1)" strokeWidth={2}>
                        <circle strokeOpacity=".5" cx={18} cy={18} r={18} />
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </g>
                    </g>
                  </svg>
              </div> : 
                <input disabled={historyMode} style={{width: '100%', height: '80%', marginTop: '4.5px',}} checked={p.data.dates[0].isCompleted} onClick={(e)=>{e.preventDefault(); handleTaskCompletion(p.data._id, p.data.dates[0].isCompleted)}} type="checkbox" />
               }
            </>,
             floatingFilterComponent: 'selectFloatingFilter', 
             floatingFilterComponentParams: { 
               options: ["Completed", "In-Complete"],
               onValueChange:(value) => setStatusFvalue(value),
               value: statusFvalue,
               suppressFilterButton: true,
               suppressInput: true 
             }
        },

        { headerName: 'Notes', 
        field: 'notes', 
        flex:3,
        valueGetter: p => {
          
          if(p.data.dates){
              return p.data.dates[0].notes
          }
        }
      },
        
      ];

      if(!historyMode && userRole === "Admin"){
        columnDefs.push({ 
          headerName: 'Action', 
          field: 'delete', 
          flex:0.8,
          editable: false,
          filter: false,
          cellRendererFramework: (params)=>
          <>
          <Link onClick={()=>{handleCopyProject(params.data._id, params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
            <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 256 256">
              <path d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401 4.636 0 8.397 1.719 13.594 5.67 5.196 3.953 13.052 10.56 16.942 14.962 3.89 4.402 5.532 6.972 5.532 10.604 0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881-9.257.124-29.135.124-29.135.124s.466 6.275.466 15.15-8.106 15.811-17.317 16.056c-9.21.245-71.944-.49-80.884-.245-8.94.245-16.975-6.794-16.975-15.422s.274-93.175.274-101.566zm16.734 3.946l-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.988 1.988 0 0 0-2.046-1.953s-21.866.64-31.767.293c-9.902-.348-16.672-6.807-16.675-15.516-.003-8.709.003-69.142.003-69.142a1.989 1.989 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606l-20.825-18.135zm-57.606.847a2.002 2.002 0 0 0-2.02 1.988l-.626 96.291a2.968 2.968 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.951 1.951 0 0 0-1.96-2.004s-26.172.042-30.783.042c-4.611 0-7.535-2.222-7.535-6.482S152.3 63.92 152.3 63.92a2.033 2.033 0 0 0-2.015-2.018l-36.464-.23z" stroke="#979797" fill-rule="evenodd"/>
            </svg>
          </Link>
          <Link onClick={()=>{handleDeleteProject(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Link>
          </>
        })
      }

      var defaultColDef = {};

       if(!historyMode && userRole === "Admin"){
          defaultColDef = {
          sortable: true,
          filter: true,
          floatingFilter: true,
          editable: true,
          resizable: true
        };
       } else{
          defaultColDef = {
          sortable: true,
          filter: true,
          floatingFilter: true,
          editable: false,
          resizable: true
        };
       }

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
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


      const onCellValueChanged = useCallback((event) => {

        if(event.colDef.field === "projectname_id"){
          const selectedOption = projectFNames.find(option => option.label === event.data.projectname_id);
          event.data.projectname_id = selectedOption ? selectedOption.value : '';
          event.data.projectname_id_name = selectedOption ? selectedOption.label : '';
        }
        
      }, [gridApi]);

      var i = 1

      
const onRowValueChanged = useCallback(async (event) => {
  var data = event.data;
  try{
    const token = secureLocalStorage.getItem('token') 
    await axios.post(`${UserRecurringTasksEditOneUrl}/${data._id}`, 
      {
        projectname_id: data.projectname_id,
        description: data.description,
        Jobholder: data.Jobholder,
        hrs: data.hrs,
        note: data.notes,
        interval: data.interval,
        date: data.date
      },
      {
        headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }
    );
      // setLoader(true)
      setReRender2(i)
      i = i + 1

  }catch(err){
  }

}, []);

useEffect(() => {
  getData();
}, [reRender, reRender2]);



  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Tasks - ${new Date().toISOString().slice(0, 10)}`,
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
      //
  }
  };
    
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
        className={`mt-3 card`} >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Recurring Tasks
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

            <div>
                {/* <select name='mon_week' onChange={(e) => { setHistoryMode(e.target.value) }} defaultValue={historyMode} style={{ width: '110px' }} className='form-control mx-2'>
                  <option value={false}>
                    Today Tasks
                  </option>
                  <option value={true}>
                    History
                  </option>
                </select> */}
                {userRole === "Admin" &&
                <button onClick={(e)=> {e.preventDefault(); setHistoryMode(prev => !prev)}} className={`btn ${historyMode && "btn-primary"} `}>History Mode</button>
                }
            </div>

          </div>

        <div className='d-flex'>
        <Link onClick={exportToExcel} style={{
          backgroundColor: 'transparent',
          color: 'black',
          borderColor: 'lightgray',
          alignSelf: 'center',
        }} className='btn btn-primary mx-2'>
            Excel
        </Link>
          <div className='mx-2'>
            <Link onClick={()=>{setShowAddTaskModal(true);}} className='btn btn-primary'>
              Add Task
            </Link>
          </div>
        </div>
        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh' }}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
              onGridReady={onGridReady}
              // gridOptions={formPage !== undefined ? gridOptions : undefined}
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
              onCellValueChanged={onCellValueChanged}
              onRowValueChanged={onRowValueChanged}
            />

                    <div className="fixed-row">
                      <div className="fixed-row-cell">Total Hours: {sumOfMarks.toFixed(1)}</div>
                  
                      {/* Add more cells or custom content as needed */}
                    </div>
            
          </div>
        </div>
    </div>

    <Modal show={showAddTaskModal} centered onHide={handleCloseAddTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleAddTaskForm}
          >
            <Form.Group className='mt-2'>
            <Form.Select 
              name='projectname_id'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.projectname_id}
              >
                  <option>Project</option>
                  {projectNames && projectNames.map((proj, ind)=>{
                    return(
                      <option key={ind} value={proj._id}>{proj.name}</option>
                    )
                  })}
                 
              </Form.Select>
            </Form.Group>

            <Form.Group className='mt-2'>
            <Form.Select 
              name='interval'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.interval}
              >
                  <option value='Daily'>Daily</option>
                  <option value='Weekly'>Weekly</option>
                  <option value='Monthly'>Monthly</option>
                  <option value='Quarterly'>Quarterly</option>
                  
                 
              </Form.Select>
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Control
                  name='hrs'
                  type="number"
                  placeholder="Hrs"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.hrs}
              />
            </Form.Group>
            
            <Form.Group className='mt-2'>
              <Form.Control
                  name='description'
                  type="text"
                  placeholder="Task"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.description}
              />
            </Form.Group>
            <Form.Group className='mt-2'>
    
              <Form.Select 
              name='Jobholder'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.Jobholder}
              >
                  <option>Job Holder</option>
                  {preData && preData.map((manager, index)=>
                      <option key={index} value={manager.name}>{manager.name}</option>
                  )}
              </Form.Select>

            </Form.Group>

          
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseAddTaskModal}>Close</Button>
          <Button onClick={handleAddTaskForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

        </>
    );
}
}

export default UserRecurringTasks;

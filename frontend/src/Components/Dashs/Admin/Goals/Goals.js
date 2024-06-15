/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button, Form, Modal } from 'react-bootstrap';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GoalsDateFilter from './GoalsDateFilter';
import secureLocalStorage from 'react-secure-storage';


var GoalsGetAllUrl = axiosURL.GoalsGetAllUrl;
var GoalsAddOneUrl = axiosURL.GoalsAddOneUrl;
var GoalsEditOneUrl = axiosURL.GoalsEditOneUrl;
var GoalsDeleteOneUrl = axiosURL.GoalsDeleteOneUrl;



const Goals = (props) => {

  const filterFromMyList = props.myListPageFData

    const [gridApi, setGridApi] = useState(null);

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    
    const [showAddGoalModal, setShowAddGoalModal] = useState(false);

    const [users, setUsers] = useState();

    const [progressFValue, setProgressFValue] = useState("Progress")
    const [startDateFValue, setStartDateFValue] = useState("")
    const [endDateFValue, setEndDateFValue] = useState("")
    const [jobHolderFValue, setJobHolderFValue] = useState("")
    
    
    const [addGoalFormData, setAddGoalFormData] = useState({
      subject: "",
      achievement: "",
      startDate: "",
      endDate: "",
      goalType: "",
      jobHolder: ""
    })
    
    const gridRef = useRef();

    const handleFilters = async ()=>{

      var today = new Date();
      today.setHours(0, 0, 0, 0)

      var filteredArray = mainRowData

      filteredArray = filteredArray.map(obj => {
        var eDate = new Date(obj.endDate)
        eDate.setHours(0, 0, 0, 0)

        if(today > eDate){
          obj.status = "Completed"
        } else if(today <= eDate){
          obj.status = "Progress"
        }

        return obj;

      })

      if(jobHolderFValue ){
        filteredArray = filteredArray.filter(obj => obj.jobHolder === jobHolderFValue);
      }


      if(progressFValue === "Progress"){
        filteredArray = filteredArray.filter(obj => obj.status === "Progress");
      }
      if(progressFValue === "Completed"){
        filteredArray = filteredArray.filter(obj => obj.status === "Completed");
      }
      
      if(startDateFValue){
        filteredArray = filteredArray.filter(obj => {
          const sDate = new Date(obj.startDate)
          const filterValue = new Date(startDateFValue)
          if (obj.startDate !== 'Invalid Date') {
            const todayMonth = filterValue.getMonth();
            const todayYear = filterValue.getFullYear();
            const deadlineMonth = sDate.getMonth();
            const deadlineYear = sDate.getFullYear();
          
            if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
              return obj;
            }
          }
        });
      }
      
      if(endDateFValue){
        filteredArray = filteredArray.filter(obj => {
          const sDate = new Date(obj.endDate)
          const filterValue = new Date(endDateFValue)
          if (obj.endDate !== 'Invalid Date') {
            const todayMonth = filterValue.getMonth();
            const todayYear = filterValue.getFullYear();
            const deadlineMonth = sDate.getMonth();
            const deadlineYear = sDate.getFullYear();
          
            if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
              return obj;
            }
          }
        });
      }
      
      setRowData(filteredArray)

    }
    
    useEffect(()=>{
      setRowData(mainRowData)


      if(filterFromMyList){
        setJobHolderFValue(filterFromMyList && filterFromMyList.jobHolder)
      }
      handleFilters()
    },[filterFromMyList, mainRowData, progressFValue, startDateFValue, endDateFValue, jobHolderFValue])


    const getData = async ()=>{
        setLoader(true)
        try {
            const token = secureLocalStorage.getItem('token')
            const response = await axios.get(GoalsGetAllUrl,
              {
                headers:{ 
               'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + token
              }
             }
            );
            if(response.status === 200){
                setMainRowData(response.data.data)
                setUsers(response.data.users)
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

    const handleActionButtons = (e, action, Id)=>{
      e.preventDefault();
      if(action === "Delete"){
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
          axios.get(`${GoalsDeleteOneUrl}/${Id}`, {
            headers:{ 'Content-Type': 'application/json' }
          })
          
        }
      }
      setReRender(prev => !prev);
    }

    useEffect(() => {
        getData();
        
    }, [reRender]);
    
    
    
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
          headerName: 'Job Holder', 
          field: 'jobHolder', 
          flex:0.8,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: users && users.map(option => option.name),
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: users && users.map(option => option.name),
            onValueChange:(value) => setJobHolderFValue(value),
            value: jobHolderFValue,
            suppressFilterButton: true, 
            suppressInput: true 
          },
        },
        { 
          headerName: 'Subject', 
          field: 'subject', 
          flex:2,
        },
        { headerName: 'Achievement', field: 'achievement', flex:0.7 },
        { headerName: 'Achieved', field: 'achievedValue', flex:0.7 },
        { 
          headerName: 'Start Date', 
          field: 'startDate', 
          flex:1,
          floatingFilterComponent: 'GoalsDateFilter', 
          floatingFilterComponentParams: { 
            setHandleOnChange:(value) => setStartDateFValue(value),
            value: startDateFValue,
            suppressFilterButton: true, 
            suppressInput: true 
          }, 
          valueGetter: p => {
            if(p.data.startDate && p.data.startDate !== "Invalid Date")
            {
              // Input date: 2023-05-13
              const inputDate = new Date(p.data.startDate);
              // Extract the date components
              const day = inputDate.getDate();
              const month = inputDate.toLocaleString('default', { month: 'short' });
              const year = inputDate.getFullYear(); // Adding 1 year to convert to 2024
              // Format the date as "04-Feb-2024"
              const formattedDate = `${day < 10 ? '0' : ''}${day}-${month}-${year}`;
              return(formattedDate); // Output: 04-Feb-2024
            }
            else{
              return ""
            }
          }
        },
        { 
          headerName: 'End Date', 
          field: 'endDate', 
          flex:1,
          floatingFilterComponent: 'GoalsDateFilter', 
          floatingFilterComponentParams: { 
            setHandleOnChange:(value) => setEndDateFValue(value),
            value: endDateFValue,
            suppressFilterButton: true, 
            suppressInput: true 
          }, 
          valueGetter: p => {
            if(p.data.endDate && p.data.endDate !== "Invalid Date")
            {
              // Input date: 2023-05-13
              const inputDate = new Date(p.data.endDate);
              // Extract the date components
              const day = inputDate.getDate();
              const month = inputDate.toLocaleString('default', { month: 'short' });
              const year = inputDate.getFullYear(); // Adding 1 year to convert to 2024
              // Format the date as "04-Feb-2024"
              const formattedDate = `${day < 10 ? '0' : ''}${day}-${month}-${year}`;
              return(formattedDate); // Output: 04-Feb-2024
            }
            else{
              return ""
            }
          }
        },
        { 
          headerName: 'Goal Type', 
          field: 'goalType', 
          flex:1, 
          // editable: false,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ['Increase Clients', 'Increase Fee', 'Increase Leads', 'Leads Won'] },
        },
        { 
          headerName: 'Progress', 
          field: 'percentage', 
          flex:2,
          filter: false,
          sortable: false,
          editable: false,
          cellRendererFramework: p =>  
          <div style={{ width: 50, height: 50 }}>
            <CircularProgressbar 
              value={p.value} 
              text={`${p.value}%`} 
              styles={buildStyles({
                
                // Text size
                textSize: '20px',
            
                // Colors
                pathColor: `green`,
                textColor: 'green',

              })}
              
            />
          </div>
            
        },
        {
          headerName: 'Action', 
          field: 'price',
          floatingFilter: false,
          flex:0.5,
          cellRendererFramework: (params)=>
          <>
              <div>
                <Link onClick={(e)=>{e.preventDefault(); handleActionButtons(e, 'Delete', params.data._id)}} className='mx-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                    <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </Link>    
                  
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
       }));

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);


       
const frameworkComponents = {
  selectFloatingFilter: DropdownFilter,
  GoalsDateFilter: GoalsDateFilter,
};

async function onGridReady(params) {
  setGridApi(params);
}


  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Clients - ${new Date().toISOString().slice(0, 10)}`,
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
    const a = error;
  }
  };


  const handleAddFormDataChange = (e)=>{
    e.preventDefault();

    const {name, value} = e.target

    setAddGoalFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

  }

  const handleAddGoalForm = async (e)=>{
    e.preventDefault();

    try {
      const response = await axios.post(GoalsAddOneUrl,
          {
              formData:addGoalFormData 
          },
          {
              headers:{ 'Content-Type': 'application/json' }
          }
      );

      if(response.status === 200){
        setShowAddGoalModal(false);
        setReRender(prev => !prev)
        setAddGoalFormData({
          subject: "",
          achievement: "",
          startDate: "",
          endDate: "",
          goalType: "",
        });
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

  const onRowValueChanged = useCallback(async (event) => {
    var data = event.data;
    var idd = event.data._id
  
    await axios.post(`${GoalsEditOneUrl}/${idd}`, 
      {
        formData: data
      },
      {
        headers:{ 'Content-Type': 'application/json' }
      }
    );

    setReRender(prev => !prev)
  
  }, []);


      


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
                  Goals
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



            <div>
                <select name='mon_week' onChange={(e)=>{setProgressFValue(e.target.value)}} defaultValue={progressFValue} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "Progress">
                        Progress
                    </option>
                    <option value = "Completed">
                        Completed
                    </option>
                </select>
            </div>

          </div>

          <div className="d-flex">



          <Link onClick={exportToExcel} style={{
            backgroundColor: 'transparent',
            color: 'black',
            borderColor: 'lightgray',
            alignSelf: 'center',
          }} className='btn btn-primary mx-1'>
            Excel
          </Link>

          <Link onClick={()=>{setShowAddGoalModal(!showAddGoalModal)}} style={{
            alignSelf: 'center',
          }} className='btn btn-primary mx-1'>
            Add Goal
          </Link>

          

          {/* <div className='mx-1' style={{width: '260px'}} >
            <ReactDatePicker
            className='form-control text-center'
            placeholderText='Select Date Range'
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              dateFormat="dd-MMMM-yyyy"
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable={true}
            />
          </div> */}
          </div>

          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          <div className="ag-theme-alpine goalsTable" style={{ height: '81vh'}}>

            <AgGridReact
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                editType='fullRow'
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
                frameworkComponents={frameworkComponents}
                onRowValueChanged={onRowValueChanged}
            />

                    {/* <div className="fixed-row">
                      <div className="fixed-row-cell">Total Hours: {feeSum.toFixed(1)}</div>
                  
                    </div> */}
            
          </div>
        </div>
    </div>

    <Modal show={showAddGoalModal} centered onHide={()=>{ setShowAddGoalModal(!showAddGoalModal) }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          // onSubmit={handleAddTaskForm}
          >
            
            <Form.Group className='mt-2'>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                  name='subject'
                  type="text"
                  placeholder="Enter Subject"
                  onChange={handleAddFormDataChange}
                  value = {addGoalFormData.subject}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Label>Achievement</Form.Label>
              <Form.Control
                  name='achievement'
                  type="number"
                  placeholder="Enter Achievement"
                  onChange={handleAddFormDataChange}
                  value = {addGoalFormData.achievement}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                  name='startDate'
                  type="date"
                  onChange={handleAddFormDataChange}
                  value = {addGoalFormData.startDate}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
            <Form.Label>End Date</Form.Label>
              <Form.Control
                  name='endDate'
                  type="date"
                  onChange={handleAddFormDataChange}
                  value = {addGoalFormData.endDate}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
            <Form.Label>Job Holder</Form.Label>
              <Form.Select 
                name='jobHolder'
                onChange={handleAddFormDataChange}
                value = {addGoalFormData.jobHolder}
              >

                <option >Select Employee</option>
                {users &&users.map( user => 
                  <option value={user.name}>{user.name}</option>
                  
                  )}
                  
              </Form.Select>
            </Form.Group>

            <Form.Group className='mt-2'>
            <Form.Label>Goal Type</Form.Label>
              <Form.Select 
                name='goalType'
                onChange={handleAddFormDataChange}
                value = {addGoalFormData.goalType}
              >
                  <option>Select Goal Type</option>
                  <option>Increase Clients</option>
                  <option>Increase Fee</option>
                  <option>Increase Leads</option>
                  <option>Leads Won</option>
                  
                 
              </Form.Select>
            </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ ()=>{setShowAddGoalModal(!showAddGoalModal)}} >Close</Button>
          <Button onClick={handleAddGoalForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>


        </>
    );
}
}

export default Goals;

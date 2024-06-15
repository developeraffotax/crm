import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import Loader from '../../../../Common/Loader/Loader';
import Switch from 'react-js-switch';
import { Button, Form, Modal } from 'react-bootstrap';

var getEmployeeUrl = axiosURL.getEmployeeUrl;
var UserDeleteUrl = axiosURL.UserDeleteUrl;
var UserInactiveOneUrl = axiosURL.UserInactiveOneUrl;



const Employees = () => {

  const [showInactiveModal, setShowInactiveModal] = useState(false)
  const [end_date, setEnd_date] = useState(null)
  const [inactiveUserId, setInactiveUserId] = useState(null)
  const [gridApi, setGridApi] = useState(null);

  const [mainRowData, setMainRowData] = useState([ ]);
  const [rowData, setRowData] = useState([ ]);

  const [activeFilter, setActiveFilter] = useState("Active")

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)

    const [colVisibility, setColVisibility] = useState({
      name:false,
      noOfClients:false,
      totalHrs:false,
      totalFee:false,
      isActive:false,
      price:false,
      email:true,
      phone_number:true,
      username:true,
      start_date:true,
      address:true,
      emergenyc_contact:true,
      end_date:true
    })

    const gridRef = useRef();

    const handleFilters = ()=>{
      var filteredArray = mainRowData

      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Active"){
        filteredArray = filteredArray.filter(obj => obj.isActive === true);
        if(gridApi){
          gridApi.columnApi.setColumnVisible("end_date", false)
        }
      }

      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Inactive"){
        filteredArray = filteredArray.filter(obj => obj.isActive === false);
        if(gridApi){
          gridApi.columnApi.setColumnVisible("end_date", true)
        }
      }

      setRowData(filteredArray)
    }

    useEffect(()=>{
      handleFilters()
    },[mainRowData, activeFilter])

    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(getEmployeeUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setMainRowData(response.data)
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

    const handleDeleteUser = async (id)=>{
      const confirmed = window.confirm('Are you sure you want to delete this user?');
      if (confirmed) {

        const resp = await axios.get(`${UserDeleteUrl}/${id}`,
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );
        setReRender(!reRender);
      }
    }
    
    
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.2,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Employee Name', field: 'name', flex:1 },
        { headerName: 'Clients', field: 'noOfClients', flex:1 },
        { headerName: 'Total Hrs', field: 'totalHrs', flex:1 },
        { headerName: 'Total Fee', field: 'totalFee', flex:1 },
        { headerName: 'Status', 
        field: 'isActive', 
        flex:1,
        cellRendererFramework: (params)=>
            <>
            <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'Center',}}>
                <Switch color="#eef1f9" backgroundColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }} borderColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }}  value={params.data.isActive} onChange={()=>{ setInactiveUserId(params.data._id); setShowInactiveModal(true)}} />
            </div>
            </>
        },
        { headerName: 'Email', field: 'email', flex:1 },
        { headerName: 'Phone', field: 'phone_number', flex:1 },
        { headerName: 'User Name', field: 'username', flex:1 },
        { 
          headerName: 'Start Date', 
          field: 'start_date', 
          flex: 1,
          valueGetter: p => {
            if(p.data.start_date && p.data.start_date !== "Invalid Date")
            {
              const deadline = new Date(p.data.start_date)
                if( deadline !== "Invalid Date" ){
                  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
                  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
                  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
                  return(`${da}-${mo}-${ye}`);
                }else{
                  return ""
                }    
              }
              else{
                return ""
            }    
          },
        },
        { 
          headerName: 'End Date', 
          field: 'end_date', 
          flex: 1,
          valueGetter: p => {
            if(p.data.end_date && p.data.end_date !== "Invalid Date")
            {
              const deadline = new Date(p.data.end_date)
                if( deadline !== "Invalid Date" ){
                  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
                  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
                  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
                  return(`${da}-${mo}-${ye}`);
                }else{
                  return ""
                }    
              }
              else{
                return ""
            }    
          },
        },
        { headerName: 'Address', field: 'address', flex:1 },
        { headerName: 'Emergency Contact', field: 'emergenyc_contact', flex:1 },
        {
          headerName: 'Action', 
          field: 'price', 
          flex:1,
          floatingFilter: false,
          cellRendererFramework: (params)=>
          <>
              <div>
                  <Link to={'/hr/employees/edit/' + params.data._id}  className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
                  <button onClick={()=>{handleDeleteUser(params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</button>
              </div> 
          </>
      },
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: false,
        resizable: true
       }));

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

      const handleInactiveUser= async ()=>{
        await axios.post(`${UserInactiveOneUrl}/${inactiveUserId}`,
        {
          end_date: end_date,
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
        
        setShowInactiveModal(false)
        setReRender(!reRender)
      }

      async function onGridReady(params) {
        setGridApi(params);
      }

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

      const handleColHideOnStart= ()=>{
        if(gridApi){
          gridApi.columnApi.setColumnVisible("email", false)
          gridApi.columnApi.setColumnVisible("phone_number", false)
          gridApi.columnApi.setColumnVisible("username", false)
          gridApi.columnApi.setColumnVisible("start_date", false)
          gridApi.columnApi.setColumnVisible("address", false)
          gridApi.columnApi.setColumnVisible("emergenyc_contact", false)
          gridApi.columnApi.setColumnVisible("end_date", false)
        }
        
      }

      useEffect(()=>{
        if(gridApi){
          handleColHideOnStart();
        }
      },[gridApi])


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
                  Employees
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
              <div className="dropdown">
                <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
                <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "name")}} className={`dropdown-item ${!colVisibility.name? "" : "active"}`}  >Employee Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "noOfClients")}} className={`dropdown-item ${!colVisibility.noOfClients? "" : "active"}`} >Clients</button></li> 
                        <li><button onClick={(e)=>{toggleColHandler(e, "totalHrs")}} className={`dropdown-item ${!colVisibility.totalHrs? "" : "active"}`} >Total Hours</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "totalFee")}} className={`dropdown-item ${!colVisibility.totalFee? "" : "active"}`} >Total Fee</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "isActive")}} className={`dropdown-item ${!colVisibility.isActive? "" : "active"}`} >Status</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "price")}} className={`dropdown-item ${!colVisibility.price? "" : "active"}`} >Action</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "email")}} className={`dropdown-item ${!colVisibility.email? "" : "active"}`} >Email</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "phone_number")}} className={`dropdown-item ${!colVisibility.phone_number? "" : "active"}`} >Phone Number</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "username")}} className={`dropdown-item ${!colVisibility.username? "" : "active"}`} >User Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "start_date")}} className={`dropdown-item ${!colVisibility.start_date? "" : "active"}`} >Start Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "address")}} className={`dropdown-item ${!colVisibility.address? "" : "active"}`} >Address</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "emergenyc_contact")}} className={`dropdown-item ${!colVisibility.emergenyc_contact? "" : "active"}`} >Emergency Contact</button></li>
                      </ul>
                </div>
              </div>
            </div>

            <div>
                <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "Active">
                        Active
                    </option>
                    <option value = "Inactive">
                        Inactive
                    </option>
                </select>
            </div>

          </div>

          <div className='mx-4'>
            <Link to="/hr/employees/add" className='btn btn-primary'>
              Add Employee
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
            />
            
          </div>
        </div>
    </div>


    <Modal show={showInactiveModal} centered onHide={()=>{setShowInactiveModal(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>Inactive User</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          // onSubmit={handleSubmit}
          >
            <Form.Group style={{marginTop: "10px"}} controlId="formName">
              <Form.Label>Leave Date</Form.Label>
              <Form.Control
                  type="date"
                  placeholder="Leave Date"
                  name="end_date"
                  onChange = {(e)=>{e.preventDefault(); setEnd_date(e.target.value)}}
                  value = {end_date}
              />
            </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowInactiveModal(false)}}>Close</Button>
          <Button onClick={handleInactiveUser} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

        </>
    );
}
}
export default Employees;

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import Switch from 'react-js-switch';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import ReactDatePicker from 'react-datepicker';

import { useSpring, animated } from 'react-spring';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


var getClientsUrl = axiosURL.getClientsUrl;
var deleteClientUrl = axiosURL.deleteClientUrl;
var ActiveInactiveUrl = axiosURL.ActiveInactiveUrl;



const Clients = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyNameFromUrl = queryParams.get('companyName');

  const roleName = props.roleName
  const {state} = useLocation();
  const navigate = useNavigate();

    const [stateVal, setStateVal] = useState(state);

    const [gridApi, setGridApi] = useState(null);

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);

    const [feeSum, setFeeSum] = useState(0);

    const [activeFilter, setActiveFilter] = useState("Active")

    const [partnerFValue, setPartnerFValue] = useState(null)
    const [sourceFValue, setSourceFValue] = useState(null)
    const [departmentFvalue, setDepartmentFValue] = useState("")

    const [isOpen, setIsOpen] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const gridRef = useRef();

    const handleFilters = async ()=>{
      // const roo = mainrowData; 
      var filteredArray = mainRowData

      

      // Department Filter
      if(filteredArray != undefined && departmentFvalue != null && departmentFvalue !== ''){
        // filteredArray = filteredArray.filter(obj => (obj.deptListToCheck.company_name_t === obj.company_name) && (obj.deptListToCheck.departments.includes(departmentFvalue)) );

        filteredArray = filteredArray.filter(obj =>
          obj.deptListToCheck.some(obj2 =>
            obj2.company_name_t === obj.company_name && obj2.departments.includes(departmentFvalue)
          )
        );
      }

      // company_name Filter
      if(filteredArray != undefined && companyNameFromUrl != null && companyNameFromUrl !== ""){
        filteredArray = filteredArray.filter(obj => obj.company_name === companyNameFromUrl);
      }

      // JobStatus Filter
      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Active"){
        filteredArray = filteredArray.filter(obj => obj.isActive === true);
      }

      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Inactive"){
        filteredArray = filteredArray.filter(obj => obj.isActive === false);
      }

      // Source Filter
      if(filteredArray != undefined && sourceFValue != null && sourceFValue !== ""){
        filteredArray = await filteredArray.filter(obj => obj.source && obj.source === sourceFValue);
      }


      // Partners Filter
      if(filteredArray != undefined && partnerFValue != null && partnerFValue !== ""){
        filteredArray = await filteredArray.filter(obj => obj.partner && obj.partner === partnerFValue);
      }

      // Date Filter
      if(stateVal){

        filteredArray = filteredArray.filter(obj => {
          if (obj.book_start_date) {
            const dateObj = new Date(obj.book_start_date);
            const objMonth = dateObj.toLocaleString('default', { month: 'short' });
            const objYear = dateObj.getFullYear();
            return objMonth === stateVal.monthName && objYear === +stateVal.Year.trim();
          }
        });
      }

      //Date Range Filter
      else if(filteredArray != undefined && startDate != null && startDate !== "" && endDate != null && endDate !== ""){
        filteredArray = filteredArray.filter(obj => {
          if (obj.book_start_date) {
            const bookStartDate = new Date(obj.book_start_date);
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            return bookStartDate >= startDateObj && bookStartDate <= endDateObj;
          }
          return false;
        });
      }

      // total_fee
      if(filteredArray){
        var summ = 0;
        filteredArray.forEach((item) => {
          if(item.total_fee && item.total_fee !== ""){
            summ = +summ + +item.total_fee
          }
        })
        setFeeSum(summ);
      }

      setRowData(filteredArray)

    }

    
    const handleToggle = () => {
      setIsOpen(!isOpen);
  };
    
    const dropdownAnimation = useSpring({
      maxHeight: isOpen ? 'fit-content' : 0,
      opacity: isOpen ? 1 : 0,
      position: 'absolute',
      backgroundColor: 'white',
      width: '13.5%',
      boxShadow: 'rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px',
      borderRadius: '0px 0px 9px 9px',
  });


    useEffect(()=>{
      setRowData(mainRowData)
      handleFilters()
    },[mainRowData, activeFilter, sourceFValue, partnerFValue, endDate, departmentFvalue, stateVal])


    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(getClientsUrl,
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
          headerName: 'Book Start Date', 
          field: 'book_start_date', 
          flex:1,
          valueGetter: p => {
            if(p.data.book_start_date && p.data.book_start_date !== "Invalid Date")
            {

              // Input date: 2023-05-13
              const inputDate = new Date(p.data.book_start_date);

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
        { headerName: 'Company Name', field: 'company_name', flex:3 },
        { headerName: 'Client Name', field: 'client_name', flex:4 },
        { headerName: 'Hours', field: 'total_hours', flex:1 },
        { headerName: 'Fee', field: 'total_fee', flex:1 },
        { 
          headerName: 'Partner', 
          field: 'partner', 
          flex:1,
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Affotax', 'Outsource', 'OTL'],
            onValueChange:(value) => setPartnerFValue(value),
            value: partnerFValue,
            suppressFilterButton: true, 
            suppressInput: true 
          } 
        },
        
        // { headerName: 'Status', field: 'isActive', flex:1 },
        { headerName: 'Status', 
        field: 'isActive', 
        flex:1,
        cellRendererFramework: (params)=>
            <>
            <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'Center',}}>
                <Switch color="#eef1f9" backgroundColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }} borderColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }}  value={params.data.isActive} onChange={()=>{ const data = {id: params.data._id, status: params.data.isActive}; handleActionButtons('ActiveInactive', data)}} />
            </div>
            </>
      },
        {
            headerName: 'Action', 
            field: 'price',
            floatingFilter: false,
            flex:2,
            cellRendererFramework: (params)=>
            <>
                <div>
                    <Link to={'/client/' + params.data._id} className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
                    <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</Link>
                </div> 
            </>
        }
      ];

      
  if(roleName === "Admin"){
    const obj = { 
      headerName: 'Source', 
      field: 'source', 
      flex:1,
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['FIV', 'UPW', 'PPH', 'Website', 'Referal', 'Partner'],
        onValueChange:(value) => setSourceFValue(value),
        value: sourceFValue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
    }

     columnDefs.splice(7, 0, obj);
   }

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

      const handleActionButtons = async (type, id)=>{
        
        if(type === "Delete"){

          const confirmed = window.confirm('Are you sure you want to delete this item?');

          if (confirmed) {
            const response = await axios.get(`${deleteClientUrl}/${id}`,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          } else {
            // user clicked Cancel, do nothing
          }
        }

        if(type === "ActiveInactive"){

          const stt = !id.status
  
          const response = await axios.post(`${ActiveInactiveUrl}/${id.id}`,
            {
              status: stt
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
        }
  
        setReRender(!reRender)
  
       }

       
const frameworkComponents = {
  selectFloatingFilter: DropdownFilter,
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
                  Clients
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

            {stateVal && 
            <div  className='table-show-hide mx-2'>
              <button type="button" onClick={()=>{navigate(location.pathname); setStateVal(null)}} 
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
            }


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

          <div className="d-flex">



          <Link onClick={exportToExcel} style={{
            backgroundColor: 'transparent',
            color: 'black',
            borderColor: 'lightgray',
            alignSelf: 'center',
          }} className='btn btn-primary mx-1'>
            Excel
          </Link>

          <div className='mx-2' style={{
              width: '11rem',
              overflow: 'visible',
              zIndex: '100',
              alignSelf: 'center',
              marginRight: '19px',
        }}>
                <div style={{
                    width: '100%',     
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: '1.5',
                    fontSize: '1rem', 
                    borderBottom: '1px solid #ced4da', 
                    padding: '8px', 
                    borderRadius: '0rem',
                    cursor: 'pointer',
                }} 
                onClick={handleToggle}
                >
                        <div  style={{width: '100%'}} className='row'>
                            <div className='col-10'>
                                {departmentFvalue !== '' ? departmentFvalue : "Departments"}
                            </div>
                            <div style={{padding: '0px', textAlign: 'right',}} className='col-2'>
                                <svg style={{width: '20px', stroke: 'rgb(123, 129, 144)'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 10l5 5 5-5" stroke="#7b8190" stroke-width="2" fill="none"></path></svg>
                            </div>
                        </div>
                </div>
                <animated.div style={dropdownAnimation}>
                    {isOpen && (
                    <div >
                        <div style={{padding: 10}}>
                        
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue(''); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> All Departments </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Bookkeeping'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Bookkeeping </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Payroll'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Payroll </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Vat Return'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Vat Return </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Accounts'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Accounts </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Personal Tax'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Personal Tax </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Company Sec'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Company Sec </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Address'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Address </p>
                                </div>
                            </div>
                           
                        {/*  */}
                            <div onClick={()=>{setDepartmentFValue('Billing'); handleToggle() }} style={{cursor: 'pointer'}} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> Billing </p>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                    )}
                </animated.div>
            </div>

          <div className='mx-1' style={{width: '260px'}} >
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
          </div>
          </div>

          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
                frameworkComponents={frameworkComponents}
            />

                    <div className="fixed-row">
                      <div className="fixed-row-cell">Total Hours: {feeSum.toFixed(1)}</div>
                  
                      {/* Add more cells or custom content as needed */}
                    </div>
            
          </div>
        </div>
    </div>


        </>
    );
}
}

export default Clients;

import React, { useEffect, useMemo, useState } from 'react'

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import { Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../../Common/Loader/Loader';

var GetAllAttendance = axiosURL.GetAllAttendance;

export default function Attendance() {

    const [loader, setLoader] = useState(false)
    const [mainData, setMainData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [usersList, setUsersList] = useState();
    const [noOfDaysOfMonth, setNoOfDaysOfMonth] = useState(null);
    const [finalColDef, setFinalColDef] = useState(null);
    const [month, setCurMonth] = useState(
        {
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        });
    const [selectedDate, setSelectedDate] = useState(new Date())

    const getData = async ()=>{
        setLoader(true)
        const response = await axios.get(GetAllAttendance,         
            {
                headers:{ 'Content-Type': 'application/json' }
            }
        );

        if(response.status === 200 || response.status === 304){
            setMainData(response.data)
            setLoader(false)
        }
        
    }

    useEffect(()=>{
        if(mainData){
            //Seperating Users
            setUsersList([...new Set(mainData.map(item => item.user_id && item.user_id !== null && item.user_id.name).filter(Boolean))]);
        }
    },[mainData])

    useEffect(()=>{
        if(mainData){
            // Filter the array to only include objects with a startTime in the current month
            const currentMonthData = mainData.filter(obj => {
                const monthh = new Date(obj.startTime).getMonth();
                const yearr = new Date(obj.startTime).getFullYear();
                return (monthh === month.month && yearr === month.year);
            });
            
            const dateeee = new Date(selectedDate);
            const yearrrr = dateeee.getFullYear();
            const monthhhh = dateeee.getMonth() + 1; // month is zero-indexed, so add 1 to get the actual month number
            const numberOfDaysInCurrentMonth = new Date(yearrrr, monthhhh, 0).getDate();

            setNoOfDaysOfMonth(numberOfDaysInCurrentMonth)
            var finalAttendanceArray = [];
            for(const user in usersList){
                var attendance = [];
                var noOfDaysPresent = 0
                var noOfDaysAbsent = 0
                for(var i = 1; i <= numberOfDaysInCurrentMonth; i++){
                    const dateToSearch = new Date(`${month.month + 1}/${i}/${month.year}`);
                    const result = currentMonthData.length > 0 ? currentMonthData.find((item) => {
                        const startTimee = new Date(item.startTime)
                        if(!item.user_id){
                            return false
                        }
                        return(
                            startTimee.setHours(0, 0, 0) === dateToSearch.setHours(0, 0, 0) && 
                            item.user_id.name === usersList[user]
                        )
                    }) : false;
                    var isPresent = false
                    var entries = []
                    
                    if (result) {
                       isPresent = true
                       noOfDaysPresent = noOfDaysPresent + 1;
                       entries = currentMonthData.filter((item) => {
                        const startTimee = new Date(item.startTime)
                        if(!item.user_id){
                            return false
                        }
                        return(
                            startTimee.setHours(0, 0, 0) === dateToSearch.setHours(0, 0, 0) && 
                            item.user_id.name === usersList[user]
                        )
                    });
                    } else {
                        noOfDaysAbsent = noOfDaysAbsent + 1;
                    }
                    var totalTimeofDay = 0
                    //Calculate total hrs of day
                    if(entries.length > 0){
                        let totalHours = 0;
                        let totalMinutes = 0;
                        let totalSeconds = 0;
                        entries.forEach(entry => {
                        const startTime = new Date(entry.startTime).getTime();
                        const endTime = new Date(entry.endTime).getTime();
                        const diff = endTime - startTime;
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                        entry.totalEntryTime = `${hours}.${minutes}.${seconds}`;
                        totalHours += hours;
                        totalMinutes += minutes;
                        totalSeconds += seconds;
                        });
                        totalMinutes += Math.floor(totalSeconds / 60);
                        totalSeconds %= 60;
                        totalHours += Math.floor(totalMinutes / 60);
                        totalMinutes %= 60;
                        totalTimeofDay = `${totalHours}.${totalMinutes}.${totalSeconds}`;
                    }

                    var data = {
                        date: `${i}-${month.month}-${month.year}`,
                        dateToSearch: `${month.year}-${month.month + 1}-${i}`,
                        entries,
                        totalTimeofDay,
                        isPresent,
                    }
                    attendance.push(data)
                }
                var employee = {
                    name: usersList[user],
                    totalDays: numberOfDaysInCurrentMonth,
                    noOfDaysPresent,
                    noOfDaysAbsent,
                    attendance
                }
                finalAttendanceArray.push(employee)
            }
            setTableData(finalAttendanceArray)
        }
    },[ usersList, month])

    useEffect(()=>{
        getData();
    },[])
    

    useEffect(()=>{
        if(tableData)
        {
            var columnDefs = [
                { headerName: 'Employee Name', field: 'name', flex: 4 }
            ];


            for(var i = 0; i < noOfDaysOfMonth; i++){

                const num = i;

                const obj = { 
                    headerName: `${i+1}`,
                    flex:1,
                    cellStyle: p => {
                        const date = new Date(p.data.attendance[num].dateToSearch);
                        const dayOfWeek = date.getDay();
                        // if (dayOfWeek === 0 || dayOfWeek === 6) {
                        //     //mark police cells as red
                        //     return { backgroundColor: '#ff72477d'};
                        // }else{
                        //     return null;
                        // }
                        const absent = p.data.attendance[num].isPresent;
                        if (!absent && !(dayOfWeek === 0 || dayOfWeek === 6) && !(date > new Date)) {
                            //mark police cells as red
                            return { 
                                backgroundColor: '#ff72477d',
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '0px',
                                padding: '0px',
                                alignItems: 'center',
                            };
                        }else{
                            return { 
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '0px',
                                padding: '0px',
                                alignItems: 'center',
                            };
                        }
                    },
                    cellRendererFramework: (p)=>{
                        if(new Date(p.data.attendance[num].dateToSearch) > new Date){
                            return(
                                <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            )
                        }else{
                            if(p.data.attendance[num].isPresent){
                                return(
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                            <title/>
                                            <g id="Complete">
                                            <g id="tick">
                                            <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                            </g>
                                            </g>
                                        </svg>
                                    </div>
                                )
                            } else {
                                return(
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                )
                            }
                        }
                    }
                }
                columnDefs.push(obj)
            }
                
            const obj2 = { 
                headerName: 'Total', 
                field: 'total',
                flex:1,
                valueGetter: p => {
                    return `${p.data.noOfDaysPresent} / ${p.data.totalDays}`  //to get value from obj inside obj
                },
            }
            columnDefs.push(obj2)

            setFinalColDef(columnDefs);
        }
            
    },[tableData])

    

    const defaultColDef = useMemo( ()=> ({
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: false,
        resizable: true
       }));

       

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
                  Attendance
              </h4>
            </div>

            {/* <div  className='table-col-numbers mx-2'>
              <select className='form-control' onChange={onPageSizeChanged} id="page-size">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div> */}

          </div>

          <div style={{marginRight: '15px'}}>
          <DatePicker
          style={{textAlign: 'center'}}
          className='form-control text-center'
            selected={selectedDate}
            onChange={(date) => {
                setSelectedDate(date);
                setCurMonth(
                    {
                        month: new Date(date).getMonth(),
                        year: new Date(date).getFullYear()
                    });
            }}
            dateFormat="MMMM-yyyy"
            showMonthYearPicker  
        />
          </div>

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>


            {finalColDef && <AgGridReact
            //   onGridReady={onGridReady}
                columnDefs={finalColDef}
                rowData={tableData}
                defaultColDef={defaultColDef}
                // ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
            />}
            
          </div>
        </div>
    </div>


    {/* <Modal show={showInactiveModal} centered onHide={()=>{setShowInactiveModal(false)}}>
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
      </Modal> */}

        </>
  )
}
}

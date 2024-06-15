/* eslint-disable no-loop-func */
import { useEffect, useMemo, useState, useCallback } from 'react';
import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../../Common/Loader/Loader';



const GetAllAttendance = axiosURL.GetAllAttendance;

function Absents() {
  const [loader, setLoader] = useState(true);
  const [mainData, setMainData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [finalColDef, setFinalColDef] = useState(null);
  const [month, setCurMonth] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(GetAllAttendance, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 304) {
        setMainData(response.data);
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (mainData.length > 0) {
      const uniqueUsers = [...new Set(mainData.map(item => item.user_id && item.user_id !== null && item.user_id.isActive && item.user_id.name ).filter(Boolean))];
      setUsersList(uniqueUsers);
    }
  }, [mainData]);

  useEffect(() => {

    if (mainData.length > 0) {
      
      const currentMonthData = mainData.filter(obj => {
        const yearr = new Date(obj.startTime).getFullYear();
        return (yearr === month.year);
      });

      const dateeee = new Date(selectedDate);
      const yearrrr = dateeee.getFullYear();

      const finalAttendanceArray = [];

      
      
      usersList.forEach(user => {
        var months=[]; 
        const userFirstTimer = currentMonthData.find(dataa => ( dataa.user_id && dataa.user_id.name === user ))
        const userData = currentMonthData.filter(dataa => ( dataa.user_id && dataa.user_id.name === user ))
        console.log(userFirstTimer)
        for(var i = 1; i <= 12; i++ ){
          const noOfDaysInCurMonth = new Date(yearrrr, i, 0).getDate();
          var monthCount = 0;
          for(var z = 1; z <= noOfDaysInCurMonth; z++){
            let foundInCurrentDate = false; 
            const checkDate = new Date(`${i}-${z}-${yearrrr}`)
            const startDate = new Date(userFirstTimer && userFirstTimer.startTime);
            const today = new Date();
            if( ( checkDate.setHours(0, 0, 0) < today.setHours(0, 0, 0) ) && ( checkDate.setHours(0, 0, 0) > startDate.setHours(0, 0, 0) ) ){
              const isWeekday = (checkDate) => {
                const d = new Date(checkDate);
                const dayOfWeek = d.getDay();
                // Return true if the day is not Sunday (0) or Saturday (6)
                return dayOfWeek !== 0 && dayOfWeek !== 6;
              };
              if( isWeekday(checkDate) ){
                if(foundInCurrentDate){
                  break;
                }
                userData.some((item) => {
                  const dateToCheck = new Date(`${i}-${z}-${yearrrr}`)
                  const dateFromDb = new Date(item.startTime);
                  if( ( dateToCheck.setHours(0, 0, 0) === dateFromDb.setHours(0, 0, 0) ) ){
                    foundInCurrentDate = true
                   return true
                  }
                  return false
                });
                if(!foundInCurrentDate){
                  monthCount += 1;
                }
              }
            }
          }
          months[i - 1] = monthCount;
        }
        const obj = {
          name: user,
          months
        }
        finalAttendanceArray.push(obj)
      })
      setTableData(finalAttendanceArray);
      setLoader(false);
    }
  },  [usersList, month, selectedDate, mainData]);

  useEffect(() => {
    if (tableData.length > 0) {
      const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

      let columnDefs = [
        { headerName: 'Employee Name', field: 'name', flex: 4 },
      ];

      for (let w = 0; w <= 11; w++) {
          columnDefs.push({ headerName: months[w], field: `monthsVal`, flex: 2, valueGetter: (params) => {
          if(params.data.months[w] > 0){
            return(params.data.months[w])
          }else {
            return "-"
          }
            
          }, });
      }

      columnDefs.push({
        headerName: 'Total',
        field: 'total',
        flex: 2,
        valueGetter: (params) => {
          var total = 0;
          for (let month = 0; month <= 11; month++) {
            if (params.data[month] !== "-") {
              total += +params.data.months[month];
            }
          }
          return total;
        }
      });

      setFinalColDef(columnDefs);
    }
  }, [tableData, selectedDate]);

  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: false,
    resizable: true
  }), []);

  if (loader) {
    return <Loader />;
  } else {
    return (
      <div style={{
        border: 'none'
      }}
        className="mt-3 card" >

        <div style={{ alignItems: 'center', justifyContent: 'space-between' }} className='d-flex'>

          <div style={{ alignItems: 'center' }} className='d-flex'>

            <div >
              <h4 style={{ padding: '20px 16px' }}>
                Absents
              </h4>
            </div>

          </div>

          <div style={{ marginRight: '15px' }}>
            <DatePicker
              style={{ textAlign: 'center' }}
              className='form-control text-center'
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setCurMonth(
                  {
                    year: new Date(date).getFullYear()
                  });
              }}
              dateFormat="yyyy"
              showYearPicker
              maxDate={new Date()} // Set maximum date
            />
          </div>

        </div>

        <hr style={{ marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)' }} />

        <div>
          <div className="ag-theme-alpine" style={{ height: '81vh' }}>
            {finalColDef && <AgGridReact
              columnDefs={finalColDef}
              rowData={tableData}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection='multiple'
              pagination={true}
              paginationPageSize={25}
              suppressDragLeaveHidesColumns={true}
            />}
          </div>
        </div>
      </div>
    );
  }
}

export default Absents;

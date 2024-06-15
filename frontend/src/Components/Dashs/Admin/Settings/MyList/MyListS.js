

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import secureLocalStorage from 'react-secure-storage';

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';

var userListDataSave = axiosURL.userListDataSave;


const MyListS = () => {
    const [rowData, setRowData] = useState(null);

    const setData = ()=>{
        if( secureLocalStorage.getItem("MyList") ){
            setRowData( secureLocalStorage.getItem("MyList") )
        } else {
    
            const List = [
                {
                    id: 1,
                    page: "Job Planning",
                    visible: false
                },
                {
                    id: 2,
                    page: "Tasks",
                    visible: false
                },
                {
                    id: 3,
                    page: "Leads",
                    visible: false
                },
                {
                    id: 4,
                    page: "Proposals",
                    visible: false
                },
                {
                    id: 5,
                    page: "Construction",
                    visible: false
                },
                {
                    id: 6,
                    page: "Recurring Tasks",
                    visible: false
                },
                {
                    id: 7,
                    page: "Templates",
                    visible: false
                },
                {
                    id: 8,
                    page: "Goals",
                    visible: false
                },
            ]
    
            secureLocalStorage.setItem("MyList", List)
    
            setRowData( List )
        }
    }

    useEffect(()=>{
        setData()
    },[])

    const handleSelectionChange = async (id, value)=>{
        const updatedValue = rowData.map(item => {
            if(item.id === id){
                item.visible = value;
                return item
            }
            return item
        });
        
        const token = secureLocalStorage.getItem('token') 
        const response = await axios.post(`${userListDataSave}`,
            {
                updatedValue
            },
            {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
        );
        console.log(response)
    
        secureLocalStorage.setItem("MyList", updatedValue);
        setRowData(updatedValue);
    }


    const gridRef = useRef();

    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.6,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Page', field: 'page', flex:1 },
        { 
            headerName: 'Visible', 
            field: 'visible', 
            flex:3,
            cellRendererFramework: (p)=>
            <>
              <input style={{width: '100%', height: '80%', marginTop: '4.5px',}} checked={p.data.visible} onClick={(e)=>{e.preventDefault(); handleSelectionChange(p.data.id, !p.data.visible)}} type="checkbox" /> 
            </>,
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
                  MyList Pages
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


          

          </div>
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
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


        </>
    );
}

export default MyListS;

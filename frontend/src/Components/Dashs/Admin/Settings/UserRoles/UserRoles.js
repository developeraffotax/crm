

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import Switch from 'react-js-switch';

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import Loader from '../../../../Common/Loader/Loader';

var getUserRolesUrl = axiosURL.getUserRolesUrl;
var assignRoleToUserUrl = axiosURL.assignRoleToUserUrl;



const UserRoles = () => {

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)
    const [preData, setPreData] = useState([])
    const [gridApi, setGridApi] = useState(null);

    const [rowData, setRowData] = useState([ ]);


    const gridRef = useRef();

    async function onGridReady(params) {
        setGridApi(params);
      }

    //


    useEffect(()=>{
        const tempArr = preData
        
            const newObj = { value: null, label: 'Select' };
    
            tempArr.unshift(newObj);
    
            setPreData(tempArr)
    
       }, [preData])



    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(getUserRolesUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setRowData(response.data.users)
                setPreData(response.data.roles.map(names => {
                    return { value: names._id, label: names.name };
                  }));
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


    const onRowValueChanged = useCallback(async (event) => {
        var data = event.data;
        
        
        const resp = await axios.post(assignRoleToUserUrl, 
          {
            _id: data._id,
            role_id: data.role_id,
          },
          {
            headers:{ 'Content-Type': 'application/json' }
          }
        );
      
        setReRender(!reRender)
      
      }, []);
    
    
    
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
        { headerName: 'User', field: 'name', flex:1 },
        { headerName: 'Role', field: 'roles', flex:3,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: preData && preData.map(option => option.label),
        },
        valueGetter: p => {
            return p.data.role_id ? p.data.role_id.name : "Choose Role" //to get value from obj inside obj
          },
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

    //   const handleActionButtons = async (type, id)=>{
        
    //     if(type === "Delete"){

    //       const confirmed = window.confirm('Are you sure you want to delete this item?');

    //       if (confirmed) {
    //         const response = await axios.get(`${deleteClientUrl}/${id}`,
    //         {
    //             headers:{ 'Content-Type': 'application/json' }
    //         }
    //       );
    //       } else {
    //         // user clicked Cancel, do nothing
    //       }
    //     }

    //     if(type === "ActiveInactive"){

    //       const stt = !id.status
  
    //       const response = await axios.post(`${ActiveInactiveUrl}/${id.id}`,
    //         {
    //           status: stt
    //         },
    //         {
    //             headers:{ 'Content-Type': 'application/json' }
    //         }
    //       );
    //     }
  
    //     setReRender(!reRender)
  
    //    }

    const onCellValueChanged = useCallback((event) => {
        if(event.colDef.field === "roles"){
          const selectedOption = preData.find(option => option.label === event.data.roles);
          event.data.role_id = selectedOption ? selectedOption.value : '';
        }
      }, [gridApi]);
      


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
                  User Roles
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

          {/* <div className='mx-4'>
            <Link to="/hr/employees/add" className='btn btn-primary'>
              Add Employee
            </Link>
          </div> */}
          

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
            />
            
          </div>
        </div>
    </div>


        </>
    );
}
}

export default UserRoles;

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
import { Button, Form, Modal } from 'react-bootstrap';

var ChartsOfAccountsGetAllUrl = axiosURL.ChartsOfAccountsGetAllUrl;
var ChartsOfAccountsAddOneUrl = axiosURL.ChartsOfAccountsAddOneUrl;



const ChartsOfAccounts = () => {

  const True = true
  const False = false

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)
    const [rowData, setRowData] = useState([ ]);
    const [showAddCOA, setShowAddCOA] = useState(false)

    const [addCOAFormData, setAddCOAFormData] = useState({
        account_type: null,
        code: null,
        name: null
    })

    const [addFormCodeAuth, setAddFormCodeAuth] = useState({
        isError: false,
        error: null
    })

    const gridRef = useRef();

    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(ChartsOfAccountsGetAllUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setRowData(response.data.COA)
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
            flex: 0.5,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Code', field: 'code', flex:2 },
        { headerName: 'Name', field: 'name', flex:2 },
        { headerName: 'Type', field: 'account_type', flex:2 }
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: false,
        floatingFilter: false,
        editable: false,
        resizable: true
       }));

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

    function submitFormCheck(e){
        e.preventDefault();
        
        
            if(addCOAFormData.account_type === "Turnover"){
                if(+addCOAFormData.code < 100 || +addCOAFormData.code > 199){
                    setAddFormCodeAuth({
                        isError: true,
                        error: "Turnover Code Must be between 100 - 199"
                    })
                } else {
                    submitAddForm();
                }
            }
            else if(addCOAFormData.account_type === "Direct Cost" ){
                if(+addCOAFormData.code < 200 || +addCOAFormData.code > 299){
                    setAddFormCodeAuth({
                        isError: true,
                        error: "Direct Cost Code Must be between 200 - 299"
                    })
                } else {
                    submitAddForm();
                }
            }
            else if(addCOAFormData.account_type === "Admin Expenses"){
                if(+addCOAFormData.code < 300 || +addCOAFormData.code > 399){
                    setAddFormCodeAuth({
                        isError: true,
                        error: "Admin Expenses Code Must be between 300 - 399"
                    })
                } else {
                    submitAddForm();
                }
            }
    }

    async function submitAddForm(){
        const response = await axios.post(`${ChartsOfAccountsAddOneUrl}`,
            {
                formData: addCOAFormData
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if (response.status === 200){
            setShowAddCOA(false)
            setAddCOAFormData({
                account_type: null,
                code: null,
                name: null
            })  
            setReRender(prev => !prev)
          }
  
    }


    function handleAddFormDataChange(e) {
        const enteredValue = e.target.value;
        const enteredField = e.target.name;

        setAddFormCodeAuth({
            isError: false,
            error: null
        })

        setAddCOAFormData(prevState => ({
            ...prevState,
            [enteredField]: enteredValue
        }));

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
                  Chart Of Accounts
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

          <div className='mx-4'>
            <Link onClick={()=>{setShowAddCOA(!showAddCOA)}} className='btn btn-primary'>
              Add COA
            </Link>
          </div>
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData.length > 0 ? rowData : []}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                // rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
            />
            
          </div>
        </div>
    </div>

    <Modal show={showAddCOA} centered onHide={()=>{setShowAddCOA(!showAddCOA)}}>
        <Modal.Header closeButton>
          <Modal.Title>Add Chart Of Accounts</Modal.Title>
        </Modal.Header>
          <Form 
          onSubmit={submitFormCheck}
          >
        <Modal.Body>

            <Form.Group className='mt-2'>
              <Form.Select 
              name='account_type'
              onChange={handleAddFormDataChange}
              value = {addCOAFormData.account_type}
              >
                  <option value={null}>Account Type</option>
                  <option value='Turnover'>Turnover</option>
                  <option value='Direct Cost'>Direct Cost</option>
                  <option value='Admin Expenses'>Admin Expenses</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Control
                  name='code'
                  type="number"
                //   min={0}
                //   max={100}
                  placeholder="Code"
                  onChange={handleAddFormDataChange}
                  value = {addCOAFormData.code}
              />
                {addFormCodeAuth.isError && <Form.Text style={{color: 'red'}} >
                    {addFormCodeAuth.error}
                </Form.Text>}
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Control
                  name='name'
                  type="text"
                  placeholder="Name"
                  onChange={handleAddFormDataChange}
                  value = {addCOAFormData.name}
              />
            </Form.Group>
            

           
            


        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowAddCOA(!showAddCOA)}}>Close</Button>
          <Button type='submit' className='btn btn-success' >Save</Button>
        </Modal.Footer>
          </Form>
      </Modal>

        </>
    );
}
}

export default ChartsOfAccounts;

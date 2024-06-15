import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Store } from 'react-notifications-component';
import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { Button, Form, Modal } from 'react-bootstrap';

var companiesGetAllUrl = axiosURL.companiesGetAllUrl;
var companiesAddOneUrl = axiosURL.companiesAddOneUrl;
var companiesEditOneUrl = axiosURL.companiesEditOneUrl;
var companiesDeleteOneUrl = axiosURL.companiesDeleteOneUrl;

export default function Companies() {

  const gridRef = useRef();
  const [gridAPi, setGridApi] = useState();
  const [reRender, setReRender] = useState(true);
  const [loader, setLoader] = useState(false);
  const [mainRowData, setMainRowData] = useState("");
  const [rowData, setRowData] = useState("");
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [modelType, setModelType] = useState({
    type: "",
    id: ''
  });


  const [formData, setFormData] = useState({
    name: "",
    address: ""
  })

  const handleOpenModel = (type, data) => {

    if(type === "new"){
      setFormData({
        name: "",
        address: ""
      })
      setModelType({
        type: "new",
        id: ''
      })
      setShowAddCompanyModal(true)
    }
    else if(type === "edit"){
      console.log("data")
      setFormData({
        name: data.name,
        address: data.address
      })
      setModelType({
        type: "edit",
        id: data._id
      })
      setShowAddCompanyModal(true)
    }
  }

  const handleFormChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));

  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(modelType.type === "new"){
      const response = await axios.post(`${companiesAddOneUrl}`,
        {
          formData
        },
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setFormData({
          name: "",
          address: ""
        })
        setModelType({
          type: "",
          id: ""
        })
        setReRender(prev => !prev)
        setShowAddCompanyModal(false)
      }
    }

    if(modelType.type === "edit"){
      const response = await axios.post(`${companiesEditOneUrl}/${modelType.id}`,
        {
          formData
        },
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setFormData({
          name: "",
          address: ""
        })
        setModelType({
          type: "",
          id: ""
        })
        setReRender(prev => !prev)
        setShowAddCompanyModal(false)
      }
    }

  }

  const handleCompanyDelete = async (id) => {

    const response = await axios.post(`${companiesDeleteOneUrl}/${id}`,
        {
          formData
        },
        {
            headers:{ 'Content-Type': 'application/json' }
        }
      );
      if(response.status === 200){
        setReRender(prev => !prev)
      }

  }

  const filter = () => {
    setRowData(mainRowData)
  }

  useEffect(()=>{
    filter();
  },[mainRowData])

  
  const getData = async ()=>{
    setLoader(true)
    try {
        const response = await axios.get(companiesGetAllUrl,
            {
                headers:{ 
                    'Content-Type': 'application/json'
                }
            }
        );
        if(response.status === 200){

            setMainRowData(response.data.companies)
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
        valueGetter: (params) => params.node.rowIndex + 1,
    },
    { 
        headerName: 'Name',
        field: 'name', 
        flex:1,
    },
    { 
        headerName: 'Address', 
        field: 'address', 
        flex:4,
    },
    { 
    headerName: 'Action', 
    field: 'delete', 
    flex:0.5,
    cellRendererFramework: (params)=>
    <>
    <Link onClick={()=>{handleOpenModel("edit", params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
      <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
        <g id="Edit / Edit_Pencil_01">
        <title>Edit Template</title>
        <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
      </svg>
    </Link>
    <Link onClick={()=>{handleCompanyDelete(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

   
   


   async function onGridReady(params) {
       setGridApi(params);
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
        className="my-3 card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Companies
              </h4>
            </div>


          </div>

            <div>

            <Link onClick={()=>{handleOpenModel("new")}} className='btn btn-primary mx-4'>
              Add Company
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
                pagination = {false}
                suppressDragLeaveHidesColumns={true}
            />
            
          </div>
        </div>

    </div>

    <Modal size="lg" show={showAddCompanyModal} centered onHide={()=>{setShowAddCompanyModal(!showAddCompanyModal)}}>
        <Modal.Header closeButton>
          <Modal.Title> {modelType === "new" ? "Add Comapny" : "Edit Comapny"} </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form 
          // onSubmit={handleAddManualEntry}
          >
            
                    <Form.Group className='mt-2'>
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                        name='name'
                        type="text"
                        placeholder="Enter Name"
                          onChange={handleFormChange}
                          value = {formData.name}
                    />
                    </Form.Group>


                    <Form.Group className='mt-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        name='address'
                        as="textarea"
                        placeholder="Enter Address"
                        rows={4}
                          onChange={handleFormChange}
                          value = {formData.address}
                    />
                    </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowAddCompanyModal(!showAddCompanyModal)}}>Close</Button>
          <Button onClick={handleFormSubmit} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

        </>
    );
}
}








    

    
    
    
      




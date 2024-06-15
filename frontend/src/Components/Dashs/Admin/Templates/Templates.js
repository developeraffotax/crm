import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import secureLocalStorage from 'react-secure-storage';
import Select from 'react-select';

import { useSpring, animated } from 'react-spring';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import HTMLRenderer from '../Tickets/HtmlRenderer';

export default function Templates() {
  

  const [selectedUserListValue, setSelectedUserListValue] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [showSelectUserListModalIsOpen, setShowSelectUserListModalIsOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const handleUserListChange = (e) => {
    setSelectedUserListValue(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  const handleUserPermissionChange = async ()=>{
    try {
      await axios.post(`${axiosURL.usersListAddUrl}/${selectedTemplateId}`,
          {
            usersList: selectedUserListValue 
          },
          {
            headers:{ 'Content-Type': 'application/json' }
          }
      );
      setSelectedUserListValue([]);
      setSelectedTemplateId(null);
      setShowSelectUserListModalIsOpen(false);
      setReRender(prev => !prev)

    } catch (error) {
      
    }
  }

  const token = secureLocalStorage.getItem('token') 
  const [isOpen, setIsOpen] = useState(false);
  
  const [showAddCategoryModal, setshowAddCategoryModal] = useState(false);
  const [showAddTemplateModal, setshowAddTemplateModal] = useState(false);
  const [showEditTemplateModal, setshowEditTemplateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const [categoriesFvalue, setCategoriesFvalue] = useState("");

  const [showTemplateModalData, setShowTemplateModalData] = useState("");

  const [addCategoryFormData, setAddCategoryFormData] = useState('');
  const [addTemplateFormData, setAddTemplateFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    template: '',
  });
  const [editTemplateFormData, setEditTemplateFormData] = useState({
    _id: '',
    name: '',
    description: '',
    category_id: '',
    template: '',
  });

  const [categoriesNames, setCategoriesNames] = useState(null);


  
  const [gridApi, setGridApi] = useState(null);

  const [loader, setLoader] = useState(false)
  const [reRender, setReRender] = useState(true)

  const [mainRowData, setMainRowData] = useState([ ]);
  const [rowData, setRowData] = useState([ ]);
  const gridRef = useRef();

  const openEditTemplateModel =(e, data)=>{
    e.preventDefault();
    setEditTemplateFormData({
      _id: data._id,
      name: data.name,
      description: data.description,
      category_id: data.category_id._id,
      template: data.template,
    });
    setshowEditTemplateModal(true)
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

  
  const handleAddFormDataChange = (e, field)=>{

    var name = "";
    var value = "";

    if (field === "~~~~") {

      name = "template";
      value = e;

    } else {
      e.preventDefault();
      name = e.target.name;
      value = e.target.value;
    }

    setAddTemplateFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  }

  const handleEditFormDataChange = (e, field)=>{
    
    
    var name = "";
    var value = "";

    if (field === "~~~~") {

      name = "template";
      value = e;

    } else {
      e.preventDefault();
      name = e.target.name;
      value = e.target.value;
    }


    setEditTemplateFormData(prevState => ({
      ...prevState,
      [name]: value
  }));
  }

  
  const handleDeleteCategoryName = async (projId)=>{
    // setLoader(true)
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {

      await axios.get(`${axiosURL.TemplatesCategoryDeleteOneUrl}/${projId}`,
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setReRender(!reRender);
    }
  }


  const handleAddCategoryForm = async (e)=>{
      e.preventDefault();
    

       await axios.post(`${axiosURL.TemplatesCategoryAddOneUrl}`,
          {
            name: addCategoryFormData 
          },
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setshowAddCategoryModal(false)
      setAddCategoryFormData("")

      setReRender(!reRender);
    
  }


  const handleAddTaskForm = async (e)=>{
      e.preventDefault();
    

      await axios.post(`${axiosURL.TemplatesAddOneUrl}`,
          {
            formData: addTemplateFormData 
          },
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setshowAddTemplateModal(false)
      setAddTemplateFormData({
        name: '',
        description: '',
        category_id: '',
        template: '',
      });

      setReRender(!reRender);
    
  }

  const handleEditTemplateForm = async (e, _IDD)=>{
      e.preventDefault();
      const resp = await axios.post(`${axiosURL.TemplatesEditOneUrl}/${_IDD}`,
          {
            formData: editTemplateFormData 
          },
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setshowEditTemplateModal(false)
      setEditTemplateFormData({
        _id: '',
        name: '',
        description: '',
        category_id: '',
        template: '',
      });


      setReRender(!reRender);
    
  }

  const handleFilters = async ()=>{
    // const roo = mainrowData; 
    var filteredArray = mainRowData

    // Categories Filter
    if(filteredArray !== undefined && categoriesFvalue !== null && categoriesFvalue !== ""){
      filteredArray = filteredArray.filter(obj => obj.category_id && obj.category_id.name === categoriesFvalue);
    }
    

    setRowData(filteredArray)

  }


  useEffect(()=>{
    setRowData(mainRowData)
    handleFilters()
  },[mainRowData, categoriesFvalue])

  const getData = async ()=>{
      setLoader(true)
      try {
          const response = await axios.get(axiosURL.TemplatesGetAllUrl,
              {
                headers:{ 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                }
              }
          );
          if(response.status === 200){

              setMainRowData(response.data.Templates)
              setUsersList(response.data.users.map(names => {
                return{value: names._id, label: names.name}
              }))
              setCategoriesNames(response.data.TemplateCategories.map(names => {
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




  function convertQuillHtmlToPlainText(html) {
    // Replace <strong> and <b> tags with asterisks for bold.
    html = html.replace(/<strong>|<b>/g, '**');
    html = html.replace(/<\/strong>|<\/b>/g, '**');
  
    // Replace <em> and <i> tags with underscores for italics.
    html = html.replace(/<em>|<i>/g, '_');
    html = html.replace(/<\/em>|<\/i>/g, '_');
  
    // Replace <u> tags with underscores for underlined text.
    html = html.replace(/<u>/g, '__');
    html = html.replace(/<\/u>/g, '__');
  
    // Replace <a> tags with the link text in parentheses.
    html = html.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');
  
    // Replace <br> tags with newlines.
    html = html.replace(/<br\s*\/?>/g, '');

    // Replace <p> tags with newlines.
    html = html.replace(/<\/p>/g, '\n');
  
    // Remove other HTML tags.
    html = html.replace(/<[^>]*>/g, '');
  
    return html;
  }


  const handleCopyClick = (data) => {
    
    const plainText = convertQuillHtmlToPlainText(data);

    // Use the Clipboard API to copy the plainText to the clipboard.
    navigator.clipboard.writeText(plainText).then(function() {
    }).catch(function(err) {
      console.error('Unable to copy text: ', err);
    });
  };
  
  
  
    const columnDefs = [
      
      { 
        headerName: 'Category', 
        field: 'category', 
        flex:0.5,
        valueGetter: p => {
            return(p.data.category_id.name); 
        },
        floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: categoriesNames && categoriesNames.map(option => option.label),
            onValueChange:(value) => setCategoriesFvalue(value),
            value: categoriesFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
      },
      { headerName: 'Template Name', field: 'name', flex:0.5 },
      { 
        headerName: 'Description', 
        field: 'description', 
        flex:2, 
        cellRendererFramework: (params)=>
        <>
        <Link style={{textDecoration: 'none',}} onClick={(e)=>{ e.preventDefault(); setShowTemplateModalData(params.data.template); setShowTemplateModal(true);}}>
          {params.data.description}
        </Link>
        </>,
        
      },


      { headerName: 'Status', 
      field: 'status', 
      flex:0.5,
      floatingFilter: false,
      cellRendererFramework: (params)=>
        <>
          

          <Link onClick={()=>{handleCopyClick(params.data.template);}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
            <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" fill="#000000" width="50px" height="16px" viewBox="0 0 32 32" version="1.1">
              <title>Copy Template</title>
              <path d="M0 30.016h20v-4h-40v4zM0 22.016h28v-4h-48v4zM0 14.016h24v-4h-44v4zM0 6.016h32v-4h-52v4z"/>
            </svg>
          </Link>
        </>
    },
      {
          headerName: 'Action', 
          field: 'price',
          floatingFilter: false,
          flex:4,
          cellRendererFramework: (params)=>
          <>
            <Link onClick={()=>{setSelectedTemplateId(params.data._id); setSelectedUserListValue(params.data.users_list); setShowSelectUserListModalIsOpen(!showSelectUserListModalIsOpen)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
              <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            </Link>

            <Link 
            onClick={(e)=>{openEditTemplateModel(e, params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}
            >
              <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <g id="Edit / Edit_Pencil_01">
                <title>Edit Template</title>
                <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
              </svg>
            </Link>

            <Link onClick={()=>{handleActionButtons("Copy", params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
              <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 256 256">
              <title>Copy Template Row</title>
                <path d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401 4.636 0 8.397 1.719 13.594 5.67 5.196 3.953 13.052 10.56 16.942 14.962 3.89 4.402 5.532 6.972 5.532 10.604 0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881-9.257.124-29.135.124-29.135.124s.466 6.275.466 15.15-8.106 15.811-17.317 16.056c-9.21.245-71.944-.49-80.884-.245-8.94.245-16.975-6.794-16.975-15.422s.274-93.175.274-101.566zm16.734 3.946l-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.988 1.988 0 0 0-2.046-1.953s-21.866.64-31.767.293c-9.902-.348-16.672-6.807-16.675-15.516-.003-8.709.003-69.142.003-69.142a1.989 1.989 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606l-20.825-18.135zm-57.606.847a2.002 2.002 0 0 0-2.02 1.988l-.626 96.291a2.968 2.968 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.951 1.951 0 0 0-1.96-2.004s-26.172.042-30.783.042c-4.611 0-7.535-2.222-7.535-6.482S152.3 63.92 152.3 63.92a2.033 2.033 0 0 0-2.015-2.018l-36.464-.23z" stroke="#979797" fill-rule="evenodd"/>
              </svg>
            </Link>

            <Link onClick={()=>{handleActionButtons("Delete", params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16">
                  <title>Delete Template</title>
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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

     const modules = {

      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean'],
      ],
  
    };
  
    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];

    const editorStyle = {
      backgroundColor: 'white',
      borderRadius: '5px',
    };

     const onPageSizeChanged = useCallback(() => {
      var value = document.getElementById('page-size').value;
      gridRef.current.api.paginationSetPageSize(Number(value));
    }, []);

    const handleActionButtons = async (type, id)=>{
      
      if(type === "Delete"){

        const confirmed = window.confirm('Are you sure you want to delete this item?');

        if (confirmed) {
          await axios.get(`${axiosURL.deleteTemplateUrl}/${id}`,
          {
              headers:{ 'Content-Type': 'application/json' }
          }
        );
        } else {
          // user clicked Cancel, do nothing
        }
      }

      if(type === "Copy"){


        await axios.get(`${axiosURL.copyTemplateUrl}/${id}`,
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
    fileName: `Templates - ${new Date().toISOString().slice(0, 10)}`,
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
    className="mt-3 card" >
    
    <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

      <div style={{alignItems: 'center',}} className='d-flex'>

        <div >
          <h4 style={{padding: '20px 16px',}}>
              Templates
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

      <div className="d-flex">

        <Link onClick={exportToExcel} style={{
        backgroundColor: 'transparent',
        color: 'black',
        borderColor: 'lightgray',
        alignSelf: 'center',
      }} className='btn btn-primary mx-3'>
          Excel
        </Link>

        <div style={{
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
                                Categories
                            </div>
                            <div style={{padding: '0px', textAlign: 'right',}} className='col-2'>
                                <svg style={{width: '20px', stroke: 'rgb(123, 129, 144)'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 10l5 5 5-5" stroke="#7b8190" stroke-width="2" fill="none"></path></svg>
                            </div>
                        </div>
                </div>
                <animated.div style={dropdownAnimation}>
                    {isOpen && (
                    <div >
                        <div style={{margin: 10}}>
                        {categoriesNames && categoriesNames.map((task, ind)=>{
                            return(
                            <div style={{cursor: 'default'}} key={ind} className='row recurringTask_task'>
                                <div className='col-10'>
                                    <p> {task.label} </p>
                                </div>
                                
                                <div className='col-2'>
                                  <div onClick={()=>{handleDeleteCategoryName(task.value)}} style={{cursor: "pointer"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </div>
                                </div>
                            </div>
                            )}
                        )}
                           
                        </div>
                    </div>
                    )}
                </animated.div>
            </div>
          <div className=''>
            <Link onClick={()=>{setshowAddCategoryModal(true);}} className='btn btn-primary'>
              Add Category
            </Link>
          </div>
          <div className='mx-4'>
            <Link onClick={()=>{setshowAddTemplateModal(true);}} className='btn btn-primary'>
              Add Template
            </Link>
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
        
      </div>
    </div>
</div>


      <Modal show={showSelectUserListModalIsOpen} centered onHide={()=>{setShowSelectUserListModalIsOpen(!showSelectUserListModalIsOpen)}}>
        <Modal.Header closeButton>
          <Modal.Title>Allowed Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleUserPermissionChange}
          >
            
            <Select
              className="dropdown"
              placeholder="Select Option"
              value={usersList.filter(obj => selectedUserListValue.includes(obj.value))} // set selected values
              options={usersList} // set list of the data
              onChange={handleUserListChange} // assign onChange function
              isMulti
              isClearable
            />        


          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowSelectUserListModalIsOpen(!showSelectUserListModalIsOpen)}}>Close</Button>
          <Button onClick={handleUserPermissionChange} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showAddCategoryModal} centered onHide={()=>{setshowAddCategoryModal(!showAddCategoryModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleAddCategoryForm}
          >
            
            <Form.Group className='mt-2'>
              <Form.Control
                  name='CategoryName'
                  type="text"
                  placeholder="Category Name"
                  onChange={(e)=>{setAddCategoryFormData(e.target.value)}}
                  value = {addCategoryFormData}
              />
            </Form.Group>              

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setshowAddCategoryModal(!showAddCategoryModal)}}>Close</Button>
          <Button onClick={handleAddCategoryForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>





    <Modal show={showAddTemplateModal} centered onHide={()=>{setshowAddTemplateModal(!showAddTemplateModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Add Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleAddTaskForm}
          >

            <Form.Group className='mt-2'>
            <Form.Select 
              name='category_id'
              onChange={handleAddFormDataChange}
              value = {addTemplateFormData.category_id}
              >
                  <option>Category</option>
                  {categoriesNames && categoriesNames.map((proj, ind)=>{
                    return(
                      <option key={ind} value={proj.value}>{proj.label}</option>
                    )
                  })}
                 
              </Form.Select>
              
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Control
                  name='name'
                  type="text"
                  placeholder="Name"
                  onChange={handleAddFormDataChange}
                  value = {addTemplateFormData.name}
              />
            </Form.Group>
            
            <Form.Group className='mt-2'>
              <Form.Control
                  name='description'
                  type="text"
                  placeholder="Description"
                  onChange={handleAddFormDataChange}
                  value = {addTemplateFormData.description}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
            {/* <Form.Control
              as="textarea"
              name='template'
              placeholder="Template"
              onChange={handleAddFormDataChange}
              value={addTemplateFormData.template}
              rows= {8}
            /> */}

              <ReactQuill
                name="template"
                theme="snow"
                modules={modules}
                formats={formats}
                style={editorStyle}
                onChange={(e) => { handleAddFormDataChange(e, "~~~~") }}
                value={addTemplateFormData.template}
              />

          </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setshowAddTemplateModal(!showAddTemplateModal)}}>Close</Button>
          <Button onClick={handleAddTaskForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>
    
    
    <Modal show={showEditTemplateModal} centered onHide={()=>{setshowEditTemplateModal(!showEditTemplateModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form
          onSubmit={(e)=>{handleEditTemplateForm(e, editTemplateFormData._id)}}
          >

            <Form.Group className='mt-2'>
            <Form.Select 
              name='category_id'
              onChange={handleEditFormDataChange}
              value = {editTemplateFormData.category_id}
              >
                  <option>Category</option>
                  {categoriesNames && categoriesNames.map((proj, ind)=>{
                    return(
                      <option key={ind} value={proj.value}>{proj.label}</option>
                    )
                  })}
                 
              </Form.Select>
              
            </Form.Group>

            <Form.Group className='mt-2'>
              <Form.Control
                  name='name'
                  type="text"
                  placeholder="Name"
                  onChange={handleEditFormDataChange}
                  value = {editTemplateFormData.name}
              />
            </Form.Group>
            
            <Form.Group className='mt-2'>
              <Form.Control
                  name='description'
                  type="text"
                  placeholder="Description"
                  onChange={handleEditFormDataChange}
                  value = {editTemplateFormData.description}
              />
            </Form.Group>

            <Form.Group className='mt-2'>

              <ReactQuill
                name="template"
                theme="snow"
                modules={modules}
                formats={formats}
                style={editorStyle}
                onChange={(e) => { handleEditFormDataChange(e, "~~~~") }}
                value={editTemplateFormData.template}
              />


          </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setshowEditTemplateModal(!showEditTemplateModal)}}>Close</Button>
          <Button onClick={(e)=>{handleEditTemplateForm(e, editTemplateFormData._id)}} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showTemplateModal} centered onHide={()=>{setShowTemplateModal(!showTemplateModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Template View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div style={{ whiteSpace: 'pre-line' }}>
            {showTemplateModalData}
          </div> */}

          <HTMLRenderer htmlContent={showTemplateModalData} />

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowTemplateModal(!showTemplateModal)}}>Close</Button>
          <Button onClick={()=>{handleCopyClick(showTemplateModalData);}} className='btn btn-success' >Copy</Button>
        </Modal.Footer>
      </Modal>

    </>
);
}
}

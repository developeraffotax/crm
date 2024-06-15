import React, { useState, useEffect } from "react";
import { Accordion, Button, Form, Modal } from "react-bootstrap";
import { Store } from "react-notifications-component";
import { Link } from "react-router-dom";

import axios from "../../../../../Api/Axios";
import * as axiosURL from "../../../../../Api/AxiosUrls";
import Loader from "../../../../Common/Loader/Loader";

var rolesPredataUrl = axiosURL.rolesPredataUrl;
var AddRoleUrl = axiosURL.AddRoleUrl;
var savePermissionsUrl = axiosURL.savePermissionsUrl;

export default function Roles() {
  const [loader, setLoader] = useState(false);
  const [predata, setPredata] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRolePages, setSelectedRolePages] = useState(null);
//   const [selectedRolePermissions, setSelectedRolePermissions] = useState(null);

  const [permissionsFormData, setPermissionsFormData] = useState([])

  const [newRoleIsOpen, setNewRoleIsOpen] = useState(false)
  const [newRoleFormData, setNewRoleFromData] = useState(null)
  
  const [editRoleIsOpen, setEditRoleIsOpen] = useState(false)
  const [editRoleFormData, setEditRoleFormData] = useState(null)

  const [reRender, setReRender] = useState(false)


  const handleAddSubmitButton = async ()=>{
    
    const response = await axios.post(AddRoleUrl,
    {
    name: newRoleFormData
    },
    {
    headers:{ 'Content-Type': 'application/json' }
    }
    );
    
    setNewRoleIsOpen(false);
    setReRender(!reRender)

   }

   //

  const handleNewRoleForm = (e)=>{
    setNewRoleFromData(e.target.value)
  }

  //

  const hendleSelectedRolePermissions = async (roleId)=>{
    setSelectedRole(roleId);

    var filteredArray = predata.roles;

    // Selected Role
    if(filteredArray != undefined && roleId != null && roleId !== ""){
        filteredArray = await filteredArray.filter(obj => obj._id && obj._id === roleId);
    }

    setSelectedRolePages(filteredArray[0].pages)

    const Pages = filteredArray[0].pages;
    // const RolesPermissions = Pages.permissions ? Pages.permissions : [] ;
    const Data = predata.pages;
    const PagesPermissions = predata.permissions.length > 0 ? predata.permissions : [];

    
    var tempArr = []
    var tempPagesPermissions = [];
    
    
    if(Pages.length != 0){
      
      for(var i = 0 ; i < Data.length ; i++){
        
        const RolesP = Pages.find(page => page.name === Data[i].name)
        const RolesPermissions = RolesP?.permissions;

        if(RolesP){
          if(RolesPermissions?.length != 0){
            for(var x = 0 ; x < PagesPermissions.length ; x++){
              const PageNameToCheckPermission = Data[i].name.split(" ")[0];
              const PageNameToCheckIfPermissionIsOfPage = PagesPermissions.length > 0 && PagesPermissions[x].name.split(" ")[0];
              if(PageNameToCheckPermission === PageNameToCheckIfPermissionIsOfPage){
                const checkIfPermissionOrNot = RolesPermissions.some(item => item.name === PagesPermissions[x].name && item.isChecked === true)
                if(checkIfPermissionOrNot){
                  var ArrPagesPermissionsObj = {
                    name: PagesPermissions[x].name,
                    isChecked: true
                  }
                }else{
                  var ArrPagesPermissionsObj = {
                    name: PagesPermissions[x].name,
                    isChecked: false
                  }
                }
  
                tempPagesPermissions.push(ArrPagesPermissionsObj)
  
                // PagesPermissions[x].name
  
              }
            }
          }
          else if( !RolesPermissions || RolesPermissions.length === 0){
  
            if(PagesPermissions.length !== 0){
              for(var x = 0 ; x < PagesPermissions.length ; x++){
                const PageNameToCheckPermission = Data[i].name.split(" ")[0];
                const PageNameToCheckIfPermissionIsOfPage = PagesPermissions[x].name.split(" ")[0];
                if(PageNameToCheckPermission === PageNameToCheckIfPermissionIsOfPage){
                  var ArrPagesPermissionsObj = {
                    name: PagesPermissions[x].name,
                    isChecked: false
                  }
                  tempPagesPermissions.push(ArrPagesPermissionsObj)
                }
              }
            }
  
          }

        } else {
          if(PagesPermissions.length !== 0){
            for(var x = 0 ; x < PagesPermissions.length ; x++){
              const PageNameToCheckPermission = Data[i].name.split(" ")[0];
              const PageNameToCheckIfPermissionIsOfPage = PagesPermissions[x].name.split(" ")[0];
              if(PageNameToCheckPermission === PageNameToCheckIfPermissionIsOfPage){
                var ArrPagesPermissionsObj = {
                  name: PagesPermissions[x].name,
                  isChecked: false
                }
                tempPagesPermissions.push(ArrPagesPermissionsObj)
              }
            }
          }
        }


              const includesCheck = Pages.some(item => item.name === Data[i].name && item.isChecked === true);
              if(includesCheck){
                  var ArrObj = {
                      name: Data[i].name,
                      isChecked: true,
                      permissions: tempPagesPermissions
                  }
              }else if(!includesCheck){
                  var ArrObj = {
                      name: Data[i].name,
                      isChecked: false,
                      permissions: tempPagesPermissions
                  }
              }
              tempPagesPermissions = []
              tempArr.push(ArrObj)
            }


        }else if(Pages.length === 0){
            for(var i = 0 ; i < Data.length ; i++){

              for(var x = 0 ; x < PagesPermissions.length ; x++){
                const PageNameToCheckPermission = Data[i].name.split(" ")[0];
                const PageNameToCheckIfPermissionIsOfPage = PagesPermissions[x].name.split(" ")[0];
                if(PageNameToCheckPermission === PageNameToCheckIfPermissionIsOfPage){

                  var ArrPagesPermissionsObj = {
                    name: PagesPermissions[x].name,
                    isChecked: false
                  }
                  tempPagesPermissions.push(ArrPagesPermissionsObj)
                }
              }

                var ArrObj = {
                    name: Data[i].name,
                    isChecked: false,
                    permissions: tempPagesPermissions
                }
                tempPagesPermissions = []
                tempArr.push(ArrObj)
            }
        }


        setPermissionsFormData(tempArr)
  }

  //

  const handleFormPageChange = (event) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;
    const updatedCheckboxes = permissionsFormData.map((checkbox) =>
      checkbox.name === checkboxName ? { ...checkbox, isChecked: isChecked } : checkbox
    );
    setPermissionsFormData(updatedCheckboxes);
  };

  const handleFormPagePermChanges = (event, pageIndex, permComingIndex) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;
  
    setPermissionsFormData(prevState => {
      const updatedCheckboxes = prevState.map((page, index) => {
        if (index === pageIndex) {
          const updatedPermissions = page.permissions.map((perm, permIndex) =>
            permIndex === permComingIndex ? { ...perm, isChecked: isChecked } : perm
          );
  
          return { ...page, permissions: updatedPermissions };
        }
  
        return page;
      });
  
      return updatedCheckboxes;
    });
  };

  //

  const handlePermissionSave = async ()=>{
    await axios.post(savePermissionsUrl,
      {
        id: selectedRole,
        pages: permissionsFormData
      },
      {
      headers:{ 'Content-Type': 'application/json' }
      }
      );
   

      setNewRoleIsOpen(false);
      setReRender(!reRender)
  }

  //

  const getPreData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(rolesPredataUrl, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setPredata(response.data);

        setLoader(false);
      }
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: "Please Try Again",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  };

  const handleDeleteRole = async (e, id)=>{
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try{
        await axios.get(`${axiosURL.deleteOneRoleUrl}/${id}`,
          {
          headers:{ 'Content-Type': 'application/json' }
          }
          );
          
          setReRender(!reRender)
        } catch (err) {
          Store.addNotification({
            title: "Error",
            message: "Please Try Again",
            type: "danger",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
      }
    }
  }

  //

  useEffect(() => {
    getPreData();
  }, [reRender]);

  if (loader) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="row">
          <div className="col-4">
            <div style={{ border: "none" }} className="card">
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
                className="d-flex"
              >
                <p style={{ fontSize: "19px", fontWeight: "600" }}>Roles</p>
                <button onClick={()=>{setNewRoleIsOpen(true)}} className="btn btn-default">Add Roles</button>
              </div>
              <hr style={{ margin: "0px", color: "rgb(181 181 181)" }} />

              {predata &&
                predata.roles.map((roles, ind) => {
                  return (
                    <>
                      <Link onClick={()=>{hendleSelectedRolePermissions(roles._id)}} key={ind}>
                          <div
                              style={{
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px",
                              }}
                              className="d-flex"
                              >
                              <p>{roles.name}</p>
                              <div>
                                  {/* <a className="btn btn-default2">
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-edit icon-16"
                                  >
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                  </a> */}
                                  <a onClick={(e)=>{handleDeleteRole(e, roles._id)}} style={{border: 'none',}} className="btn btn-default2">
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-x icon-16"
                                  >
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                  </a>
                              </div>
                          </div>
                      </Link>
                    </>
                  );
                })}
            </div>
          </div>

          <div className="col-8">
            <div style={{ border: "none" }} className="card">
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
                className="d-flex"
              >
                <p style={{ fontSize: "19px", fontWeight: "600" }}>
                  Permissions
                </p>
                <button onClick={handlePermissionSave} className="btn btn-default">Save</button>
              </div>
              <hr style={{ margin: "0px", color: "rgb(181 181 181)" }} />

              {selectedRole ? 
                <Form>
                    <Accordion defaultActiveKey="0">
                    {permissionsFormData &&
        permissionsFormData.map((page, pageIndex) => {
          return (
            <Accordion.Item eventKey={pageIndex} key={pageIndex}>
              <Accordion.Header>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    name={page.name}
                    onChange={handleFormPageChange}
                    checked={page.isChecked}
                    label={page.name}
                  />
                </Form.Group>
              </Accordion.Header>
              <Accordion.Body>
                {page.permissions.map((perm, permIndex) => {
                  return (
                    <Form.Group controlId="formBasicCheckbox" key={permIndex}>
                      <Form.Check
                        type="checkbox"
                        name={perm.name}
                        onChange={event => handleFormPagePermChanges(event, pageIndex, permIndex)}
                        checked={perm.isChecked}
                        label={perm.name}
                      />
                    </Form.Group>
                  );
                })}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
                    </Accordion>
                </Form>
               :
               <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
               }}>
                    <p>Select Role</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6rem" height="6rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders" style={{color:'rgba(128, 128, 128, 0.1)'}}><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
               </div>
               }

              
            </div>
          </div>
        </div>

        <Modal show={newRoleIsOpen} centered onHide={setNewRoleIsOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          // onSubmit={handleSubmit}
          >
            <Form.Group style={{marginTop: "10px"}} controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control 
              value={newRoleFormData} onChange={handleNewRoleForm}
              >
              </Form.Control>
            </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setNewRoleIsOpen}>Close</Button>
          <Button onClick={handleAddSubmitButton} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

      </>
    );
  }
}

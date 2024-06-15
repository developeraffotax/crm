import React, { useState, useEffect } from 'react';
import { Accordion, Button, Form, Modal } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import loaderr from "../../../../Assets/svgs/loader.svg"

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';

var addMainTaskUrl = axiosURL.addMainTaskUrl;
var addSubTaskUrl = axiosURL.addSubTaskUrl;
var subTaskCheckChangeUrl = axiosURL.subTaskCheckChangeUrl;
var subTaskDeleteUrl = axiosURL.subTaskDeleteUrl;
var mainTaskDeleteUrl = axiosURL.mainTaskDeleteUrl;

const ViewTask = (props) => {

    const openProjectId = props.openProjectId;
    const [pageData, setPageData] = useState(props.data);

    const [viewAddMainTask, setViewAddMainTask] = useState(false);

    const [mainTaskFormData, setMainTaskFormData] = useState();
    const [subTaskFormData, setSubTaskFormData] = useState();

    const [loaderMini, setLoaderMini] = useState(false);

    useEffect(() => {
        setPageData(props.data)
    }, [props.data]);


    const handleMainTaskAdd = async (e)=>{
        e.preventDefault()
        setLoaderMini(true)
        await axios.post(`${addMainTaskUrl}/${openProjectId}`,
            {
            name: mainTaskFormData
            },
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );
        setViewAddMainTask(false)
        props.setReRender(!props.reRender)
        setLoaderMini(false)
    }

    useEffect(()=>{
        //
    },[])

    const handleSubTaskAdd = async (mainTaskId)=>{

        setLoaderMini(true)

        try {
            // const newSubTask = { name: subTaskFormData, isCompleted: false };
            // const updatedPageData = [...pageData];
            // const pageToUpdate = updatedPageData.find((page) => page._id === mainTaskId);
            // pageToUpdate.subtasks_id.push(newSubTask); // add new subtask to page.subtasks_id array
            // setPageData(updatedPageData); // update state with new page data
    
            const response = await axios.post(`${addSubTaskUrl}/${mainTaskId}`,
                {
                name: subTaskFormData
                },
                {
                headers:{ 'Content-Type': 'application/json' }
                }
            );
            
            setSubTaskFormData(null);
            props.setReRender(!props.reRender)
            setLoaderMini(false)
            
            if (!response.ok) {
                throw new Error(`Failed to add new subtask to page with _id ${mainTaskId}`);
            }
            
        } catch (error) {
        }

        
    }

    const handleSubPageCheckBoxChange = async (subPageId, updateData)=>{
        if(subPageId){
            setLoaderMini(true)
            await axios.post(`${subTaskCheckChangeUrl}/${subPageId}`,
                {
                isChecked: updateData
                },
                {
                headers:{ 'Content-Type': 'application/json' }
                }
            );
            props.setReRender(!props.reRender)
            setLoaderMini(false)
        }
    }

    const handleDeleteSubTask = async (subId, mainId)=>{
        setLoaderMini(true)
        await axios.post(`${subTaskDeleteUrl}/${subId}`,
            {
                mtId: mainId
            },
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );
        props.setReRender(!props.reRender)
        setLoaderMini(false)
    }

    const handleDeleteMainTask = async (mainId, projId)=>{

        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            setLoaderMini(true)
            await axios.post(`${mainTaskDeleteUrl}/${mainId}`,
                {
                    projId: projId
                },
                {
                headers:{ 'Content-Type': 'application/json' }
                }
            );
            props.setReRender(!props.reRender)
            setLoaderMini(false)
        }
    }

    return (
        <>
            <div>
                <div style={{
                        textAlign: 'right',
                        marginBottom: '15px',
                    }} >
                    <>
                        <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                        }} >
                            {loaderMini && <img style={{height: '40px', paddingLeft: '15px'}} src={loaderr} alt="" /> }
                            <Button style={{marginLeft: 'auto',}} onClick={()=>setViewAddMainTask(true)}> Add Main Task </Button>
                        </div>
                    </>
                </div>
                <hr className='my-2' style={{margin: 0,}}/>
                <Form>
                    <Accordion defaultActiveKey={0}>
                    {pageData &&
                        pageData.map((page, ind) => {
                            const updatedSubTasks = [...page.subtasks_id];
                            return (
                                <Accordion.Item eventKey={ind} key={ind}>
                                    <Accordion.Header className='task_accordin_bg_color'>
                                        <div style={{
                                                width: "100%",
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: "space-between",                                                        
                                            }}>
                                                <p style={{fontSize: '17px', fontWeight: '500'}}>
                                                    {page.name}
                                                </p>
                                            <Link onClick={()=>{handleDeleteMainTask(page._id, openProjectId)}} style={{all: 'unset', cursor: 'pointer'}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </Link>
                                        </div>
                                        </Accordion.Header>
                                    <Accordion.Body>
                                        <>
                                            {page.subtasks_id &&
                                                page.subtasks_id.map((subPage, subInd) => {
                                                    const subTaskIndex = updatedSubTasks.findIndex((task) => task._id === subPage._id);
                                                    return (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: "space-between",                                                        
                                                        }}>
                                                            <Form.Group key={subInd} controlId="formBasicCheckbox">
                                                                <Form.Check
                                                                    
                                                                    type="checkbox"
                                                                    className={updatedSubTasks[subTaskIndex].isCompleted === true ? 'task_completed_text': '' }
                                                                    label={subPage.name}
                                                                    name={subPage.name}
                                                                    checked={updatedSubTasks[subTaskIndex].isCompleted}
                                                                    onChange={(e) => {
                                                                        updatedSubTasks[subTaskIndex].isCompleted = e.target.checked;
                                                                        const updatedPageData = [...pageData];
                                                                        updatedPageData[ind] = { ...page, subtasks_id: updatedSubTasks };
                                                                        setPageData(updatedPageData);
                                                                        handleSubPageCheckBoxChange(subPage._id, e.target.checked);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                            <Link onClick={ ()=>{handleDeleteSubTask(subPage._id, page._id)}} style={{all: 'unset', cursor: 'pointer'}}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
                                            <hr className="mt-2" style={{ margin: 0 }} />
                                            <input
                                                className="mt-2 form-control"
                                                onChange={(e) => setSubTaskFormData(e.target.value)}
                                                // value={subTaskFormData}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSubTaskAdd(page._id);
                                                        e.target.value = null
                                                        setSubTaskFormData(null);
                                                    }
                                                }}
                                            />
                                        </>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                </Form>
            </div>

            <Modal show={viewAddMainTask} centered onHide={()=>setViewAddMainTask(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Add Main Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <Form 
                onSubmit={handleMainTaskAdd}
                >
                    <Form.Group className='mt-2'>
                        <Form.Control
                            name='name'
                            type="text"
                            placeholder="Main Task Name"
                            onChange={(e)=>setMainTaskFormData(e.target.value)}
                            value = {mainTaskFormData}
                        />
                    </Form.Group>
                    

                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button onClick={()=>setViewAddMainTask(false)}>Close</Button>
                <Button type="button" onClick={ handleMainTaskAdd } className='btn btn-success' >Save</Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
}

export default ViewTask;

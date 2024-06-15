import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage';
import { v4 as uuidv4 } from 'uuid';

import axios from '../../Api/Axios';
import * as axiosURL from '../../Api/AxiosUrls';

var QuickNotesgetAllUrl = axiosURL.QuickNotesgetAllUrl;
var QuickNotesAddOneUrl = axiosURL.QuickNotesAddOneUrl;
var QuickNotesCompleteOneUrl = axiosURL.QuickNotesCompleteOneUrl;


const MiniNotes = (props) => {
    const token = secureLocalStorage.getItem('token')
    const miniNoteIsOpen = props.miniNoteIsOpen
    const setMiniNoteIsOpen = props.setMiniNoteIsOpen

    const [tasks, setTasks] = useState([
        // {taskName: "Test Task 1",
        // isCompleted: false}
    ])

    const [subTaskFormData, setSubTaskFormData] = useState()

    useEffect(()=>{
        getData()
    }, [])

    const getData = async ()=>{
        try {
            const response = await axios.get(`${QuickNotesgetAllUrl}`,
                {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
                }
            );
            setTasks(response.data.quickTasks)
        } catch (error) {
        }
    }

    const HandleAddFormFunction = async (iidd, subTaskForm)=>{
        try {
            await axios.post(`${QuickNotesAddOneUrl}`,
                {
                id: iidd,
                taskName: subTaskForm
                },
                {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
                }
            );
        } catch (error) {
            const remainingTasks = tasks.filter((task) => task.id !== iidd); // Filter out the completed task
            setTasks(remainingTasks); // Update the state with the remaining tasks array
        }
    }


    const HandleDeleteFormFunction = async (iidd, subTaskForm)=>{
        try {
            await axios.get(`${QuickNotesCompleteOneUrl}/${iidd}`,
                {
                    headers:{ 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
        } catch (error) {
            const newTask = {
                id: iidd,
                taskName: subTaskForm,
                isCompleted: false
            };
            setTasks([...tasks, newTask]);
        }
    }

    return (
        <>
            {/* TopBar */}
            <div style={{alignItems: 'center', borderBottom: '1px solid #eef1f9', }} className="layout_topbar">
                <div style={{width: '100%',}} className='row'>
                    <div className='col-9'>
                        <p style={{
                            fontSize: '17px',
                            fontWeight: '600',
                            width: '105px',
                            marginLeft: '10px',
                        }}>
                            Quick Notes
                        </p>
                    </div>
                    <div style={{textAlign: 'right',}} className='col-3'>
                        <button onClick={()=>{setMiniNoteIsOpen(!miniNoteIsOpen)}} style={{all: 'unset', cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div style={{height: '100%', padding: '10px'}}>

                {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                <label style={{paddingLeft: '5px'}} for="vehicle1"> I have a bike</label><br/> */}

                {tasks && tasks.map((task, ind)=>{
                    return(
                        <div key={ind}>
                            <Form.Group  controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    label= {task.taskName}
                                    checked={task.isCompleted}
                                    onChange={()=>{
                                        const updatedTasks = [...tasks]; // Create a copy of the tasks array
                                        updatedTasks[ind].isCompleted = true; // Set the isCompleted value of the current task to true
                                        setTasks(updatedTasks); // Update the state with the updated tasks array
                                        setTimeout(() => {
                                            const remainingTasks = updatedTasks.filter((task, index) => index !== ind); // Filter out the completed task
                                            setTasks(remainingTasks); // Update the state with the remaining tasks array
                                        }, 500); 
                                        HandleDeleteFormFunction(updatedTasks[ind].id, updatedTasks[ind].taskName)
                                    }}
                                />
                            </Form.Group>
                        </div>
                    )
                })}

                

                <input
                    className="mt-2 form-control"
                    onChange={(e) => setSubTaskFormData(e.target.value)}
                    value={subTaskFormData}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();

                            const iid = uuidv4()

                            const newTask = {
                                id: iid,
                                taskName: subTaskFormData,
                                isCompleted: false
                            };
                            setTasks([...tasks, newTask]);
                            setSubTaskFormData("");
                            HandleAddFormFunction(iid, subTaskFormData)
                        }
                    }}
                />

            </div>
        </>
    );
}

export default MiniNotes;

import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage';
import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring';

import axios from '../../Api/Axios';
import * as axiosURL from '../../Api/AxiosUrls';

var RecurringNotesgetAllUrl = axiosURL.RecurringNotesgetAllUrl;
var RecurringNotesAddOneCategoryUrl = axiosURL.RecurringNotesAddOneCategoryUrl;
var RecurringNotesAddOneTaskUrl = axiosURL.RecurringNotesAddOneTaskUrl;
var RecurringNotesCompleteOneUrl = axiosURL.RecurringNotesCompleteOneUrl;
var RecurringNotesDeleteOneUrl = axiosURL.RecurringNotesDeleteOneUrl;
var RecurringNotesDeleteOneCategoryUrl = axiosURL.RecurringNotesDeleteOneCategoryUrl;


const RecurringNotes = (props) => {
    const token = secureLocalStorage.getItem('token')
    const recurringNoteIsOpen = props.recurringNoteIsOpen
    const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen

    const [tasks, setTasks] = useState([])
    const [tasksCategory, setTasksCategory] = useState([])
    const [isOpen, setIsOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [filteredTasks, setFilteredTasks] = useState(null)

    const [categoryFormData, setCategoryFormData] = useState()
    const [subTaskFormData, setSubTaskFormData] = useState()

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

    useEffect(()=>{
        getData();
    }, [])

    useEffect(()=>{
        if(tasks && selectedCategory){
            setFilteredTasks(tasks.filter(task => task.category_id === selectedCategory.id))
        }
    },[selectedCategory])

    const getData = async ()=>{
        try {
            const response = await axios.get(`${RecurringNotesgetAllUrl}`,
                {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
                }
            );
            setTasksCategory(response.data.recurringTasksCategory)
            setTasks(response.data.recurringTasks)
            setSelectedCategory({
                name: response.data.recurringTasksCategory.length > 0 ? response.data.recurringTasksCategory[0].name : "Please Create Category",
                id: response.data.recurringTasksCategory.length > 0 ? response.data.recurringTasksCategory[0].id : null,
            })
        } catch (error) {
        }
    }

    const HandleAddCategoryFunction = async (iidd, subTaskForm)=>{
        try {
            await axios.post(`${RecurringNotesAddOneCategoryUrl}`,
                {
                id: iidd,
                name: subTaskForm,
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

    const HandleAddFormFunction = async (iidd, subTaskForm)=>{
        try {
            await axios.post(`${RecurringNotesAddOneTaskUrl}`,
                {
                id: iidd,
                task: subTaskForm,
                category_id: selectedCategory.id
                },
                {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
                }
            );
        } catch (error) {
            const remainingfilteredTasks = filteredTasks.filter((task) => task.id !== iidd); // Filter out the completed task
            const remainingTasks = tasks.filter((task) => task.id !== iidd); // Filter out the completed task
            setTasks(remainingTasks); // Update the state with the remaining tasks array
            setFilteredTasks(remainingfilteredTasks); // Update the state with the remaining tasks array
        }
    }


    const HandleDeleteFormFunction = async (iidd, subTaskForm, checkState)=>{
        try {
            await axios.get(`${RecurringNotesCompleteOneUrl}/${iidd}`,
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
                isCompleted: !checkState,
                category_id: selectedCategory.id
            };
            setFilteredTasks([...filteredTasks, newTask]);
            setTasks([...tasks, newTask]);
        }
    }
    
    const HandleDeleteTaskFunction = async (iidd, subTaskForm, checkState)=>{
        try {
            await axios.get(`${RecurringNotesDeleteOneUrl}/${iidd}`,
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
                isCompleted: !checkState,
                category_id: selectedCategory.id
            };
            setFilteredTasks([...filteredTasks, newTask]);
            setTasks([...tasks, newTask]);
        }
    }

    const handleDeleteMainCategory = async (projId, OldTasksCategories)=>{
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
          const response = await axios.get(`${RecurringNotesDeleteOneCategoryUrl}/${projId}`,
              {
              headers:{ 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                }
              }
          );

          if(response.status !== 200){
            setTasksCategory(OldTasksCategories)
            } 
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
                            Recurring Notes
                        </p>
                    </div>
                    <div style={{textAlign: 'right', alignSelf: 'center',}} className='col-3'>
                        <button onClick={()=>{setRecurringNoteIsOpen(!recurringNoteIsOpen)}} style={{all: 'unset', cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                    </div>
                </div>
            </div>

            {/* Bottom */}

            <div>
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
                                {selectedCategory && selectedCategory.name}
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
                        {tasksCategory && tasksCategory.map((task, ind)=>{
                            return(
                            <div key={ind} className='row recurringTask_task'>
                                <div className='col-2'>
                                    {selectedCategory && selectedCategory.name === task.name ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
                                        <title/>
                                        <g id="Complete">
                                        <g id="tick">
                                        <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                        </g>
                                        </g>
                                    </svg> :
                                    <div className='deleteSvg' onClick={()=>{

                                        const OldTasksCategories = tasksCategory;

                                        const tasksCategories = tasksCategory.filter(tassk => tassk.id !== task.id);
                                    
                                        setTasksCategory(tasksCategories);

                                        handleDeleteMainCategory(task.id, OldTasksCategories)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </div>
                                    }
                                </div>
                                <div onClick={()=>{setSelectedCategory({
                                name: task.name,
                                id: task.id
                            }); handleToggle()
                            }} className='col-10'>
                                    <p> {task.name} </p>
                                </div>
                            </div>
                            )}
                        )}
                           
                        </div>
                        <hr />
                        <input
                            style={{margin: 10, width: '90%'}}
                            className="mt-2 form-control"
                            onChange={(e) => setCategoryFormData(e.target.value)}
                            value={categoryFormData}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    const iid = uuidv4()

                                    const newTask = {
                                        id: iid,
                                        name: categoryFormData,
                                        isCompleted: false
                                    };
                                    setTasksCategory([...tasksCategory, newTask]);
                                    setCategoryFormData("");
                                    HandleAddCategoryFunction(iid, categoryFormData)
                                }
                            }}
                        />
                    </div>
                    )}
                </animated.div>
            </div>

            <div style={{height: '100%', padding: '10px'}}>

                {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                <label style={{paddingLeft: '5px'}} for="vehicle1"> I have a bike</label><br/> */}

                {filteredTasks && filteredTasks.map((task, ind)=>{
                    return(
                        <div className='row' key={ind}>
                            <div className='col-10'>
                                <Form.Group  controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label= {task.task}
                                        checked={task.isChecked}
                                        onChange={()=>{
                                            const updatedTasks = [...filteredTasks]; // Create a copy of the tasks array
                                            updatedTasks[ind].isChecked = !updatedTasks[ind].isChecked; // Set the isCompleted value of the current task to true
                                            setFilteredTasks(updatedTasks); // Update the state with the updated tasks array

                                            const idToUpdate = updatedTasks[ind].id;
                                            var checkState = updatedTasks[ind].isChecked
                                            const updatedTasks2 = tasks.map(task => {
                                                if (task.id === idToUpdate) {
                                                    checkState = task.isChecked
                                                return { ...task, isChecked: checkState };
                                                } else {
                                                return task;
                                                }
                                            });
                                        
                                            setTasks(updatedTasks2);
                                            
                                            HandleDeleteFormFunction(updatedTasks[ind].id, updatedTasks[ind].taskName, checkState)
                                        }}
                                    />
                                </Form.Group>
                            </div>

                            <div style={{cursor: "pointer"}} onClick={()=>{
                                setFilteredTasks(filteredTasks.filter(taskk => taskk.id !== task.id))
                                setTasks(tasks.filter(taskk => taskk.id !== task.id))
                                HandleDeleteTaskFunction(task.id, task.taskName, task.isChecked);
                                }} className='col-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>


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
                                task: subTaskFormData,
                                isCompleted: false,
                                category_id: selectedCategory.id
                            };
                            setTasks([...tasks, newTask]);
                            setFilteredTasks([...filteredTasks, newTask]);
                            setSubTaskFormData("");
                            HandleAddFormFunction(iid, subTaskFormData)
                        }
                    }}
                />

            </div>
        </>
    );
}

export default RecurringNotes;

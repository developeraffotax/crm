/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import JobPlanning from '../../../Jobs/JobPlaning/JobPlanning';
import Tasks from '../Tasks/Tasks';
import Construction from '../Construction/Construction';
import Leads from "../Leads/Leads";
import Accordion from 'react-bootstrap/Accordion';
import Proposals from '../Proposals/Proposals';
import UserRecurringTasks from '../UserRecurringTasks/UserRecurringTasks';
import Templates from '../Templates/Templates';
import Goals from '../Goals/Goals';
import secureLocalStorage from 'react-secure-storage';

const MyTable = (props) => {

  const myListUsers = props.myListUsers

  const [data, setData] = useState({
    jobHolder: null,
    deadline: null
  });

  const items = secureLocalStorage.getItem("MyList");
  var showItems = false;

  if(items && items.length > 0){
    showItems = items.find(item => item.visible)
  }

  const handleFilterChange = (e)=>{
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  useEffect(()=>{
    console.log('rend')
  }, [data])
  


  if(!showItems){
    return(
      <>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2>
            No page selected, Please go to settings and choose page you want to see here.
          </h2>
        </div>
      </>
    )
  }
  else{
    return (
      <>
        <div className='myListDiv'>


        <div style={{border: 'none',}} className='card my-3'>
          <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

            <div style={{alignItems: 'center',}} className='d-flex'>

              <div style={{alignItems: 'center',}} className='d-flex' >
                <h4 style={{padding: '20px 16px',}}>
                    My List
                </h4>

                <div className='mx-2'>
                  <select name='jobHolder' value={data.jobHolder} onChange={handleFilterChange} className='form-control'>
                    <option value = ""> Select Employee </option>
                    {myListUsers && myListUsers.map(item => 
                      <option value={item.name}> {item.name} </option>
                    )}
                  </select>
                </div>

                <div style={{width: '220px',}} className='mx-2'>
                  <select name='deadline' value={data.deadline} onChange={handleFilterChange} className='form-control'>
                    <option value = ""> Select Deadline </option>
                    <option value="Expired"> Expired </option>
                    <option value="Today"> Today </option>
                    <option value="Tomorrow"> Tomorrow </option>
                    <option value="In 7 days"> In 7 days </option>
                    <option value="In 15 days"> In 15 days </option>
                  </select>
                </div>


              </div>


            </div>

            <div className='d-flex'>


            </div>


          </div>
        </div>



          <Accordion className=''>
  
            {items && items.map(item => {
              if(item.page === "Job Planning" && item.visible){
                return(
                  <Accordion.Item key={item.id}>
                    <Accordion.Header>Jobs</Accordion.Header>
                    <Accordion.Body>
                      
                      <div>
                        <JobPlanning myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Tasks" && item.visible){
                return(
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Tasks</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Tasks myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Leads" && item.visible){
                return(
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Leads</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Leads myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Proposals" && item.visible){
                return(
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Proposals</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Proposals myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Construction" && item.visible){
                return(
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Construction</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Construction myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Recurring Task" && item.visible){
                return(
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Recurring Task</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <UserRecurringTasks myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Templates" && item.visible){
                return(
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>Templates</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Templates myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Goals" && item.visible){
                return(
                  <Accordion.Item eventKey="7">
                    <Accordion.Header>Goals</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Goals myListPageFData={data} fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
            
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
          </Accordion>
        </div>
      </>
    );
  }
};

export default MyTable;

/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

export default function SideBar(props) {

  const pagesAccess = props.pagesAccess
  const setToken = props.setToken
  const unreadCounter = props.unreadCounter

  const [jobsisOpen, setJobsIsOpen] = useState(false);
  const [settingsisOpen, setSettingsIsOpen] = useState(false);
  const [hrIsOpen, setHrIsOpen] = useState(false);

  const location = useLocation();



  return (
    <>
        <div className='sidebar_main'>

              <>
              {/* Dash */}
              {pagesAccess && pagesAccess.map(page => {
                if(page.name === "Dashboard Page" && page.isChecked){
                  return(
                    <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'sidebar_link_active' : 'sidebar_link'}>
                      <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                      <span style={{marginLeft: '10px'}}>Dashboard</span>
                  </Link>
                  )
                }
              })}
                    
                  {/* My List */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "My List Page" && page.isChecked){
                      return(
                        <Link to="/my_list" className={location.pathname === '/my_list' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M16 11H14M16 16H14M8 11L9 12L11 10M8 16L9 17L11 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                      <span style={{marginLeft: '10px'}}>My List</span>
                        </Link>
                      )
                    }
                  })}
                  
                  {/* Tasks */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Tasks Page" && page.isChecked){
                      return(
                        <Link to='/tasks' className={location.pathname === '/tasks' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span style={{marginLeft: '10px'}}>Tasks</span>
                        </Link>
                      )
                    }
                  })}
                  

                   {/* Jobs */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Jobs Page" && page.isChecked){
                      return(
                        <Link to="/clients/job-planning" className={location.pathname === '/clients/job-planning' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span style={{marginLeft: '10px'}}>Jobs</span>
                        </Link>
                      )
                    }
                  })}

                  {/* Tickets */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Tickets Page" && page.isChecked){
                      return(
                        <Link style={{display: 'flex', justifyContent: 'space-between'}} to='/tickets' className={location.pathname === '/tickets' ? 'sidebar_link_active' : 'sidebar_link'}>
                 
                        <div >
                        <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>ticket-blank</title> <path d="M30 13.75c0.414-0 0.75-0.336 0.75-0.75v0-5c-0-0.414-0.336-0.75-0.75-0.75h-28c-0.414 0-0.75 0.336-0.75 0.75v0 5c0 0.414 0.336 0.75 0.75 0.75v0c1.243 0 2.25 1.007 2.25 2.25s-1.007 2.25-2.25 2.25v0c-0.414 0-0.75 0.336-0.75 0.75v0 5c0 0.414 0.336 0.75 0.75 0.75h28c0.414-0 0.75-0.336 0.75-0.75v0-5c-0-0.414-0.336-0.75-0.75-0.75v0c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25v0zM29.25 19.674v3.576h-26.5v-3.576c1.724-0.361 3-1.869 3-3.674s-1.276-3.313-2.975-3.67l-0.024-0.004v-3.576h26.5v3.576c-1.724 0.361-3 1.869-3 3.674s1.276 3.313 2.975 3.67l0.024 0.004z"></path> </g></svg>
                          <span style={{marginLeft: '10px'}}>Tickets</span>
                        </div>

                        <div>
                          {unreadCounter > 0 && 
                            <p style={{
                              // padding: '4px',
                              fontSize: '12px',
                              // backgroundColor: 'red',
                              // borderRadius: '100px',
                              color: 'black',
                            }}>
                              {unreadCounter}
                            </p>
                          }
                        </div>

                  
                  </Link>
                      )
                    }
                  })}

                   {/* Leads */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Leads Page" && page.isChecked){
                      return(
                        <Link 
                        to='/leads' className={location.pathname === '/leads' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers icon"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        <span style={{marginLeft: '10px'}}>Leads</span>
                        </Link>
                      )
                    }
                  })}

                   {/* Proposals */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Proposals Page" && page.isChecked){
                      return(
                        <Link to="/proposals" className={location.pathname === '/proposals' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" version="1.1" viewBox="0 0 64 64" xmlSpace="preserve" > <g> <path d="M46.521 56H17.479C12.252 56 8 51.748 8 46.521V17.479C8 12.252 12.252 8 17.479 8h29.042C51.748 8 56 12.252 56 17.479v29.042C56 51.748 51.748 56 46.521 56zM17.479 13.146a4.338 4.338 0 00-4.333 4.333v29.042a4.338 4.338 0 004.333 4.333h29.042a4.338 4.338 0 004.333-4.333V17.479a4.338 4.338 0 00-4.333-4.333H17.479z"></path> <path d="M39.662 47.507H24.338a2.574 2.574 0 01-2.3-1.419l-3.752-7.477h-7.714a2.572 2.572 0 11.001-5.145h9.302c.973 0 1.863.549 2.3 1.419l3.752 7.477h12.148l3.752-7.477a2.572 2.572 0 012.3-1.419h9.302a2.573 2.573 0 010 5.146h-7.714l-3.752 7.477a2.578 2.578 0 01-2.301 1.418zM42.123 30.593H21.877a2.573 2.573 0 010-5.146h20.245a2.573 2.573 0 01.001 5.146zM42.123 21.772H21.877a2.573 2.573 0 010-5.146h20.245a2.573 2.573 0 01.001 5.146z"></path> </g> </svg>
                        <span style={{marginLeft: '10px'}}>Proposals</span>
                        </Link>
                      )
                    }
                  })}

                  {/* Sales */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Sales Page" && page.isChecked){
                      return(
                        <Link to="/sales" className={location.pathname === '/sales' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span style={{marginLeft: '10px'}}>Sales</span>
                        </Link>
                      )
                    }
                  })}

                   {/* Template */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Template Page" && page.isChecked){
                      return(
                        <Link to='/templates' className={location.pathname === '/templates' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024" fill="#000000" class="icon" version="1.1"><path d="M528.028 80.056H304.024a8.028 8.028 0 0 1-6.656-3.562L265.374 28.5a8 8 0 0 1 2.218-11.092 8.012 8.012 0 0 1 11.092 2.218l29.622 44.432h216.41l45.62-45.65a8 8 0 0 1 11.31 11.312l-47.962 47.994a8.01 8.01 0 0 1-5.656 2.342zM256.032 64.058H80.054c-4.42 0-8-3.578-8-8s3.578-8 8-8h175.978c4.42 0 7.998 3.578 7.998 8s-3.578 8-7.998 8zM767.964 64.058h-191.974c-4.422 0-8-3.578-8-8s3.578-8 8-8h191.974c4.42 0 7.998 3.578 7.998 8s-3.578 8-7.998 8z" fill=""/><path d="M480.002 48.06h-127.984a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h127.984A7.994 7.994 0 0 1 488 40.06c0 4.422-3.578 8-7.998 8zM735.968 879.952h-63.992c-4.42 0-7.998-3.576-7.998-7.998s3.578-8 7.998-8h63.992c4.42 0 7.998 3.578 7.998 8s-3.578 7.998-7.998 7.998z" fill=""/><path d="M671.976 943.944a7.994 7.994 0 0 1-7.998-7.998v-63.992c0-4.422 3.578-8 7.998-8a7.994 7.994 0 0 1 7.998 8v63.992a7.994 7.994 0 0 1-7.998 7.998zM80.054 975.94c-4.42 0-8-3.578-8-7.998V56.058c0-4.422 3.578-8 8-8s8 3.578 8 8V967.94a7.998 7.998 0 0 1-8 8zM767.964 895.95c-4.422 0-8-3.578-8-7.998V56.058c0-4.422 3.578-8 8-8a7.994 7.994 0 0 1 7.998 8v831.892c0 4.422-3.578 8-7.998 8z" fill=""/><path d="M687.974 975.94a7.996 7.996 0 0 1-5.656-13.654l79.99-79.99a7.996 7.996 0 1 1 11.31 11.31l-79.988 79.99a7.974 7.974 0 0 1-5.656 2.344z" fill=""/><path d="M687.974 975.94H80.054c-4.42 0-8-3.578-8-7.998 0-4.422 3.578-8 8-8h607.92c4.422 0 8 3.578 8 8a7.994 7.994 0 0 1-8 7.998zM815.958 1023.934c-4.422 0-8-3.578-8-8V8.064a7.994 7.994 0 0 1 8-7.998 7.994 7.994 0 0 1 7.998 7.998v1007.87a7.994 7.994 0 0 1-7.998 8z" fill=""/><path d="M815.958 1023.934H32.06c-4.422 0-8-3.578-8-8s3.578-7.998 8-7.998h783.898c4.42 0 7.998 3.576 7.998 7.998s-3.578 8-7.998 8z" fill=""/><path d="M32.06 1023.934c-4.422 0-8-3.578-8-8V8.064a7.994 7.994 0 0 1 8-7.998 7.994 7.994 0 0 1 7.998 7.998v1007.87c0 4.422-3.578 8-7.998 8z" fill=""/><path d="M815.958 16.064H32.06c-4.422 0-8-3.578-8-8a7.994 7.994 0 0 1 8-7.998h783.898a7.994 7.994 0 0 1 7.998 7.998 7.994 7.994 0 0 1-7.998 8zM943.942 911.962a7.994 7.994 0 0 1-6.654-3.56l-31.996-47.996a7.974 7.974 0 0 1-0.938-6.966l15.592-46.76v-14.702c0-4.42 3.576-7.998 7.998-7.998s8 3.578 8 7.998v15.998c0 0.86-0.14 1.718-0.406 2.532l-14.766 44.276 29.824 44.744a8 8 0 0 1-6.654 12.434z" fill=""/><path d="M943.942 911.962a8 8 0 0 1-6.654-12.436l29.824-44.744-14.766-44.276a8.16 8.16 0 0 1-0.406-2.532v-15.998c0-4.42 3.578-7.998 8-7.998s8 3.578 8 7.998v14.702l15.59 46.76a7.968 7.968 0 0 1-0.938 6.966L950.596 908.4a7.99 7.99 0 0 1-6.654 3.562zM975.938 671.994h-63.992a7.994 7.994 0 0 1-7.998-7.998c0-4.422 3.578-8 7.998-8h63.992a7.994 7.994 0 0 1 7.998 8 7.994 7.994 0 0 1-7.998 7.998z" fill=""/><path d="M911.946 671.994a8.004 8.004 0 0 1-7.998-7.686l-15.998-399.964a8.016 8.016 0 0 1 7.686-8.31c4.64 0.312 8.14 3.264 8.312 7.686l15.998 399.964a8.018 8.018 0 0 1-7.688 8.31h-0.312zM975.938 671.994h-0.312a8.018 8.018 0 0 1-7.686-8.31l15.996-399.964c0.188-4.42 4.172-7.326 8.312-7.686a8.02 8.02 0 0 1 7.686 8.31l-15.998 399.964a8.004 8.004 0 0 1-7.998 7.686z" fill=""/><path d="M991.936 272.032c-4.422 0-8-3.578-8-8 0-37.15-13.452-55.992-39.994-55.992s-39.994 18.842-39.994 55.992c0 4.422-3.578 8-8 8s-7.998-3.578-7.998-8c0-45.744 20.404-71.99 55.992-71.99 35.59 0 55.992 26.246 55.992 71.99 0 4.422-3.576 8-7.998 8z" fill=""/><path d="M959.94 208.04h-31.996c-4.422 0-7.998-3.578-7.998-8s3.576-8 7.998-8h31.996c4.422 0 8 3.578 8 8s-3.578 8-8 8zM943.942 480.004a7.994 7.994 0 0 1-7.998-8V232.036c0-4.42 3.576-7.998 7.998-7.998s7.998 3.578 7.998 7.998v239.97a7.994 7.994 0 0 1-7.998 7.998zM975.938 703.99h-63.992a7.994 7.994 0 0 1-7.998-7.998c0-4.422 3.578-8 7.998-8h63.992a7.994 7.994 0 0 1 7.998 8 7.994 7.994 0 0 1-7.998 7.998z" fill=""/><path d="M975.938 703.99a7.994 7.994 0 0 1-7.998-7.998v-31.996c0-4.422 3.576-8 7.998-8s7.998 3.578 7.998 8v31.996a7.994 7.994 0 0 1-7.998 7.998zM911.946 703.99a7.994 7.994 0 0 1-7.998-7.998v-31.996c0-4.422 3.578-8 7.998-8 4.422 0 8 3.578 8 8v31.996a7.994 7.994 0 0 1-8 7.998zM975.938 799.976h-63.992a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h63.992a7.994 7.994 0 0 1 7.998 7.998 7.992 7.992 0 0 1-7.998 7.998z" fill=""/><path d="M975.938 799.976a7.992 7.992 0 0 1-7.998-7.998v-95.986c0-4.422 3.576-8 7.998-8s7.998 3.578 7.998 8v95.986a7.992 7.992 0 0 1-7.998 7.998zM911.946 799.976a7.994 7.994 0 0 1-7.998-7.998v-95.986c0-4.422 3.578-8 7.998-8 4.422 0 8 3.578 8 8v95.986a7.994 7.994 0 0 1-8 7.998zM208.038 320.024a7.982 7.982 0 0 1-5.656-2.342l-31.996-31.996a8 8 0 1 1 11.312-11.312l31.996 31.996a8 8 0 0 1-5.656 13.654z" fill=""/><path d="M208.038 320.024a8 8 0 0 1-5.656-13.654l63.992-63.992a7.996 7.996 0 1 1 11.31 11.31l-63.992 63.992a7.964 7.964 0 0 1-5.654 2.344z" fill=""/><path d="M671.976 240.036H352.018a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h319.958a7.994 7.994 0 0 1 7.998 7.998c0 4.422-3.576 8-7.998 8z" fill=""/><path d="M671.976 288.03H352.018a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h319.958a7.994 7.994 0 0 1 7.998 7.998c0 4.422-3.576 8-7.998 8z" fill=""/><path d="M511.998 336.022h-159.98c-4.42 0-7.998-3.578-7.998-8s3.578-8 7.998-8h159.98c4.422 0 7.998 3.578 7.998 8s-3.576 8-7.998 8z" fill=""/><path d="M176.042 559.992a7.996 7.996 0 0 1-5.656-13.652l79.99-79.99a7.996 7.996 0 1 1 11.31 11.31l-79.988 79.99a7.986 7.986 0 0 1-5.656 2.342z" fill=""/><path d="M256.032 559.992a7.982 7.982 0 0 1-5.656-2.342L170.386 477.66a8 8 0 0 1 11.312-11.31l79.988 79.99a7.996 7.996 0 0 1-5.654 13.652z" fill=""/><path d="M671.976 464.006H352.018c-4.42 0-7.998-3.578-7.998-8s3.578-8 7.998-8h319.958c4.422 0 7.998 3.578 7.998 8s-3.576 8-7.998 8z" fill=""/><path d="M671.976 512H352.018a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h319.958a7.994 7.994 0 0 1 7.998 7.998c0 4.422-3.576 8-7.998 8z" fill=""/><path d="M511.998 559.992h-159.98a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h159.98a7.994 7.994 0 0 1 7.998 7.998 7.992 7.992 0 0 1-7.998 7.998z" fill=""/><path d="M208.038 767.966a7.976 7.976 0 0 1-5.656-2.344l-31.996-31.996a8 8 0 0 1 11.312-11.31l31.996 31.996a7.996 7.996 0 0 1-5.656 13.654z" fill=""/><path d="M208.038 767.966a7.996 7.996 0 0 1-5.656-13.654l63.992-63.992a7.996 7.996 0 1 1 11.31 11.31l-63.992 63.992a7.964 7.964 0 0 1-5.654 2.344z" fill=""/><path d="M671.976 687.976H352.018a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h319.958a7.994 7.994 0 0 1 7.998 7.998c0 4.422-3.576 8-7.998 8z" fill=""/><path d="M671.976 735.97H352.018a7.994 7.994 0 0 1-7.998-7.998c0-4.422 3.578-8 7.998-8h319.958a7.994 7.994 0 0 1 7.998 8 7.994 7.994 0 0 1-7.998 7.998z" fill=""/><path d="M511.998 783.964h-159.98c-4.42 0-7.998-3.578-7.998-8s3.578-7.998 7.998-7.998h159.98c4.422 0 7.998 3.576 7.998 7.998s-3.576 8-7.998 8z" fill=""/></svg>                  <span style={{marginLeft: '10px'}}>Templates</span>
                        </Link>
                      )
                    }
                  })}

                  {/* Goals */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Goals Page" && page.isChecked){
                      return(
                        <Link to='/goals' className={location.pathname === '/goals' ? 'sidebar_link_active' : 'sidebar_link'}>
                 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9965 4.00001C11.4368 3.99846 11.8263 4.28508 11.9558 4.70591L15.1231 14.9997L18.0715 7.62861C18.1964 7.31651 18.4697 7.08801 18.7989 7.02042C19.1282 6.95284 19.4694 7.0552 19.7071 7.29289L22.7071 10.2929C23.0976 10.6834 23.0976 11.3166 22.7071 11.7071C22.3166 12.0976 21.6834 12.0976 21.2929 11.7071L19.3652 9.77946L15.9285 18.3714C15.771 18.765 15.3826 19.0165 14.959 18.9992C14.5355 18.9818 14.1689 18.6992 14.0442 18.2941L11.0121 8.43973L8.95782 15.2873C8.84938 15.6488 8.54667 15.9185 8.17511 15.9845C7.80355 16.0506 7.42643 15.9019 7.2 15.6L5 12.6667L2.8 15.6C2.46863 16.0418 1.84183 16.1314 1.4 15.8C0.95817 15.4686 0.868627 14.8418 1.2 14.4L4.2 10.4C4.38885 10.1482 4.68524 10 5 10C5.31475 10 5.61114 10.1482 5.8 10.4L7.6114 12.8152L10.0422 4.71265C10.1687 4.29092 10.5562 4.00156 10.9965 4.00001Z" fill="#000000"/>
                  </svg>
                  
                  <span style={{marginLeft: '10px'}}>Goals</span>
                  </Link>
                      )
                    }
                  })}

                  {/* Subscription */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Subscription Page" && page.isChecked){
                      return(
                        <Link to='/subscription' className={location.pathname === '/subscription' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.691 8.507c0 2.847 1.582 5.29 3.806 5.29 2.223 0 3.803-2.443 3.803-5.29 0-2.846-1.348-4.51-3.803-4.51-2.456 0-3.806 1.664-3.806 4.51zM1.326 19.192c.82.537 2.879.805 6.174.805 3.295 0 5.353-.268 6.174-.804a.5.5 0 0 0 .225-.453c-.152-2.228-2.287-3.343-6.403-3.343-4.117 0-6.249 1.115-6.395 3.344a.5.5 0 0 0 .225.451zm21.381-8.485a1 1 0 1 0-1.414-1.414L17 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l5-5z" fill="#000000"/></svg>
                        <span style={{marginLeft: '10px'}}>Subscription</span>
                        </Link>
                      )
                    }
                  })}

                   {/* User Recurring Tasks */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Recurring Tasks Page" && page.isChecked){
                      return(
                        <Link to='/userrecurringtasks' className={location.pathname === '/userrecurringtasks' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 21C4 17.134 7.13401 14 11 14M18.5 20.2361C17.9692 20.7111 17.2684 21 16.5 21C14.8431 21 13.5 19.6569 13.5 18C13.5 16.3431 14.8431 15 16.5 15C17.8062 15 18.9175 15.8348 19.3293 17M20 14.5V17.5H17M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span style={{marginLeft: '10px'}}>Recurring Tasks</span>
                        </Link>
                      )
                    }
                  })}

                  {/* HR */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "HR Page" && page.isChecked){
                      return(
                        <>
                      <Link className="sidebar_link" onClick={()=>{setHrIsOpen(!hrIsOpen)}}>
                      <div style={{justifyContent: 'space-between',}} className='d-flex'>
                        <div>
                          <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                          <span style={{marginLeft: '10px'}}>HR</span>
                        </div>
                        <div>
                          <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      </div>
                      </Link>

                      <div className={`sidebar_subtasks_hr ${hrIsOpen ? 'open' : 'closed'}`}  >

                          <Link to='/hr/employees' className={location.pathname === '/hr/employees' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Employees</span>
                          </Link>

                          <Link to='/hr/attendance' className={location.pathname === '/hr/attendance' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Attendance</span>
                          </Link>
                          <Link to='/hr/absents' className={location.pathname === '/hr/absents' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Absents</span>
                          </Link>

                      </div>
                    </>
                      )
                    }
                  })}

                   {/* Reports */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Reports Page" && page.isChecked){
                      return(
                        <>
                      <Link className="sidebar_link" onClick={()=>{setJobsIsOpen(!jobsisOpen)}}>
                      <div style={{justifyContent: 'space-between',}} className='d-flex'>
                        <div>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart icon"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                          <span style={{marginLeft: '10px'}}>Reports</span>
                        </div>
                        <div>
                          <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      </div>
                      </Link>

                      <div className={`sidebar_subtasks ${jobsisOpen ? 'open' : 'closed'}`}  >

                          <Link to="/timesheet" className={location.pathname === '/timesheet' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Timesheet</span>
                          </Link>
                          
                          {/* <Link to="/clients/job-planning" className={location.pathname === '/admin/dashboard' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Job Planing</span>
                          </Link>

                          <Link className={location.pathname === '/admin/dashboard' ? 'sidebar_link_active' : 'sidebar_link'}>
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Database</span>
                          </Link> */}

                      </div>
                    </>
                      )
                    }
                  })}

                  {/* Clients */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Clients Page" && page.isChecked){
                      return(
                        <Link to='/clients' className={location.pathname === '/clients' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase icon"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        <span style={{marginLeft: '10px'}}>Clients</span>
                        </Link>
                      )
                    }
                  })}

                   {/* Construction */}
                   {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Construction Page" && page.isChecked){
                      return(
                        <Link to='/construction' className={location.pathname === '/construction' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 -6 1036 1036" fill="#000000" class="icon" version="1.1"><path d="M719.426083 455.245822h234.197458v73.724278H719.426083zM960.258726 580.454221v68.686453h-87.609017v-99.527776h-73.724279v100.387893a203.479008 203.479008 0 0 0-187.505414 202.618891h92.523969a110.586418 110.586418 0 0 1 110.586418-110.586417h145.482576v82.694065h73.724278V580.454221h-73.724278zM610.682773 973.527499a48.043655 48.043655 0 1 0 95.964435 0c0-26.54074-48.043655-104.934223-48.043654-104.934223s-47.920781 78.516356-47.920781 104.934223zM130.000478 762.92181h79.867968v45.094684h-79.867968zM130.000478 688.82891h79.867968v45.094684h-79.867968zM130.000478 837.137584h79.867968v45.094683h-79.867968zM902.016546 252.504056L679.123478 10.442675A35.633401 35.633401 0 0 0 650.985378 0.121276h-15.359224L138.724517 275.112835 45.340431 381.030048a28.629595 28.629595 0 0 0 0 40.548353 32.561556 32.561556 0 0 0 12.28738 7.74105V528.478605a81.711075 81.711075 0 1 0 112.429525 75.813133h-61.436899a20.274177 20.274177 0 1 1-20.274177-20.39705h30.71845V434.725898l98.299037 9.092661h140.936246v29.735459a53.204354 53.204354 0 0 0 50.501131 50.50113h57.873558v376.362441h-127.788749V491.616466h-147.448557v73.724278h73.724279v362.477702H73.724278V745.10511H0V1001.542725h578.735585a84.291425 84.291425 0 0 1-4.792078-27.892352c0-18.676817 11.304389-46.692043 24.57476-73.724279h-56.521947v-65.614607h33.298799a237.023555 237.023555 0 0 1 18.553943-75.567386h-51.852742V688.214541h71.266802v35.019033a243.412993 243.412993 0 0 1 69.177948-70.160939V417.892187h226.947904a33.544547 33.544547 0 0 0 2.58035-12.287379V280.273534a35.387654 35.387654 0 0 0-9.952778-27.769478zM190.085764 376.975213h-58.856548l58.856548-58.856549v58.856549z m129.631857 0h-71.143929v-58.856549h71.143929v58.856549z m-8.232545-128.034497L556.372554 116.851384l-78.270609 132.089332H311.485076z m77.533366 124.962652v-55.784704h64.508744z m224.24468 244.887478h-71.266802v-88.34626h71.266802v88.34626z m0-167.722733H446.400506v-40.056858l80.850958-73.724279h86.011658v113.412515z m0-202.250271h-49.149518l49.149518-78.516356v78.516356z m114.764127 128.034497h-39.196741v-58.856549h39.196741v58.856549z m-45.586179-128.034497V126.681288l112.675273 122.136554h-112.675273z m160.350306 128.034497h-45.217558v-58.856549h45.586179v58.856549z"/></svg>                  
                        <span style={{marginLeft: '10px'}}>Construction</span>
                      </Link>
                      )
                    }
                  })}

                  {/* Settings */}
                  {pagesAccess && pagesAccess.map(page => {
                    if(page.name === "Settings Page" && page.isChecked){
                      return(
                        <>
                    <Link className="sidebar_link" onClick={()=>{setSettingsIsOpen(!settingsisOpen)}}>
                    <div style={{justifyContent: 'space-between',}} className='d-flex'>
                      <div>
                      <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span style={{marginLeft: '10px'}}>Settings</span>
                      </div>
                      <div>
                        <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                    </Link>

                    <div className={`sidebar_subtasks_settings ${settingsisOpen ? 'open' : 'closed'}`}  >

                        <Link to="/roles" className={location.pathname === '/roles' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>Roles</span>
                        </Link>
                        
                        <Link to="/roles/user" className={location.pathname === '/roles/user' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>User Roles</span>
                        </Link>

                        <Link to='/companies' className={location.pathname === '/companies' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>Companies</span>
                        </Link>
                        
                        <Link to='/finance/charts_of_accounts' className={location.pathname === '/finance/charts_of_accounts' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>Chart Of Accounts</span>
                        </Link>

                        <Link to='/settings/my-list' className={location.pathname === '/settings/my-list' ? 'sidebar_link_active' : 'sidebar_link'}>
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>My List</span>
                        </Link>

                    </div>


                  </>
                      )
                    }
                  })}

                  {/* Logout */}
                  <Link onClick={()=>{
                    secureLocalStorage.removeItem("token");
                    setToken(secureLocalStorage.getItem('token'))
                  }} className="sidebar_link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                      <path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.76001 12.0601H19.93" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    <span style={{marginLeft: '10px'}}>Logout</span>
                  </Link>
              </>
            

          

        </div>
    </>
  );
}

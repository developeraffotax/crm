import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import logo from "../../../../Assets/Images/logo.svg"
import Note from "../../../../Assets/Images/note.svg"
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';

var getAllNotificationsUrl = axiosURL.getAllNotificationsUrl;
var markAllNotificationsReadUrl = axiosURL.markAllNotificationsReadUrl;
var markOneNotificationsReadUrl = axiosURL.markOneNotificationsReadUrl;

export default function TopBar(props) {

  const miniNoteIsOpen = props.miniNoteIsOpen;
  const setMiniNoteIsOpen = props.setMiniNoteIsOpen;
  const recurringNoteIsOpen = props.recurringNoteIsOpen;
  const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen;
  const setSideBarIsClosed = props.setSideBarIsClosed;
  
  const notificationRef = useRef(null);

  const [reRender, setReRender] = useState(false)
  const [user, setUser] = useState("")
  const [notificationIsOpen, setNotificationIsOpen] = useState(false)
  const [notificationsData, setNotificationsData] = useState(null)
  const navigate = useNavigate();


  const getNotifications = async ()=>{

    const token = secureLocalStorage.getItem('token')
    const notiData = await axios.get(getAllNotificationsUrl,
      {
        headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
         }
      }
    );

    setNotificationsData(notiData.data)
    
  }

  const markAllNoti = async (e)=>{
    e.preventDefault();
    
    const token = secureLocalStorage.getItem('token')
    await axios.get(markAllNotificationsReadUrl,
      {
        headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
         }
      }
    );

    setReRender(prev => !prev)
    
  }

  const markOneAsRead = async (noti)=>{
    try {
      axios.get(`${markOneNotificationsReadUrl}/${noti._id}`,
        {
          headers:{ 
            'Content-Type': 'application/json'
           }
        }
      );

      navigate(noti.redirectLink)
      // history.push(noti.redirectLink);
      setReRender(prev => !prev)
      setNotificationIsOpen(false)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // Event listener callback function
    const handleDocumentClick = (event) => {
      // Check if the click occurred outside the notification bar
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        // Close the notification bar if it's open
        setNotificationIsOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('click', handleDocumentClick);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleNotificationClick = (event) => {
    // Prevent the click from propagating to the document and closing the notification bar immediately
    event.stopPropagation();
    // Toggle the state of the notification bar
    setNotificationIsOpen((prevNotificationIsOpen) => !prevNotificationIsOpen);
  };
  

  useEffect(() => {
    getNotifications();
    const intervalId = setInterval(() => {
      getNotifications();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [reRender]);


  return (
    <>
      <div className='topbar_logo'>
        <img style={{width: "50px"}} src={logo} alt="" />
        <h1
          style={
            {
                fontSize: '27px',
                fontWeight: '600',
                width: '105px',
                marginLeft: "10px"
            }
          }
        >Affotax</h1>

          <div style={{ marginTop: '5px', cursor: "pointer" }} onClick={()=>{setSideBarIsClosed(prev => !prev)}}>
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 5V19M6 8H8M6 11H8M6 14H8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </div>

      </div>
          
      <div className='topbar_body'>
        <div style={{width: '100%',}} className="row">
          <div style={{ zIndex: '1',}} className="col-8">
            
              <Timer setUser={setUser}/>
          </div>
          <div style={{alignItems: 'center', justifyContent: 'right',}} className="col-4 d-flex">

            <div style={{position: 'relative',}}>
              <Link ref={notificationRef} onClick={handleNotificationClick} className='mx-1' style={{all: 'unset',}} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                
                {notificationsData && notificationsData.unreadNotiNumber > 0 && 
                
                  <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '0px',
                  backgroundColor: 'red',
                  height: '19px',
                  width: '19px',
                  padding: '0px',
                  margin: '0px',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                    }}>
                    {notificationsData.unreadNotiNumber}
                  </div>
                }


              </Link>

              {notificationIsOpen && 
              <div style={{
                zIndex: '10000',
                height: '26rem',
                width: '22rem',
                position: 'absolute',
                backgroundColor: 'white',
                right: '0px',
                top: '34px',
                boxShadow: '0px 0px 11px 1px lightgrey',
                }}>
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>

                    <div >
                      <p style={{padding: '5px'}}>
                        Notifications 
                      </p>
                      <hr style={{margin: '0px'}} />
                    </div>

                    <div style={{
                      height: 'inherit',
                      overflowY: 'scroll',
                    }}>
                      
                      {notificationsData.notifications && notificationsData.notifications.map((noti, ind)=>{
                        return(

                          <a onClick={()=>{markOneAsRead(noti)}} style={{all: 'unset'}}>
                            <div key={ind} style={{}} className={`${!noti.isRead ? "NotiBarNew" : "NotiBar"}`}>
                              <p style={{display: 'flex', fontWeight: '600', fontSize: '17px', placeContent: 'space-between',}}>
                                <span>
                                  {noti.title}
                                </span>
                                {!noti.isRead && 
                                  <span style={{fontSize: '12px', color: 'blue',}}>
                                      *Unread
                                  </span>
                                }
                              </p>
                              <p style={{fontSize: '11px',}}>
                                {noti.description}
                              </p>
                            </div>
                          </a>

                        )
                      })}
                      
                      


                    </div>

                    <div>
                      <hr style={{margin: '0px'}} />
                      <Link onClick={markAllNoti} style={{padding: '5px' , textAlign: 'right', fontSize: '12px', display: 'block',}}>
                        Mark All As Read
                      </Link>
                    </div>


                  </div>


              </div>
              }


            </div>

              
            <Link className='mx-1' onClick={()=>{setMiniNoteIsOpen(!miniNoteIsOpen)}}>
              <img style={{width: "27px",}} src={Note} alt="" />
            </Link>
            <Link className='mx-1' onClick={()=>{setRecurringNoteIsOpen(!recurringNoteIsOpen)}}>
            <svg  xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24"><path d="M4.922 16.71l-.651.758a6.832 6.832 0 0 1-2.07-4.983A6.372 6.372 0 0 1 8.585 6h7.454L14.4 4.36l.706-.708L17.954 6.5l-2.848 2.848-.707-.707L16.04 7H8.586A5.386 5.386 0 0 0 3.2 12.5a5.92 5.92 0 0 0 1.722 4.21zm14.8-9.178l-.652.758a5.944 5.944 0 0 1 1.73 4.21 5.39 5.39 0 0 1-5.395 5.5H7.96l1.64-1.64-.706-.708L6.046 18.5l2.848 2.848.707-.707L7.96 19h7.445a6.376 6.376 0 0 0 6.395-6.486 6.857 6.857 0 0 0-2.079-4.982z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
            </Link>
            <p>{user}</p>
          </div>
        </div>
      </div>
    </>
  );
}

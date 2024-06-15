import React, {useEffect, useState} from 'react'
import secureLocalStorage from 'react-secure-storage';
import './App.css';

import AdminRoutes from './Components/Routes/AdminRoutes';
import AuthRoutes from './Components/Routes/AuthRoutes';

import axios from './Api/Axios';
import * as axiosURL from './Api/AxiosUrls';
import Loader from './Components/Common/Loader/Loader';
import { Store } from 'react-notifications-component';
import MiniNotes from './Components/MiniNotes/MiniNotes';
import RecurringNotes from './Components/RecurringNotes/RecurringNotes';

var getUsersRolesUrl = axiosURL.getUsersRolesUrl;


function App() {

  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState(secureLocalStorage.getItem('token'));
  const [pagesAccess, setPagesAccess] = useState('');
  const [roleName, setRoleName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [miniNoteIsOpen, setMiniNoteIsOpen] = useState(false)
  const [recurringNoteIsOpen, setRecurringNoteIsOpen] = useState(false)

  if(token){
    
  }


  const getUsersRoles = async ()=>{
    setLoader(true)
        try {
            const response = await axios.get(getUsersRolesUrl,
                {
                    headers:{ 
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token
                     }
                    
                }
            );


            if(response.status === 401){
              secureLocalStorage.removeItem("token");
              setToken(secureLocalStorage.getItem('token'))
              setLoader(false)
            }

            if(response.status === 200){
                // setMainRowData(response.data)
                setPagesAccess(response.data.users.role_id.pages)
                setRoleName(response.data.users.role_id.name)
                setUserName(response.data.users.name)
                response.data.userList ? secureLocalStorage.setItem("MyList", response.data.userList.userList) : secureLocalStorage.removeItem("MyList");
                setLoader(false)
            }
            
        
            } catch (err) {
              secureLocalStorage.removeItem("token");
              setToken(secureLocalStorage.getItem('token'))
              setLoader(false)
            Store.addNotification({
                title: 'Error',
                message: "Session Expired Plaease Login Again to continue",
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
    if(token){
      getUsersRoles()
    }
  }, [token]);

  useEffect(() => {
    // Get the current tab's ID
    const currentTabId = Math.random().toString(36).substr(2, 9);
   
    // Create a new BroadcastChannel with the same name
    const channel = new BroadcastChannel('refresh_channel');
    
    // Listen for messages sent through the channel
    channel.onmessage = (event) => {
      if (event.data.action === 'refresh' && event.data.tabId !== currentTabId) {
        // Refresh the page
        window.location.reload();
      }
    };
   
   // Clean up the channel when component unmounts
   return () => {
     channel.close();
   };
 }, []);



  if(!token){
    return (
      <AuthRoutes />
    );
  }
  else{
    if(loader){
      <Loader />
    }
    else{
      return (
        <>
          <div style={{display: 'flex',}}>
            <div className={` MainMiniNote ${miniNoteIsOpen && "miniNoteOpenMain"} ${recurringNoteIsOpen && "recurringNoteOpenMain"}`} >
              <AdminRoutes 
                roleName={roleName} 
                userName={userName} 
                pagesAccess={pagesAccess} 
                setMiniNoteIsOpen={setMiniNoteIsOpen} 
                miniNoteIsOpen={miniNoteIsOpen} 
                setRecurringNoteIsOpen={setRecurringNoteIsOpen} 
                recurringNoteIsOpen={recurringNoteIsOpen}
                setToken={setToken}
              />
            </div>
            <div className={`MiniNote ${miniNoteIsOpen && "miniNoteOpenMiniNote"}`}>
              <MiniNotes setMiniNoteIsOpen={setMiniNoteIsOpen} miniNoteIsOpen={miniNoteIsOpen} />
            </div>
            <div className={`recurringNote ${recurringNoteIsOpen && "recurringNoteOpenMiniNote"}`}>
              <RecurringNotes setRecurringNoteIsOpen={setRecurringNoteIsOpen} recurringNoteIsOpen={recurringNoteIsOpen} />
            </div>
          </div>
        </>
      );
    }
  }


}

export default App;

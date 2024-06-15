/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Clients from "../Dashs/Admin/Clients/clients";
import EditClient from "../Dashs/Admin/Clients/EditClient";
import Dashboard from "../Dashs/Admin/DashBoard/DashBoard";
import AddEmployee from "../Dashs/Admin/Hr/Employee/AddEmployee";
import EditEmployee from "../Dashs/Admin/Hr/Employee/EditEmployee";
import Employees from "../Dashs/Admin/Hr/Employee/Employees";
import Leads from "../Dashs/Admin/Leads/Leads";
import Roles from "../Dashs/Admin/Settings/Roles/Roles";
import UserRoles from "../Dashs/Admin/Settings/UserRoles/UserRoles";
import SideBar from "../Dashs/Admin/SideBar/SideBar";
import Tasks from "../Dashs/Admin/Tasks/Tasks";
import Timesheet from "../Dashs/Admin/Timesheet/Timesheet";
import TopBar from "../Dashs/Admin/Topbar/TopBar";
import AddClients from "../Jobs/AddClients/AddClients";
import JobPlanning from "../Jobs/JobPlaning/JobPlanning";
import Sales from "../Dashs/Admin/Sales/Sales";
import InvoiceViewer from "../Dashs/Admin/Sales/InvoiceViewer";
import ChartsOfAccounts from "../Dashs/Admin/Finance/ChartsOfAccounts/ChartsOfAccounts";
import Attendance from "../Dashs/Admin/Hr/Attendance/Attendance";
import PublicDash from "../Dashs/Admin/DashBoard/PublicDash";
import Construction from "../Dashs/Admin/Construction/Construction";
import Templates from "../Dashs/Admin/Templates/Templates";
import Subscription from "../Dashs/Admin/Subscription/Subscription";
import Goals from "../Dashs/Admin/Goals/Goals";
import Tickets from "../Dashs/Admin/Tickets/Tickets";
import DetailedMail from "../Dashs/Admin/Tickets/DetailedMail";

import axios from "../../Api/Axios";
import * as axiosURL from "../../Api/AxiosUrls";
import secureLocalStorage from "react-secure-storage";
import TicketsContext from "../Dashs/Admin/Tickets/TicketsContext";
import MyList from "../Dashs/Admin/MyList/MyList";
import Companies from "../Dashs/Admin/Companies/Companies";
import Proposals from "../Dashs/Admin/Proposals/Proposals";
import UserRecurringTasks from "../Dashs/Admin/UserRecurringTasks/UserRecurringTasks";
import Absents from "../Dashs/Admin/Hr/Absents/Absents";
import MyListS from "../Dashs/Admin/Settings/MyList/MyListS";
var getAllTickets = axiosURL.getAllTickets;

export default function AdminRoutes(props) {
  const pagesAccess = props.pagesAccess;
  const miniNoteIsOpen = props.miniNoteIsOpen;
  const setMiniNoteIsOpen = props.setMiniNoteIsOpen;
  const recurringNoteIsOpen = props.recurringNoteIsOpen;
  const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen;
  const roleName = props.roleName;
  const userName = props.userName;
  const setToken = props.setToken;

  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsPagePermissions, setTicketsPagePermissions] = useState(null);
  const [reFetchTickets, setReFetchTickets] = useState(false);
  const [unreadCounter, setUnreadCounter] = useState(0);
  const [sideBarIsClosed, setSideBarIsClosed] = useState(false);
  const [myListUsers, setMyListUsers] = useState([]);

  var finalTicketData = {
    ticketsData,
    setReFetchTickets: setReFetchTickets,
  };

  useEffect(() => {
    const fetchDataImd = async () => {
      try {
        for (const page of pagesAccess) {
          if (page.name === "Tickets Page" && page.isChecked) {
            setTicketsData("Loading");
            setTicketsPagePermissions(page.permissions);
            const token = secureLocalStorage.getItem("token");
            const response = await axios.get(getAllTickets, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            });

            if (response.status === 200) {
              setTicketsData(response.data);
              setUnreadCounter(response.data.Emails.unreadCount);
            } else {
              fetchData();
              setTicketsData("Error");
            }

            finalTicketData = {
              ticketsData,
              setReFetchTickets: setReFetchTickets,
            };
          }
        }
      } catch (error) {
        setTicketsData("Error");
      }
    };

    async function fetchData() {
      try {
        for (const page of pagesAccess) {
          if (page.name === "Tickets Page" && page.isChecked) {
            setTicketsData("Loading");
            const token = secureLocalStorage.getItem("token");
            const response = await axios.get(getAllTickets, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            });

            if (response.status === 200) {
              setTicketsData(response.data);
              setUnreadCounter(response.data.Emails.unreadCount);
            } else {
              fetchData();
              setTicketsData("Error");
            }

            finalTicketData = {
              ticketsData,
              setReFetchTickets: setReFetchTickets,
            };
          }
        }
      } catch (error) {
        setTicketsData("Error");
      }
    }

    fetchDataImd(); // Run immediately

    const interval = setInterval(fetchData, 60 * 1000); // Run every 5 minutes (300 seconds)

    return () => {
      clearInterval(interval);
    };
  }, [pagesAccess, reFetchTickets]);

  const getMyListData = async () => {
    try {
      const resp = await axios.get(axiosURL.myListPredataUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMyListUsers(resp.data.users);
    } catch (error) {}
  };

  useEffect(() => {
    getMyListData();
  }, []);

  return (
    <>
      <Router>
        <div>
          <div className="layout_topbar">
            <TopBar
              setMiniNoteIsOpen={setMiniNoteIsOpen}
              miniNoteIsOpen={miniNoteIsOpen}
              setRecurringNoteIsOpen={setRecurringNoteIsOpen}
              recurringNoteIsOpen={recurringNoteIsOpen}
              setSideBarIsClosed={setSideBarIsClosed}
            />
          </div>
          <div className="Layout_bottom_screen">
            <div className={`layout_sidebar ${sideBarIsClosed && "close"}`}>
              <SideBar
                setToken={setToken}
                pagesAccess={pagesAccess}
                unreadCounter={unreadCounter}
              />
            </div>
            <div className={`layout_main_screen ${sideBarIsClosed && "close"}`}>
              <div className="layout_main_screen_content">
                <Routes>
                  <Route path="/" element={<PublicDash />}></Route>
                  <Route
                    path="/admin/dashboard"
                    element={<Dashboard />}
                  ></Route>
                  <Route path="/clients/add" element={<AddClients />}></Route>
                  <Route
                    path="/clients/job-planning"
                    element={
                      <JobPlanning
                        roleName={roleName}
                        userName={userName}
                        pagesAccess={pagesAccess}
                      />
                    }
                  ></Route>
                  <Route
                    path="/subscription"
                    element={<Subscription />}
                  ></Route>
                  <Route path="/hr/employees" element={<Employees />}></Route>
                  <Route
                    path="/hr/employees/add"
                    element={<AddEmployee />}
                  ></Route>
                  <Route
                    path="/hr/employees/edit/:id"
                    element={<EditEmployee />}
                  ></Route>
                  <Route
                    path="/clients"
                    element={<Clients roleName={roleName} />}
                  ></Route>
                  <Route path="/client/:id" element={<EditClient />}></Route>
                  <Route
                    path="/timesheet"
                    element={
                      <Timesheet roleName={roleName} userName={userName} />
                    }
                  ></Route>
                  <Route path="/leads" element={<Leads />}></Route>
                  <Route path="/roles" element={<Roles />}></Route>
                  <Route path="/roles/user" element={<UserRoles />}></Route>
                  <Route path="/tasks" element={<Tasks />}></Route>
                  <Route path="/sales" element={<Sales />}></Route>
                  <Route
                    path="/view/invoice"
                    element={<InvoiceViewer />}
                  ></Route>
                  <Route
                    path="/finance/charts_of_accounts"
                    element={<ChartsOfAccounts />}
                  ></Route>
                  <Route path="/hr/attendance" element={<Attendance />}></Route>
                  <Route path="/hr/absents" element={<Absents />}></Route>
                  <Route
                    path="/construction"
                    element={<Construction />}
                  ></Route>
                  <Route path="/templates" element={<Templates />}></Route>
                  <Route path="/goals" element={<Goals />}></Route>
                  <Route
                    path="/my_list"
                    element={<MyList myListUsers={myListUsers} />}
                  ></Route>
                  <Route
                    path="/userrecurringtasks"
                    element={<UserRecurringTasks />}
                  ></Route>
                  <Route
                    path="/tickets"
                    element={
                      <TicketsContext.Provider value={finalTicketData}>
                        <Tickets
                          setReFetchTickets={setReFetchTickets}
                          roleName={roleName}
                          ticketsPagePermissions={ticketsPagePermissions}
                        />
                      </TicketsContext.Provider>
                    }
                  ></Route>
                  <Route
                    path="/tickets/mail"
                    element={
                      <DetailedMail setReFetchTickets={setReFetchTickets} />
                    }
                  ></Route>
                  <Route path="/companies" element={<Companies />}></Route>
                  <Route path="/proposals" element={<Proposals />}></Route>
                  <Route path="/settings/my-list" element={<MyListS />}></Route>
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

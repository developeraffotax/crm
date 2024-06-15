/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import "./Search.css"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';

import axios from '../../../Api/Axios';
import * as axiosURL from '../../../Api/AxiosUrls';
import secureLocalStorage from 'react-secure-storage';

var searchAllUrl = axiosURL.searchAllUrl;

export default function Search() {

    const searchRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const [clients, setClients] = useState();
    const [jobs, setJobs] = useState();
    const [subscription, setSubscription] = useState();
    const [tickets, setTickets] = useState();
    const [leads, setLeads] = useState();
    const [proposals, setProposals] = useState();
    const [sales, setSales] = useState();

    const [clientsF, setClientsF] = useState();
    const [jobsF, setJobsF] = useState();
    const [subscriptionF, setSubscriptionF] = useState();
    const [ticketsF, setTicketsF] = useState();
    const [leadsF, setLeadsF] = useState();
    const [proposalsF, setProposalsF] = useState();
    const [salesF, setSalesF] = useState();

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        // Event listener callback function
        const handleDocumentClick = (event) => {
          // Check if the click occurred outside the notification bar
          if (searchRef.current && !searchRef.current.contains(event.target)) {
            // Close the notification bar if it's open
            setSearchOpen(false);
          }
        };
    
        // Add event listener when component mounts
        document.addEventListener('click', handleDocumentClick);
    
        // Clean up the event listener when component unmounts
        return () => {
          document.removeEventListener('click', handleDocumentClick);
        };
      }, []);

      const getData = async ()=>{
        setLoading(true)
        try {

            const token = secureLocalStorage.getItem('token') 
            const response = await axios.get(searchAllUrl,
                {
                    headers:{ 
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token
                    }
                }
            );
            if(response.status === 200){
                setClients(response.data.clients)
                setJobs(response.data.jobs)
                setSubscription(response.data.subscription)
                setTickets(response.data.tickets)
                setLeads(response.data.leads)
                setProposals(response.data.proposals)
                setSales(response.data.sales)
                setLoading(false)
            }
        } catch (err) {
            console.log(err)
        };
    }

    useEffect(()=>{
        getData()
    },[])

    function removeDuplicatesByKey(arr, key) {
        const uniqueValues = {};
        
        return arr.filter(item => {
          const value = item[key];
          
          if (!uniqueValues[value]) {
            uniqueValues[value] = true;
            return true;
          }
          
          return false;
        });
      }

      function removeDuplicatesByKey2(arr, key) {
        const uniqueValues = new Set();
        return arr.filter(item => {
          const value = JSON.stringify(item[key]);
          if (!uniqueValues.has(value)) {
            uniqueValues.add(value);
            return true;
          }
          return false;
        });
      }
      
      

    const filter = (e)=>{

        var Clients = clients ;
        var Jobs = jobs ;
        var Subscription = subscription ;
        var Tickets = tickets ;
        var Leads = leads ;
        var Proposals = proposals ;
        var Sales = sales ;

        if(sales){
            Clients = removeDuplicatesByKey(Clients, 'company_name');
            Jobs = removeDuplicatesByKey2(Jobs, 'client_id');
            Subscription = removeDuplicatesByKey2(Subscription, 'client_id');
            Tickets = removeDuplicatesByKey2(Tickets, 'client_id');
            Leads = removeDuplicatesByKey(Leads, 'companyName');
            Proposals = removeDuplicatesByKey(Proposals, 'clientName');
            Sales = removeDuplicatesByKey2(Sales, 'client_id');
        }



        if(searchValue && searchValue !== ""){
            // Clients
            Clients = Clients.filter( item => (item.client_name && item.client_name.toLowerCase().includes(searchValue.toLowerCase())) || (item.company_name && item.company_name.toLowerCase().includes(searchValue.toLowerCase())) );
            // jobs
            Jobs = Jobs.filter(item => (item.client_id && item.client_id.client_name.toLowerCase().includes(searchValue.toLowerCase())) || (item.client_id && item.client_id.company_name.toLowerCase().includes(searchValue.toLowerCase())))
            // Subscription
            Subscription = Subscription.filter(item => (item.client_id && item.client_id.client_name.toLowerCase().includes(searchValue.toLowerCase())) || (item.client_id && item.client_id.company_name.toLowerCase().includes(searchValue.toLowerCase())))
            // Tickets
            Tickets = Tickets.filter(item => (item.client_id && item.client_id.client_name.toLowerCase().includes(searchValue.toLowerCase())) || (item.client_id && item.client_id.company_name.toLowerCase().includes(searchValue.toLowerCase())))
            // Leads
            Leads = Leads.filter(item =>  (item.clientName && item.clientName.toLowerCase().includes(searchValue.toLowerCase())) ||  (item.companyName && item.companyName.toLowerCase().includes(searchValue.toLowerCase())) )
            // Proposals
            Proposals = Proposals.filter(item => item.clientName && item.clientName.toLowerCase().includes(searchValue.toLowerCase()) )
            // Sales
            Sales = Sales.filter(item => (item.client_id && item.client_id.client_name.toLowerCase().includes(searchValue.toLowerCase())) || (item.client_id && item.client_id.company_name.toLowerCase().includes(searchValue.toLowerCase())) )
        }

        setClientsF(Clients);
        setJobsF(Jobs);
        setSubscriptionF(Subscription);
        setTicketsF(Tickets);
        setLeadsF(Leads);
        setProposalsF(Proposals);
        setSalesF(Sales);



    }

    useEffect(()=>{ 
        filter();
    }, [sales, searchValue])
    

  return (
    <>
        {!loading ? 
        <div style={{cursor: 'pointer'}} className='mx-1' ref={searchRef} onClick={()=>{ setSearchOpen(!searchOpen)}}>
            <svg width="26px" height="26px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" stroke-width="1.08" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        : "Loading"
         }

        {searchOpen && 
            <div  className={`dropDownBox ${searchOpen ? 'open' : null}`}>
                <input className='mt-2 form-control' placeholder='Search' value={searchValue} onClick={(e)=>{e.stopPropagation();}} onChange={ (e)=>{ e.stopPropagation(); setSearchValue(e.target.value); } }/>
                
                <hr style={{margin: '10px 0px 0px 0px'}} />

                {
                clientsF.length === 0 &&
                jobsF.length === 0 &&
                subscriptionF.length === 0 &&
                ticketsF.length === 0 &&
                leadsF.length === 0 &&
                proposalsF.length === 0 &&
                salesF.length === 0 ? (
                    <p className="text-center my-3">No Item Found</p>
                ) : (
                <>
                

                {clientsF && clientsF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Clients</div>
                    <div>
                        {clientsF && clientsF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/clients?companyName=${item.company_name}`} className='link'>
                                        {item.client_name} - {item.company_name}
                                    </Link>
                                </div>
                            )
                        })}
                    
                    </div>
                </>
                }


                {jobsF && jobsF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Jobs</div>
                    <div>
                        {jobsF && jobsF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/clients/job-planning?companyName=${item.client_id.company_name}`} className='link'>
                                    {item.job_name} - {item.client_id.client_name} - {item.client_id.company_name}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>
                }

                {subscriptionF && subscriptionF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Subscription</div>
                    <div>
                        {subscriptionF && subscriptionF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/subscription?companyName=${item.client_id.company_name}`} className='link'>
                                    {item.job_name} - {item.client_id.client_name} - {item.client_id.company_name}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>
                }

                {ticketsF && ticketsF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Tickets</div>
                    <div>
                        {ticketsF && ticketsF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    {item.client_id &&
                                        <Link to={`/tickets?company_name=${item.client_id.company_name}`} className='link'>
                                        {item.job_name} - {item.client_id.client_name} - {item.client_id.company_name}
                                        </Link>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </>
                }

                {leadsF && leadsF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Leads</div>
                    <div>
                        {leadsF && leadsF.map(item => {
                            return(
                                <div  key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/leads?companyName=${item.companyName}`} className='link'>
                                    {item.clientName} - {item.companyName}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>
                }

                {proposalsF && proposalsF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Proposals</div>
                    <div>
                        {proposalsF && proposalsF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/proposals?clientName=${item.clientName}`} className='link'>
                                    {item.subject} - {item.clientName}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>
                }

                {salesF && salesF.length > 0 && 
                <>
                    <div className='dropDownBoxHeading'>Sales</div>
                    <div>
                        {salesF && salesF.map(item => {
                            return(
                                <div key={item.id} className='dropDownBoxItem'>
                                    <Link to={`/sales?companyName=${item.client_id.company_name}`} className='link'>
                                    {item.client_id.client_name} - {item.client_id.company_name}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>
                }
                </>
                )
                }
                
            </div>
        }



    </>
  )
}

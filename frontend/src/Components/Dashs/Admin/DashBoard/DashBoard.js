import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { useNavigate } from 'react-router-dom';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import { Store } from 'react-notifications-component';
import Loader from '../../../Common/Loader/Loader';

var getDashboardDataUrl = axiosURL.getDashboardDataUrl;

export default function Dashboard() {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const navigate = useNavigate();

  const [reRender, setReRender] = useState(false)
  const [loader, setLoader] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dashboardData, setDashboardData] = useState();
  const [chartsData, setChartsData] = useState({
    pieData1: [],
    pieOptions1: {},
    pieData2: [],
    pieOptions2: {},
    pieData: [],
    pieOptions: {}
  });

  const [showHideCharts, setShowHideCharts] = useState({
    clientsCounterGraph: true,
    departmentsCounterGraph: true,
    clientsFeeGraph: true,
    departmentsOverDueGraph: true,
    departmentsDueGraph: true,
    partnersGraph: true,
    sourcesGraph: true,
    constructionOpenProjectDays: false,
    constructionCloseProjectDays: false,
    constructionOpenProjectBudget: false,
    constructionCloseProjectBudget: false,
    SalesGraph: true,
  })

  useEffect(()=>{
    if(dashboardData){
      setSelectedDate(new Date(`01/01/${dashboardData.clientsCount.selectedYear}`))
    }
  }, [dashboardData])
  
const options = {
  responsive: true,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const clickedOn = elements[0].element.$context['dataset'].names[elementIndex]
      const year = elements[0].element.$context['dataset'].label

      const dataToSend = {
        monthName : clickedOn,
        Year: year
      }
      navigate('/clients', { state: dataToSend });
    }
  },
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Clients Counter Graph',
    },
  },
};



const data = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: ` ${dashboardData && dashboardData.clientsCount.PreviousYear}`,
      data: [
        dashboardData ? dashboardData.clientsCount.janP: 0, dashboardData ? dashboardData.clientsCount.febP: 0, dashboardData ? dashboardData.clientsCount.marchP: 0, dashboardData ? dashboardData.clientsCount.aprP: 0, dashboardData ? dashboardData.clientsCount.mayP: 0, dashboardData ? dashboardData.clientsCount.juneP: 0, dashboardData ? dashboardData.clientsCount.julyP: 0, dashboardData ? dashboardData.clientsCount.augP: 0, dashboardData ? dashboardData.clientsCount.septP: 0, dashboardData ? dashboardData.clientsCount.octP: 0, dashboardData ? dashboardData.clientsCount.novP: 0, dashboardData ? dashboardData.clientsCount.decP: 0
      ],
      backgroundColor: '#b5b5b9',
      names: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    },
    {
      label: ` ${dashboardData && dashboardData.clientsCount.selectedYear}`,
      data: [
        dashboardData ? dashboardData.clientsCount.jan: 0, dashboardData ? dashboardData.clientsCount.feb: 0, dashboardData ? dashboardData.clientsCount.march: 0, dashboardData ? dashboardData.clientsCount.apr: 0, dashboardData ? dashboardData.clientsCount.may: 0, dashboardData ? dashboardData.clientsCount.june: 0, dashboardData ? dashboardData.clientsCount.july: 0, dashboardData ? dashboardData.clientsCount.aug: 0, dashboardData ? dashboardData.clientsCount.sept: 0, dashboardData ? dashboardData.clientsCount.oct: 0, dashboardData ? dashboardData.clientsCount.nov: 0, dashboardData ? dashboardData.clientsCount.dec: 0
      ],
      backgroundColor: '#67c160',
      names: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    },
    
  ],
};


  
const options2 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments Counter Graph',
    },
  },
};


const data2 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.DepartmentFee.accounts: 0, dashboardData ? dashboardData.DepartmentFee.address: 0, dashboardData ? dashboardData.DepartmentFee.billing: 0, dashboardData ? dashboardData.DepartmentFee.bookKeeping: 0, dashboardData ? dashboardData.DepartmentFee.companySec: 0, dashboardData ? dashboardData.DepartmentFee.payRoll: 0, dashboardData ? dashboardData.DepartmentFee.personalTax: 0, dashboardData ? dashboardData.DepartmentFee.vatReturn: 0
      ],
      backgroundColor: '#1ab394',
    },
    
  ],
};


  
const options3 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "white",
      formatter: Math.round,
      rotation: -90
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Clients Fee Graph',
    },
  }
};


const data3 = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: ` ${dashboardData && dashboardData.clientsCount.PreviousYear}`,
      data: [
        dashboardData ? dashboardData.ClientFee.janP: 0, dashboardData ? dashboardData.ClientFee.febP: 0, dashboardData ? dashboardData.ClientFee.marchP: 0, dashboardData ? dashboardData.ClientFee.aprP: 0, dashboardData ? dashboardData.ClientFee.mayP: 0, dashboardData ? dashboardData.ClientFee.juneP: 0, dashboardData ? dashboardData.ClientFee.julyP: 0, dashboardData ? dashboardData.ClientFee.augP: 0, dashboardData ? dashboardData.ClientFee.septP: 0, dashboardData ? dashboardData.ClientFee.octP: 0, dashboardData ? dashboardData.ClientFee.novP: 0, dashboardData ? dashboardData.ClientFee.decP: 0
      ],
      backgroundColor: '#b5b5b9',
    },
    {
      label: ` ${dashboardData && dashboardData.clientsCount.selectedYear}`,
      data: [
        dashboardData ? dashboardData.ClientFee.jan: 0, dashboardData ? dashboardData.ClientFee.feb: 0, dashboardData ? dashboardData.ClientFee.march: 0, dashboardData ? dashboardData.ClientFee.apr: 0, dashboardData ? dashboardData.ClientFee.may: 0, dashboardData ? dashboardData.ClientFee.june: 0, dashboardData ? dashboardData.ClientFee.july: 0, dashboardData ? dashboardData.ClientFee.aug: 0, dashboardData ? dashboardData.ClientFee.sept: 0, dashboardData ? dashboardData.ClientFee.oct: 0, dashboardData ? dashboardData.ClientFee.nov: 0, dashboardData ? dashboardData.ClientFee.dec: 0
      ],
      backgroundColor: '#5873d8',
    },
    
  ],
};

const options4 = {
  responsive: true,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const clickedOn = elements[0].element.$context['dataset'].names[elementIndex]

      const dataToSend = {
        departmentName : clickedOn,
        filterType: "Overdue"
      }
      navigate('/clients/job-planning', { state: dataToSend });
    }
  },
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments OverDue Jobs',
    },
  },
  barThickness: 20, // Adjust the width of the bars
  categorySpacing: 100, // Adjust the space between bars (default is 1)
};


const data4 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.JobsOverdue.accounts.length: 0, dashboardData ? dashboardData.JobsOverdue.address.length: 0, dashboardData ? dashboardData.JobsOverdue.billing.length: 0, dashboardData ? dashboardData.JobsOverdue.bookKeeping.length: 0, dashboardData ? dashboardData.JobsOverdue.companySec.length: 0, dashboardData ? dashboardData.JobsOverdue.payRoll.length: 0, dashboardData ? dashboardData.JobsOverdue.personalTax.length: 0, dashboardData ? dashboardData.JobsOverdue.vatReturn.length: 0
      ],
      backgroundColor: '#be7462',
      names: ['Accounts', 'Address', 'Billing', 'BookKeeping', 'Company Sec', 'PayRoll', 'Personal Tax', 'Vat Return'], // Array of Names
    },
    
  ],
};

const options5 = {
  responsive: true,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const clickedOn = elements[0].element.$context['dataset'].names[elementIndex]

      const dataToSend = {
        departmentName : clickedOn,
        filterType: "Due"
      }
      
      navigate('/clients/job-planning', { state: dataToSend });
    }
  },
  barThickness: 15, 
  plugins: {
    datalabels: {
      display: true,
      color: "white",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments Due Jobs',
    },
  },
  barThickness: 20, // Adjust the width of the bars
  categorySpacing: 100, // Adjust the space between bars (default is 1)
};


const data5 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.Jobsdue.accounts.length: 0, dashboardData ? dashboardData.Jobsdue.address.length: 0, dashboardData ? dashboardData.Jobsdue.billing.length: 0, dashboardData ? dashboardData.Jobsdue.bookKeeping.length: 0, dashboardData ? dashboardData.Jobsdue.companySec.length: 0, dashboardData ? dashboardData.Jobsdue.payRoll.length: 0, dashboardData ? dashboardData.Jobsdue.personalTax.length: 0, dashboardData ? dashboardData.Jobsdue.vatReturn.length: 0
      ],
      backgroundColor: '#516aeb',
      names: ['Accounts', 'Address', 'Billing', 'BookKeeping', 'Company Sec', 'PayRoll', 'Personal Tax', 'Vat Return'], // Array of Names
    },
    
  ],
};



const options6 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Construction Open Projects Days',
    },
  },
};



const data6 = {
  labels: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.projName),
  datasets: [
    {
      label: `Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.ConstructionTotalDays),
      backgroundColor: '#b5b5b9',
    },
    {
      label: `Actual Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.ConstructionTotalActualDays),
      backgroundColor: '#67c160',
    },
    
  ],
};


const options7 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Construction Close Projects Days',
    },
  },
};



const data7 = {
  labels: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.projName),
  datasets: [
    {
      label: `Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.ConstructionTotalDays),
      backgroundColor: '#b5b5b9',
    },
    {
      label: `Actual Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.ConstructionTotalActualDays),
      backgroundColor: '#67c160',
    },
    
  ],
};


const options8 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Construction Open Projects Budget',
    },
  },
};



const data8 = {
  labels: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.projName),
  datasets: [
    {
      label: `Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.ConstructionTotalBudget),
      backgroundColor: '#b5b5b9',
    },
    {
      label: `Actual Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionOpenProjectsFinalArray.map(data => data.ConstructionTotalActualBudget),
      backgroundColor: '#67c160',
    },
    
  ],
};


const options9 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Construction Close Projects Budget',
    },
  },
};



const data9 = {
  labels: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.projName),
  datasets: [
    {
      label: `Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.ConstructionTotalBudget),
      backgroundColor: '#b5b5b9',
    },
    {
      label: `Actual Days`,
      data: dashboardData && dashboardData.ConstructionGraph.ConstructionCloseProjectsFinalArray.map(data => data.ConstructionTotalActualBudget),
      backgroundColor: '#67c160',
    },
    
  ],
};


const options10 = {
  responsive: true,
  plugins: {
    datalabels: {
      display: true,
      color: "black",
      formatter: Math.round,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Subscription Fee Graph',
    },
  },
};



const data10 = {
  labels: ['Weekly', 'Monthly', 'Quarterly', 'Anually'],
  datasets: [
    {
      label: `Fee`,
      data: [`${dashboardData && dashboardData.SubscriptionGraph.Weekly[0] && dashboardData.SubscriptionGraph.Weekly[0].totalFee}`, `${dashboardData && dashboardData.SubscriptionGraph.Monthly[0] && dashboardData.SubscriptionGraph.Monthly[0].totalFee}`, `${dashboardData && dashboardData.SubscriptionGraph.Quarterly[0] && dashboardData.SubscriptionGraph.Quarterly[0].totalFee}`, `${dashboardData && dashboardData.SubscriptionGraph.Anually[0] && dashboardData.SubscriptionGraph.Anually[0].totalFee}`],
      backgroundColor: '#b5b5b9',
    },
    
  ],
};



  useEffect(()=>{
    if(dashboardData) {
      setChartsData({
     
        pieData1: [
          ["Partner", "Contributed"],
          ["Affotax", dashboardData && dashboardData.PartnersGraph.Affotax],
          ["OTL", dashboardData && dashboardData.PartnersGraph.OTL],
          ["Outsource", dashboardData && dashboardData.PartnersGraph.Outsource]
        ],
        
        pieOptions1: {
          title: "Partners Graph",
          legend: { 
            position: 'bottom', 
            alignment: 'center' ,
            orientation: 'vertical',
          }
        },
      
        pieData2: [
          ["Sources", "Contributed"],
          ["FIV", dashboardData && dashboardData.SourcesGraph.FIV],
          ["PPH", dashboardData && dashboardData.SourcesGraph.PPH],
          ["Partner", dashboardData && dashboardData.SourcesGraph.Partner],
          ["Referal", dashboardData && dashboardData.SourcesGraph.Referal],
          ["UPW", dashboardData && dashboardData.SourcesGraph.UPW],
          ["Website", dashboardData && dashboardData.SourcesGraph.Website],
        ],
        
        pieOptions2: {
          title: "Sources Graph",
          legend: { 
            position: 'bottom', 
            alignment: 'center' ,
            orientation: 'vertical',
          }
        },

        pieData: [
          ["Sales", "Contributed"],
          ["Bookkeeping", dashboardData && dashboardData.SalesGraph.Bookkeeping],
          ["Payroll", dashboardData && dashboardData.SalesGraph.Payroll],
          ["Vat Return", dashboardData && dashboardData.SalesGraph["Vat Return"]],
          ["Accounts", dashboardData && dashboardData.SalesGraph.Accounts],
          ["Personal Tax", dashboardData && dashboardData.SalesGraph["Personal Tax"]],
          ["Company Sec", dashboardData && dashboardData.SalesGraph["Company Sec"]],
          ["Address", dashboardData && dashboardData.SalesGraph.Address],
        ],
        
        pieOptions: {
          title: "Sales Graph",
          legend: { 
            position: 'bottom', 
            alignment: 'center' ,
            orientation: 'vertical',
          }
        },
      })
    }
  }, [dashboardData])


  const getData = async ()=>{
    try {
      setLoader(true)
        const response = await axios.post(getDashboardDataUrl,
            {
              selectedDate: selectedDate
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
        );
        if(response.status === 200){
          setDashboardData(response.data)
          setLoader(false)
        } 
        
    
        } catch (err) {
        Store.addNotification({
            title: 'Error',
            message: "Please Try Again",
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
    getData();
    
}, [reRender]);

function handleMenuClick(e) {
  // Prevent the default behavior of the click event
  e.preventDefault();

  // Stop the click event from propagating to the dropdown menu
  e.stopPropagation();
}


const handleShowHideCharts = (e, graphName)=>{
  handleMenuClick(e)
  const value = !showHideCharts[graphName]

  setShowHideCharts(prev => ({
    ...prev,
    [graphName]: value
  }))

}


if(!loader)
{

  return (
    <>
        <div style={{
        border: 'none'
        }}
        className="card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>
  
          <div style={{alignItems: 'center',}} className='d-flex'>
  
            <div >
              <h4 style={{padding: '10px 16px',}}>
                  Dashboard
              </h4>
            </div>
  
            <div className='table-show-hide mx-2'>
              <div className="dropdown">
                <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
                <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                  <div className="row">
                    <div className="col-6">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "clientsCounterGraph")}} className={`dropdown-item ${!showHideCharts.clientsCounterGraph? "active" : ""}`}  >Clients Counter Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "departmentsCounterGraph")}} className={`dropdown-item ${!showHideCharts.departmentsCounterGraph? "active" : ""}`} >Department Count Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "clientsFeeGraph")}} className={`dropdown-item ${!showHideCharts.clientsFeeGraph? "active" : ""}`} >Clients Fee</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "departmentsOverDueGraph")}} className={`dropdown-item ${!showHideCharts.departmentsOverDueGraph? "active" : ""}`} >Departments Overdue Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "departmentsDueGraph")}} className={`dropdown-item ${!showHideCharts.departmentsDueGraph? "active" : ""}`}  >Departments Due Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "SalesGraph")}} className={`dropdown-item ${!showHideCharts.SalesGraph? "active" : ""}`}  >Sales Graph</button></li>
                        </ul>
                    </div>
                    <div className="col-6">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "partnersGraph")}} className={`dropdown-item ${!showHideCharts.partnersGraph? "active" : ""}`}>Partners Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "sourcesGraph")}} className={`dropdown-item ${!showHideCharts.sourcesGraph? "active" : ""}`} >Sources Graph</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "constructionOpenProjectDays")}} className={`dropdown-item ${!showHideCharts.constructionOpenProjectDays? "active" : ""}`} >Construction Open Projects Days</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "constructionCloseProjectDays")}} className={`dropdown-item ${!showHideCharts.constructionCloseProjectDays? "active" : ""}`} >Construction Close Projects Days</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "constructionOpenProjectBudget")}} className={`dropdown-item ${!showHideCharts.constructionOpenProjectBudget? "active" : ""}`} >Construction Open Projects Budget</button></li>
                        <li><button onClick={(e)=>{handleShowHideCharts(e, "constructionCloseProjectBudget")}} className={`dropdown-item ${!showHideCharts.constructionCloseProjectBudget? "active" : ""}`} >Construction Close Projects Budget</button></li>
                        </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
  
          </div>
  
          <div className='mx-4'>
          <DatePicker
          style={{textAlign: 'center'}}
          className='form-control text-center'
            selected={selectedDate}
            onChange={(date) => {
                setSelectedDate(date);
                setReRender(prev => !prev)
            }}
            showYearPicker
            dateFormat="yyyy"
            todayButton="Current Year"
            yearItemNumber={8}
        />
          </div>
          
  
        </div>
  
  
  
        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>
  
    </div>
  
  
    <div style={{overflow: 'hidden',}} >
        <div className='row mt-4'>

          {showHideCharts.clientsCounterGraph && 
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options} plugins={[ChartDataLabels]} data={data} />
                </div>
            </div>
          }
  
            {showHideCharts.departmentsCounterGraph && 
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options2} plugins={[ChartDataLabels]} data={data2} />
                </div>
            </div>
            }
            
            {showHideCharts.clientsFeeGraph && 
              <div className='col-4'>
                  <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options3} plugins={[ChartDataLabels]} data={data3} />
                  </div>
              </div>
            }
            
            {showHideCharts.departmentsOverDueGraph && 
              <div className='col-4 mt-4'>
                  <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options4} plugins={[ChartDataLabels]} data={data4} />
                  </div>
              </div>
            }
            
            {showHideCharts.departmentsDueGraph && 
              <div className='col-4 mt-4'>
                  <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white' }}>
                    <Bar options={options5} plugins={[ChartDataLabels]} data={data5} />
                  </div>
              </div>
            }
            
            {showHideCharts.departmentsDueGraph && 
              <div className='col-4 mt-4'>
                  <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white' }}>
                    <Bar options={options10} plugins={[ChartDataLabels]} data={data10} />
                  </div>
              </div>
            }
            
            {showHideCharts.partnersGraph && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                      <Chart
                      chartType="PieChart"
                      width="100%"
                      height="400px"
                      data={chartsData.pieData1}
                      options={chartsData.pieOptions1}
                      />
                  </div>
              </div>
            }
            
            {showHideCharts.sourcesGraph && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                      <Chart
                      chartType="PieChart"
                      width="100%"
                      height="400px"
                      data={chartsData.pieData2}
                      options={chartsData.pieOptions2}
                      />
                  </div>
              </div> 
            }
            
            {showHideCharts.constructionOpenProjectDays && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options6} plugins={[ChartDataLabels]} data={data6} />
                  </div>
              </div> 
            }
            
            {showHideCharts.constructionCloseProjectDays && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options7} plugins={[ChartDataLabels]} data={data7} />
                  </div>
              </div> 
            }
            
            {showHideCharts.constructionOpenProjectBudget && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options8} plugins={[ChartDataLabels]} data={data8} />
                  </div>
              </div> 
            }
            
            {showHideCharts.constructionCloseProjectBudget && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Bar options={options9} plugins={[ChartDataLabels]} data={data9} />
                  </div>
              </div> 
            }

            {showHideCharts.SalesGraph && 
              <div className='col-6 mt-4'>
                  <div style={{padding: '10px', backgroundColor: 'white'}}>
                      <Chart
                      chartType="PieChart"
                      width="100%"
                      height="400px"
                      data={chartsData.pieData}
                      options={chartsData.pieOptions}
                      />
                  </div>
              </div> 
            }

        </div>
    </div>
  
    </>
  );
} else {
  return(
    <>
    <Loader />
    </>
  )
}

}

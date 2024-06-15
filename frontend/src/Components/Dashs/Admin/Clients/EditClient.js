import { useState, useEffect, useRef } from 'react'
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';

import Loader from '../../../Common/Loader/Loader';

import { Store } from 'react-notifications-component';

import { useNavigate, useParams } from "react-router-dom";

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';

var preDataUrl = axiosURL.updateClientPreData;
var UpdateFormUrl = axiosURL.updateClient;


export default function EditClient() {

    const { id } = useParams();


    const navigate = useNavigate();

    const [loader, setLoader] = useState(false)

    const [validated, setValidated] = useState(false);

    // Client Form Data
    const [clientFormData, setClientFormData] = useState({
        client_name: "",
        company_name: "",
        partner: "",
        source: "",
        email: "",
        client_type: "",
        total_hours: "",
        hourly_rate: "10",
        book_start_date: "",
        phone: "",
        auth_code: "",
        utr: "",
        tr_login: "",
        vat_login: "",
        paye_login: "",
        ct_login: "",
        company_number: "",
        address: "",
        country: "",
    })  

    const [department_li, setDepartment_li] = useState([]);

    // Client Departments
    const [clientBookKeepingFormData, setClientBookKeepingFormData] = useState({
        job_name: "Bookkeeping",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientPayRollFormData, setClientPayRollFormData] = useState({
        job_name: "Payroll",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientAccountsFormData, setClientAccountsFormData] = useState({
        job_name: "Accounts",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientPersonalTaxFormData, setClientPersonalTaxFormData] = useState({
        job_name: "Personal Tax",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientCompanySecFormData, setClientCompanySecFormData] = useState({
        job_name: "Company Sec",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientVatReturnFormData, setClientVatReturnFormData] = useState({
        job_name: "Vat Return",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientAddressFormData, setClientAddressFormData] = useState({
        job_name: "Address",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: ""
        
    })
    const [clientBillingFormData, setClientBillingFormData] = useState({
        job_name: "Billing",
        year_end: "",
        job_deadline: "",
        work_deadline: "",
        hours: "",
        fee: "",
        manager_id: "",
        job_holder_id: "",
        subscription: "",
        
    })

    // check Fields
    const [bookKeeptingCheck, setBookKeepingCheck] = useState(false)
    const [payrollCheck, setPayrollCheck] = useState(false)
    const [vatReturnCheck, setVatReturnCheck] = useState(false)
    const [accountsCheck, setAccountsCheck] = useState(false)
    const [personalTaxCheck, setPersonalTaxCheck] = useState(false)
    const [companySecCheck, setCompanySecCheck] = useState(false)
    const [addressCheck, setAddressCheck] = useState(false)
    const [billingCheck, setBillingCheck] = useState(false)

    const [preData, setPreData] = useState()

    
    

    const getPreData = async () => {
        setLoader(true)
        try {
            const response = await axios.get(`${preDataUrl}${id}`,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
                );
          if(response.status === 200)
          {  
            setPreData(response.data);
            setClientFormData({
                client_name: response.data.client.client_name,
                company_name: response.data.client.company_name,
                partner: response.data.client.partner,
                source: response.data.client.source,
                email: response.data.client.email,
                client_type: response.data.client.client_type,
                // total_hours: response.data.client.total_hours,
                hourly_rate: response.data.client.hourly_rate,
                book_start_date: response.data.client.book_start_date,
                phone: response.data.client.phone,
                auth_code: response.data.client.auth_code,
                utr: response.data.client.utr,
                tr_login: response.data.client.tr_login,
                vat_login: response.data.client.vat_login,
                paye_login: response.data.client.paye_login,
                ct_login: response.data.client.ct_login,
                company_number: response.data.client.company_number,
                address: response.data.client.address,
                country: response.data.client.country,
            })

            const departmentsss = response.data.departments

            var totalHours = 0
            for(var i=0; i < departmentsss.length; i++){
                const hours = departmentsss[i].hours !== '' ? +departmentsss[i].hours : 0
                totalHours = (+totalHours + +hours);
                if(departmentsss[i].job_name === "Bookkeeping"){
                    setBookKeepingCheck(true); 
                    setClientBookKeepingFormData({
                        job_name: "Bookkeeping",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })

                }
                if(departmentsss[i].job_name === "Payroll"){
                    setPayrollCheck(true)
                    setClientPayRollFormData({
                        job_name: "Payroll",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Vat Return"){
                    setVatReturnCheck(true)
                    setClientVatReturnFormData({
                        job_name: "Vat Return",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Accounts"){
                    setAccountsCheck(true)
                    setClientAccountsFormData({
                        job_name: "Accounts",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Personal Tax"){
                    setPersonalTaxCheck(true)
                    setClientPersonalTaxFormData({
                        job_name: "Personal Tax",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Company Sec"){
                    setCompanySecCheck(true)
                    setClientCompanySecFormData({
                        job_name: "Company Sec",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Address"){
                    setAddressCheck(true)
                    setClientAddressFormData({
                        job_name: "Address",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        fee: departmentsss[i].fee,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        _id: departmentsss[i]._id,
                    })
                }
                if(departmentsss[i].job_name === "Billing"){
                    setBillingCheck(true)
                    setClientBillingFormData({
                        job_name: "Billing",
                        year_end: departmentsss[i].year_end,
                        job_deadline: departmentsss[i].job_deadline,
                        work_deadline: departmentsss[i].work_deadline,
                        hours: departmentsss[i].hours,
                        subscription: departmentsss[i].subscription,
                        manager_id: departmentsss[i].manager_id,
                        job_holder_id: departmentsss[i].job_holder_id,
                        fee: departmentsss[i].fee,
                        _id: departmentsss[i]._id,
                    })
                }

            }
            setClientFormData(prevState =>({
                ...prevState,
                total_hours: totalHours
            }))


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
        getPreData()
    }, []);


    const myArrayRef = useRef(department_li);

  

  
    const handleClientFormChange = (e, namee)=>{
        setValidated(false);
        const { name, value } = e.target;
        
      switch (namee){
          case "client":
              setClientFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "book_keeping":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientBookKeepingFormData.hours) + +value
                  }))
              }
              setClientBookKeepingFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "pay_roll":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientPayRollFormData.hours) + +value
                  }))
              }
              setClientPayRollFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "vat_return":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientVatReturnFormData.hours) + +value
                  }))
              }
              setClientVatReturnFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "accounts":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientAccountsFormData.hours) + +value
                  }))
              }
              setClientAccountsFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "personal_tax":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientPersonalTaxFormData.hours) + +value
                  }))
              }
              setClientPersonalTaxFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "company_sec":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientCompanySecFormData.hours) + +value
                  }))
              }
              setClientCompanySecFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "address":
              if(name === "hours"){
                  setClientFormData(prevState =>({
                      ...prevState,
                      total_hours: (+clientFormData.total_hours - +clientAddressFormData.hours) + +value
                  }))
              }
              setClientAddressFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          case "billing":
              setClientBillingFormData(prevState => ({
                  ...prevState,
                  [name]: value
              }));
          break;
          default:
          break;
      }
  
  
      
    }


  const handleCheckChange = (event) => {
    setValidated(false);
    switch (event.target.id) {
      case "bookKeeptingCheck":
        setBookKeepingCheck(event.target.checked);
        break;
      case "payrollCheck":
        setPayrollCheck(event.target.checked);
        break;
      case "vatReturnCheck":
        setVatReturnCheck(event.target.checked);
        break;
      case "accountsCheck":
        setAccountsCheck(event.target.checked);
        break;
      case "personalTaxCheck":
        setPersonalTaxCheck(event.target.checked);
        break;
      case "companySecCheck":
        setCompanySecCheck(event.target.checked);
        break;
      case "addressCheck":
        setAddressCheck(event.target.checked);
        break;
      case "billingCheck":
        setBillingCheck(event.target.checked);
        break;
      default:
        break;
    }
  }

  const hitApi = async ()=>{
    setLoader(true)
         try {
             const response = await axios.post(`${UpdateFormUrl}${id}`,
                 {
                     data:clientFormData ,
                     departments: department_li
                 },
                 {
                     headers:{ 'Content-Type': 'application/json' }
                 }
             );
           if(response.status === 200 && response.data.message === "Data successfully Updated")
           {  
             Store.addNotification({
                 title: 'Success',
                 message: "Data added Successfully",
                 type: "success",
                 insert: "top",
                 container: "top-center",
                 animationIn: ["animate__animated", "animate__fadeIn"],
                 animationOut: ["animate__animated", "animate__fadeOut"],
                 dismiss: {
                   duration: 5000,
                   onScreen: true
                 }
               });
         const formData = clientFormData;
             setLoader(false)
             navigate("/clients");
          }

           if(response.status === 200){
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    if (!bookKeeptingCheck && !payrollCheck && !vatReturnCheck && !accountsCheck && !personalTaxCheck && !companySecCheck && !addressCheck && !billingCheck) {
        setValidated(true);
        return;
    }
    
    if(bookKeeptingCheck)
    {
        await myArrayRef.current.push(clientBookKeepingFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
    }
    if(payrollCheck)
    {
        myArrayRef.current.push(clientPayRollFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
        
    }
    if(vatReturnCheck)
    {
        await myArrayRef.current.push(clientVatReturnFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
        
    }
    if(accountsCheck)
    {
        await myArrayRef.current.push(clientAccountsFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
        
    }
    if(personalTaxCheck)
    {
        await myArrayRef.current.push(clientPersonalTaxFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
        
    }
    if(companySecCheck)
    {
        await myArrayRef.current.push(clientCompanySecFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
       
    }
    if(addressCheck)
    {
        await myArrayRef.current.push(clientAddressFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
        
    }
    if(billingCheck)
    {
        await myArrayRef.current.push(clientBillingFormData);
        setDepartment_li({ myArray: myArrayRef.current === undefined || myArrayRef.current === null ? "" : myArrayRef.current });
       
        
    }

    hitApi();

  };

  



if(loader){
    return(
        <Loader />
    )
}
else{
    return (
        <>
            <div >
                <h4>
                    Edit Client
                </h4>
                <div className='mt-4'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
    
                            {/* <Form.Group as={Col} md="2" controlId="validationCustom01">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Client Id"
                                    disabled={true}
                                />
                            </Form.Group> */}
    
                            <Form.Group as={Col} md="2" controlId="validationCustomUsername">
                                <InputGroup hasValidation>
                                    <Form.Control
                                    type="text"
                                    placeholder="Client Name"
                                    required
                                    name = "client_name"
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.client_name}
                                    />
                                </InputGroup>
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom03">
                                <Form.Control 
                                type="text" 
                                placeholder="Company Name" 
                                name='company_name'
                                required 
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.company_name}
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom04">
                                <Form.Select 
                                name='partner'
                                required 
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.partner}
                                >
                                    <option value=''>Partner</option>
                                    <option value='Affotax'>Affotax</option>
                                    <option value='Outsource'>Outsource</option>
                                    <option value='OTL'>OTL</option>
                                </Form.Select>
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom05">
                                {/* <Form.Control 
                                type="text" 
                                placeholder="Source" 
                                name="source"
                                required 
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.source}
                                /> */}
    
                                <Form.Select 
                                name="source"
                                required 
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.source}
                                >
                                    <option value=''>Source</option>
                                    <option value='FIV'>FIV</option>
                                    <option value='UPW'>UPW</option>
                                    <option value='PPH'>PPH</option>
                                    <option value='Website'>Website</option>
                                    <option value='Referal'>Referal</option>
                                    <option value='Partner'>Partner</option>
                                </Form.Select>
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustomUsername">
                                <InputGroup hasValidation>
                                    <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.email}
                                    />
                                </InputGroup>
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom02">    
                                <Form.Select
                                required
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.client_type}
                                name="client_type"
                                >
                                    <option value="">Client Type</option>
                                    <option value="Limited">Limited</option>
                                    <option value="LLP">LLP</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Non UK">Non UK</option>
                                </Form.Select>
                            </Form.Group>

                        </Row>
                        
    
                        <Row className="mb-3">
    
                            
                            <Form.Group as={Col} md="2" controlId="validationCustom01">
                                <Form.Control
                                    name='total_hours'
                                    type="text"
                                    placeholder="Tot Dept. Auto sum"
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.total_hours}
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom02">
                                <Form.Control
                                    
                                    type="number"
                                    placeholder="Hourly Rate"
                                    name='hourly_rate'
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.hourly_rate}
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom03">
                                <Form.Control 
                                type="text" 
                                placeholder="Book Start Date" 
                                name='book_start_date'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.book_start_date}
                                onMouseOver={(event) => event.target.type = 'date'}
                                onMouseOut={(event) => event.target.type = 'text'}
                                 />
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom04">
                                <Form.Control 
                                type="text" 
                                placeholder="Phone" 
                                name='phone'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.phone}
                                 />
                            </Form.Group>
    
                            <Form.Group as={Col} md="2" controlId="validationCustom05">
                                <Form.Control 
                                type="text" 
                                placeholder="Auth Code" 
                                name='auth_code'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.auth_code}
                                 />
                            </Form.Group>

                            <Form.Group as={Col} md="2" controlId="validationCustom05">
                                <Form.Control 
                                type="text" 
                                placeholder="Tr Login" 
                                name='tr_login'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.tr_login}
                                 />
                            </Form.Group>
                            
                        </Row>
                        
                        <Row className="mb-3">
                            
                            <Form.Group as={Col} md="3" controlId="validationCustom01">
                                <Form.Control
                                    name='utr'
                                    type="text"
                                    placeholder="UTR"
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.utr}
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} md="3" controlId="validationCustom02">
                                <Form.Control
                                    name='vat_login'
                                    type="text"
                                    placeholder="Vat Login"
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.vat_login}
                                />
                            </Form.Group>
    
                            <Form.Group as={Col} md="3" controlId="validationCustomUsername">
                                <InputGroup hasValidation>
                                    <Form.Control
                                    type="text"
                                    placeholder="PAYE Login"
                                    name='paye_login'
                                    onChange={(e)=>handleClientFormChange(e, "client")}
                                    value = {clientFormData.paye_login}
                                    />
                                </InputGroup>
                            </Form.Group>
    
                            <Form.Group as={Col} md="3" controlId="validationCustom03">
                                <Form.Control 
                                type="text" 
                                placeholder="CT Login" 
                                name='ct_login'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.ct_login}
                                 />
                            </Form.Group>
    
                            
                            
                        </Row>
    
                        <Row className="mb-3">
    
                            <Form.Group as={Col} md="3" controlId="validationCustom04">
                                <Form.Control 
                                type="text" 
                                placeholder="Company Number" 
                                name='company_number'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.company_number}
                                 />
                            </Form.Group>
    
                            <Form.Group as={Col} md="6" controlId="validationCustom04">
                                <Form.Control 
                                type="text" 
                                placeholder="Address" 
                                name='address'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.address}
                                 />
                            </Form.Group>
                            
                            <Form.Group as={Col} md="3" controlId="validationCustom05">
                                <Form.Control 
                                type="text" 
                                placeholder="Country" 
                                name='country'
                                onChange={(e)=>handleClientFormChange(e, "client")}
                                value = {clientFormData.country}
                                 />
                            </Form.Group>
                        </Row>
    
                        {validated && (
                            <div className="invalid-feedback d-block">Please select at least one Department</div>
                        )}
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={bookKeeptingCheck}
                                onChange={handleCheckChange}
                                id="bookKeeptingCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Book Keeping"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.fee}
                                     />
                                </Form.Group>
                                
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                    <Form.Select 
                                    name='manager_id'
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.manager_id}
                                    >
                                        <option>Manager</option>
                                        {preData && preData.users.map((manager, index)=>
                                            <option key={index} value={manager._id}>{manager.name}</option>
                                        )}
                                    </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                     <Form.Select 
                                    name='job_holder_id'
                                    onChange={(e)=>handleClientFormChange(e, "book_keeping")}
                                    value = {clientBookKeepingFormData.job_holder_id}
                                    >
                                        <option>Job Holder</option>
                                        {preData && preData.users.map((manager, index)=>
                                            <option key={index} value={manager._id}>{manager.name}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={payrollCheck}
                                onChange={handleCheckChange}
                                id="payrollCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Payroll"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                    value = {clientPayRollFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                    value = {clientPayRollFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                    value = {clientPayRollFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                    value = {clientPayRollFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                    value = {clientPayRollFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='manager_id'
                                onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                value = {clientPayRollFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='job_holder_id'
                                onChange={(e)=>handleClientFormChange(e, "pay_roll")}
                                value = {clientPayRollFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
    
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={vatReturnCheck}
                                onChange={handleCheckChange}
                                id="vatReturnCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "VAT Return"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                    value = {clientVatReturnFormData.year_end}
                                    
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                    value = {clientVatReturnFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                    value = {clientVatReturnFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                    value = {clientVatReturnFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                    value = {clientVatReturnFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='manager_id'
                                onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                value = {clientVatReturnFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='job_holder_id'
                                onChange={(e)=>handleClientFormChange(e, "vat_return")}
                                value = {clientVatReturnFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={accountsCheck}
                                onChange={handleCheckChange}
                                id="accountsCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Accounts"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "accounts")}
                                    value = {clientAccountsFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "accounts")}
                                    value = {clientAccountsFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "accounts")}
                                    value = {clientAccountsFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "accounts")}
                                    value = {clientAccountsFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "accounts")}
                                    value = {clientAccountsFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='manager_id'
                                onChange={(e)=>handleClientFormChange(e, "accounts")}
                                value = {clientAccountsFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='job_holder_id'
                               onChange={(e)=>handleClientFormChange(e, "accounts")}
                               value = {clientAccountsFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={personalTaxCheck}
                                onChange={handleCheckChange}
                                id="personalTaxCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Personal Tax"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                    value = {clientPersonalTaxFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                    value = {clientPersonalTaxFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                    value = {clientPersonalTaxFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                    value = {clientPersonalTaxFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                    value = {clientPersonalTaxFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='manager_id'
                                onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                                value = {clientPersonalTaxFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='job_holder_id'
                               onChange={(e)=>handleClientFormChange(e, "personal_tax")}
                               value = {clientPersonalTaxFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={companySecCheck}
                                onChange={handleCheckChange}
                                id="companySecCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">                           
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Company Sec"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                    value = {clientCompanySecFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                    value = {clientCompanySecFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                    value = {clientCompanySecFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                    value = {clientCompanySecFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                    value = {clientCompanySecFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='manager_id'
                               onChange={(e)=>handleClientFormChange(e, "company_sec")}
                               value = {clientCompanySecFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='job_holder_id'
                                onChange={(e)=>handleClientFormChange(e, "company_sec")}
                                value = {clientCompanySecFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
    
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={addressCheck}
                                onChange={handleCheckChange}
                                id="addressCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Address"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "address")}
                                    value = {clientAddressFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "address")}
                                    value = {clientAddressFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "address")}
                                    value = {clientAddressFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "address")}
                                    value = {clientAddressFormData.hours}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "address")}
                                    value = {clientAddressFormData.fee}
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='manager_id'
                               onChange={(e)=>handleClientFormChange(e, "address")}
                               value = {clientAddressFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='job_holder_id'
                                onChange={(e)=>handleClientFormChange(e, "address")}
                                value = {clientAddressFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
    
                            </Row>
                        </div>
    
                        <div style={{alignItems: 'center'}} className='d-flex'>
                            <Form.Group className="mb-3">
                                <Form.Check
                                checked={billingCheck}
                                onChange={handleCheckChange}
                                id="billingCheck"
                                />
                            </Form.Group>
                                
                            <Row style={{marginLeft: '1px',}} className="mb-3">
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    disabled
                                    placeholder="Department" 
                                    value = "Billing"
                                     />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Year End" 
                                    name='year_end'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "billing")}
                                    value = {clientBillingFormData.year_end}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Job Deadline" 
                                     name='job_deadline'
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "billing")}
                                    value = {clientBillingFormData.job_deadline}
                                    />
                                </Form.Group>
    
                                <Form.Group as={Col} md="2" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Work Deadline"
                                    name="work_deadline"
                                    onMouseOver={(event) => event.target.type = 'date'}
                                    onMouseOut={(event) => event.target.type = 'text'}
                                    onChange={(e)=>handleClientFormChange(e, "billing")}
                                    value = {clientBillingFormData.work_deadline}
                                     />
                                </Form.Group>
    
                                {/* <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="HRS" 
                                    name='hours'
                                    onChange={(e)=>handleClientFormChange(e, "billing")}
                                    value = {clientBillingFormData.hours}
                                     />
                                </Form.Group> */}

                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='subscription'
                               onChange={(e)=>handleClientFormChange(e, "billing")}
                               value = {clientBillingFormData.subscription}
                                >
                                    <option value="">Subscription</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                    
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
                                    <Form.Control 
                                    type="text" 
                                    placeholder="FEE" 
                                    name='fee'
                                    onChange={(e)=>handleClientFormChange(e, "billing")}
                                    value = {clientBillingFormData.fee}
                                     />
                                </Form.Group>
    
    
                                


                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                               name='manager_id'
                               onChange={(e)=>handleClientFormChange(e, "billing")}
                               value = {clientBillingFormData.manager_id}
                                >
                                    <option>Manager</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
    
                                </Form.Group>
    
                                <Form.Group as={Col} md="1" controlId="validationCustom05">
    
                                <Form.Select 
                                name='job_holder_id'
                                onChange={(e)=>handleClientFormChange(e, "billing")}
                                value = {clientBillingFormData.job_holder_id}
                                >
                                    <option>Job Holder</option>
                                    {preData && preData.users.map((manager, index)=>
                                        <option key={index} value={manager._id}>{manager.name}</option>
                                    )}
                                </Form.Select>
                                </Form.Group>
    
    
                            </Row>
                        </div>
    
    
                        <Button type="submit">Update</Button>
                    </Form>
                </div>
    
            </div>
        </>
      )
}

  
}

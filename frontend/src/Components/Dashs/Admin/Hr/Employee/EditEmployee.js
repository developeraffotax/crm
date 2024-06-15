import { useState, useEffect, useRef } from 'react'
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import { Store } from 'react-notifications-component';
import { Navigate, useParams } from 'react-router-dom';

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import Loader from '../../../../Common/Loader/Loader';

var UserGetOneUrl = axiosURL.UserGetOneUrl;
var UserEditOneUrl = axiosURL.UserEditOneUrl;

const EditEmployee = () => {

    const { id } = useParams();

    const [loader, setLoader] = useState(false)

    const [validated, setValidated] = useState(false);
    const [preData, setPreData] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
        phone_number: '',
        emergenyc_contact: '',
        start_date: '',
        address: '',
    })

    useEffect(()=>{
        if(preData){
            setFormData({
                name: preData.name,
                email: preData.email,
                password: '',
                username: preData.username,
                phone_number: preData.phone_number,
                emergenyc_contact: preData.emergenyc_contact,
                start_date: preData.start_date,
                address: preData.address,
            })
        }
    },[preData])

    

    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(`${UserGetOneUrl}/${id}`,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setPreData(response.data.user)
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

    useEffect(()=>{
        getData()
    },[])

    const handleFormChange = (e)=>{
        setValidated(false);
        e.preventDefault();
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true)
        try {
            const response = await axios.post(`${UserEditOneUrl}/${id}`,
                {
                    data:formData 
                },
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
          if(response.status === 200 && response.data.message === "User successfully Updated")
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
                setLoader(false)
                Navigate("/hr/employees");
            }

            else if(response.status === 200){
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

    };

    if(loader){
        return(
            <Loader/>
        )
    }
    else{
        return (

            <>
                <h4>
                    Edit Employee
                </h4>
    
                <div className='mt-4'>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" >
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                name="name"
                                onChange = {handleFormChange}
                                value = {formData.name}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} md="4" >
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange = {handleFormChange}
                                value = {formData.email}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} md="4"     >
                            <Form.Control
                                type="number"
                                placeholder="Phone"
                                name="phone_number"
                                onChange = {handleFormChange}
                                value = {formData.phone_number}
                            />
                            </Form.Group>
                            
                        </Row>
    
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" >
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                name="username"
                                onChange = {handleFormChange}
                                value = {formData.username}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} md="4">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange = {handleFormChange}
                                value = {formData.password}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} md="4" >
                            <Form.Control
                                type="text"
                                placeholder="Start Date"
                                onMouseOver={(event) => event.target.type = 'date'}
                                onMouseOut={(event) => event.target.type = 'text'}
                                name="start_date"
                                onChange = {handleFormChange}
                                value = {formData.start_date}
                            />
                            </Form.Group>
                            
                        </Row>
    
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6">
                            <Form.Control
                                type="text"
                                placeholder="Address"
                                name="address"
                                onChange = {handleFormChange}
                                value = {formData.address}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} md="6" >
                            <Form.Control
                                type="text"
                                placeholder="Emergency Contact"
                                name="emergenyc_contact"
                                onChange = {handleFormChange}
                                value = {formData.emergenyc_contact}
                            />
                            </Form.Group>
                            
                        </Row>
                        
                        <Button type="submit">Submit form</Button>
                    </Form>
                </div>
    
            </>
        );
    }
    
}

export default EditEmployee;

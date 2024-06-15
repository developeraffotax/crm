import { useState, useEffect, useRef } from 'react'
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import { Store } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';

var addEmployeeUrl = axiosURL.addEmployeeUrl;

const AddEmployee = () => {

    const [loader, setLoader] = useState(false)

    const [validated, setValidated] = useState(false);

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

    const navigate = useNavigate();

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
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        try {
            setLoader(true)
            const response = await axios.post(addEmployeeUrl,
                {
                    data:formData 
                },
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );

          if(response.status === 200 && response.data.message === "User successfully created"){
                navigate('/hr/employees');
            }
            
            else if(response.status === 200){
            }
            
            setLoader(false)
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
        }

    };

    return (

        <>
            <h4>
                Add Employee
            </h4>

            <div className='mt-4'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control
                            required
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange = {handleFormChange}
                            value = {formData.name}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Control
                            required
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange = {handleFormChange}
                            value = {formData.email}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Control
                            required
                            type="number"
                            placeholder="Phone"
                            name="phone_number"
                            onChange = {handleFormChange}
                            value = {formData.phone_number}
                        />
                        </Form.Group>
                        
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom04">
                        <Form.Control
                            required
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange = {handleFormChange}
                            value = {formData.username}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom05">
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange = {handleFormChange}
                            value = {formData.password}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom06">
                        <Form.Control
                            required
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
                        <Form.Group as={Col} md="6" controlId="validationCustom07">
                        <Form.Control
                            required
                            type="text"
                            placeholder="Address"
                            name="address"
                            onChange = {handleFormChange}
                            value = {formData.address}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="validationCustom08">
                        <Form.Control
                            required
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

export default AddEmployee;

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HTMLRenderer from './HtmlRenderer';
import { Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { Buffer } from 'buffer';
import loaderr from "../../../../Assets/svgs/loader.svg"

import secureLocalStorage from 'react-secure-storage';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import { FileUploader } from 'react-drag-drop-files';

var replyToTicket = axiosURL.replyToTicket;
var replyToTicketWithAttachments = axiosURL.replyToTicketWithAttachments;
var downloadAttachment = axiosURL.downloadAttachment;

export default function DetailedMail(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const mailData = location.state
    const setReFetchTickets = props.setReFetchTickets;
    console.log(mailData)
    if(!mailData){
        navigate('/tickets');
    }

    const [replyIsPressed, setReplyIsPressed] = useState(false)
    const [replyFieldEmpty, setReplyFieldEmpty] = useState(false)
    const [sendingMail, setSendingMail] = useState(false)
    const [replyFormData, setReplyFormData] = useState('')
    const [downloadingAttachment, setDownloadingAttachment] = useState('')
    const [attachmentFiles, setAttachmentFiles] = useState([])
    

    
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ],
      };
    
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];
    
      const editorStyle = {
        backgroundColor: 'white',
        borderRadius: '5px',
      };

    // Remove quoted text from email body
    var removeQuotedText = (body) => {
        // Find the index of the first occurrence of "<div class="gmail_quote">"
        var startIndex = body.indexOf('<div class="gmail_quote">');
      
        if (startIndex !== -1) {
          // Find the index of the closing "</blockquote></div>" tag after the quoted section
          var endIndex = body.indexOf('</blockquote></div>', startIndex);
      
          if (endIndex !== -1) {
            // Remove the quoted section from the body
            body = body.slice(0, startIndex) ;
          }
        }
      
        return body.trim(); // Trim any leading or trailing whitespace
      };

      const reversedArray = mailData.decryptedMessages.slice().reverse();
      var messageIds = mailData.threadData.messages.map(message => message.id)
    //   var subjectToReply = mailData.threadData.messages[mailData.threadData.messages.length - 1].payload.headers.find(header => header.name === 'Subject' || header.name === "subject").value
      var subjectToReply = mailData.subject;
      var emailSendTo = mailData.recipients[0];

      const fileTypes = ["JPEG", "PNG", "PDF", "XLS", "XLSX"];

      const handleFilesChange = (file) => {
        const filesArray = Array.from(file);
        setAttachmentFiles(filesArray);
      };


    const handleReplyFromSubmit = async ()=>{

        if(!replyFormData || replyFormData === "<p><br></p>"){
            setReplyFieldEmpty(true)
        }else{

            try {
                setSendingMail(true);

                var messageString = replyFormData.replace(/<p>/g, `<p style=" margin: 0px; padding: 0px;">`);
                const token = secureLocalStorage.getItem('token') 


                if(attachmentFiles.length === 0){
                    await axios.post(`${replyToTicket}`, 
                    {
                    formData: {
                        threadId: mailData.threadId,
                        messageId: mailData.threadData.messages[mailData.threadData.messages.length - 1].id,
                        message: messageString,
                        emailSendTo: emailSendTo,
                        subjectToReply: subjectToReply,
                        company_name: mailData.ticketInfo.company_name,
                        company_email: mailData.ticketInfo.company_email
                    }
                    },
                    {
                        headers:{ 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                          }
                    });
                }else{
                    
                    const formData = new FormData();
                    formData.append("threadId", mailData.threadId)
                    formData.append("messageId", mailData.threadData.messages[mailData.threadData.messages.length - 1].id)
                    formData.append("message", messageString)
                    formData.append("emailSendTo", emailSendTo)
                    formData.append("subjectToReply", subjectToReply)
                    formData.append("company_name", mailData.ticketInfo.company_name)
                    formData.append("company_email", mailData.ticketInfo.company_email)

                    attachmentFiles.forEach((file) => {
                        formData.append('files', file);
                    });

                    await axios.post(`${replyToTicketWithAttachments}`, formData,
                    {
                        headers:{ 
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + token
                          }
                    });
                }

                setSendingMail(false)
                setReFetchTickets(prev => !prev);
                navigate('/tickets');
                
                
            } catch (error) {
                setSendingMail(false)
                //
            }

        }
    }

    const handleDownloadAttachment = async (e, attachmentId, messageId, fileName)=>{

        e.preventDefault();
        setDownloadingAttachment(attachmentId)

        try{
            
            const token = secureLocalStorage.getItem('token') 
            const response = await axios.get(`${downloadAttachment}/${attachmentId}/${messageId}/${mailData.ticketInfo.company_name}`, 
            {
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                responseType: 'json',
            });

            const jsonData = response.data;

            const encodedData = jsonData.data;
            const decodedData = Buffer.from(encodedData, 'base64');
            const byteArray = new Uint8Array(decodedData.buffer);
            
            const blob = new Blob([byteArray], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            // Create a link element and set its attributes
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Specify the desired filename

            // Simulate a click event on the link to trigger the download
            link.click();

            // Clean up the URL object
            URL.revokeObjectURL(url);

        } catch (err){
        }

        setDownloadingAttachment('')

    }

    function getEmailDate(headers) {
        const dateHeader = headers.find(header => header.name === 'Date');
        const dateValue = dateHeader ? dateHeader.value : null;
      
        if (dateValue) {
          // Split the date value by space and remove the last part (time zone offset)
          const dateWithoutOffset = dateValue.split(' ').slice(0, -1).join(' ');
      
          return dateWithoutOffset;
        }
        
        return null;
      }

  return (
    <>
        <>
  
  
  <div style={{
border: 'none'
}}
className="mt-3 card" >

<div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

<div style={{alignItems: 'center',}} className='d-flex'>

  <div >
    <h4 style={{padding: '20px 16px',}}>
        {mailData.subject}
    </h4>
  </div>



  {/* <div>
      <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
          <option value = "Active">
              Active
          </option>
          <option value = "Inactive">
              Inactive
          </option>
      </select>
  </div> */}

</div>

<div className="d-flex">

  <Button className='mx-3' onClick={()=>{setReplyIsPressed(!replyIsPressed)}}>
    Reply
  </Button>

</div>



</div>



    <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>


</div>

{replyIsPressed && 
    <div className='mt-2'>
        <div>

            <div style={{
                backgroundColor: 'white',
                padding: '10px',
                border: '0.5px solid #cccccc',
                display: 'flex',
                placeContent: 'space-between',
            }}>
                <div>
                    {replyFieldEmpty && 
                        <p style = {{
                            color: 'red',
                        }}>
                        Empty message can't be sent
                        </p>
                    }
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                }}>
                    {sendingMail ? 
                        <p>
                            Sending Reply
                        </p>
                    :
                    <>
                        <a style={{cursor: 'pointer'}} onClick={()=>{setReplyIsPressed(false)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>

                        {/* <a style={{cursor: 'pointer'}} onClick={handleReplyFromSubmit} className='mx-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
                                <title/><g id="Complete"><g id="tick"><polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g>
                            </svg>
                        </a> */}
                    </>

                    }

                </div>
            </div>

            <ReactQuill 
                name="message"
                theme="snow"
                modules={modules}
                formats={formats}
                style={editorStyle} 
                onChange= {(e)=>{setReplyFieldEmpty(false); setReplyFormData(e)}}
                value = {replyFormData}
            />

            <div style={{flexDirection: 'row-reverse',}} className='d-flex bg-white p-2'>
                <button disabled={sendingMail} onClick={handleReplyFromSubmit} className='btn btn-success'>
                    {sendingMail ? 'Sending' : 'Send'}
                </button>
            </div>

            <div style={{
              textAlign: '-webkit-center',
              marginTop: '10px',
            }}>
              <FileUploader
                multiple={true}
                handleChange={handleFilesChange}
                name="files"
                types={fileTypes}
              />
              {attachmentFiles && attachmentFiles.length > 0 && attachmentFiles.map(file => <p>{file.name}</p>)}
            </div>
            <hr />


        </div>

    </div>
}



{reversedArray.map((message, index) => {
    if(message.payload.body.sentByMe)
    {
        return(
            <div key={index} style={{
                display: 'flex',
                flexDirection: 'row-reverse'
            }}>
                <div style={{textAlign: '-webkit-right',}}>
                    <div style={{
                        border: 'none',
                        marginTop: "5px",
                        padding: "10px 15px",
                        backgroundColor: 'lightgray',
                        Width: 'fit-content',
                        maxWidth: '90%',
                        minWidth: 'fit-content',
                        textAlign: 'left',
                    }} className='card'>
                        {/* <HTMLRenderer htmlContent={message.payload.body.data.slice(1)} /> */}
                        <HTMLRenderer htmlContent={removeQuotedText(message.payload.body.data.charAt(0) === "�" ? message.payload.body.data.slice(3) : message.payload.body.data)} />


                        {message.payload.body.messageAttachments.length !== 0 && 
                            <>
                                <hr/>

                                {message.payload.body.messageAttachments.map((attachment)=>{
                                    return(
                                        <Link className={`${downloadingAttachment === attachment.attachmentId && "disabled-router-link" }`} onClick={(e)=>{handleDownloadAttachment(e, attachment.attachmentId, attachment.attachmentMessageId, attachment.attachmentFileName)}}>
                                            {attachment.attachmentFileName}
                                            {downloadingAttachment && downloadingAttachment === attachment.attachmentId && 
                                                <span>
                                                    <img style={{height: '20px', paddingLeft: '10px'}} src={loaderr} alt="" />
                                                </span>
                                            }
                                        </Link>
                                    )
                                })}
                            </>
                        }
                        
                    </div>
                    { message.messageSentBy && 
                        <p style={{ fontSize: '13px', }}>Sent By {message.messageSentBy}</p>
                    }

                    <p style={{ fontSize: '13px' }}>{getEmailDate(message.payload.headers)}</p>

                    
                </div>


                {/* {message.payload.body.data} */}
                    
            </div>

        )
    }
    else{
        return(
            <div key={index} style={{
                border: 'none',
                marginTop: "5px",
                padding: "10px 15px",
                Width: 'fit-content',
                maxWidth: '90%'
            }} className='card'>
                {/* <HTMLRenderer htmlContent={message.payload.body.data.slice(1)} /> */}
                <HTMLRenderer htmlContent={removeQuotedText(message.payload.body.data.charAt(0) === "�"  ? message.payload.body.data.slice(3) : message.payload.body.data)} />
                    {message.payload.body.messageAttachments.length !== 0 && 
                        <>
                            <hr/>

                            {message.payload.body.messageAttachments.map((attachment)=>{
                                return(
                                    <Link className={`${downloadingAttachment === attachment.attachmentId && "disabled-router-link" }`} onClick={(e)=>{handleDownloadAttachment(e, attachment.attachmentId, attachment.attachmentMessageId, attachment.attachmentFileName)}}>
                                        {attachment.attachmentFileName}
                                        {downloadingAttachment && downloadingAttachment === attachment.attachmentId && 
                                            <span>
                                                <img style={{height: '20px', paddingLeft: '10px'}} src={loaderr} alt="" />
                                            </span>
                                        }
                                    </Link>
                                )
                            })}
                        </>
                    }
            </div>
        )
    }
})}

    

</>
    </>
  )
}


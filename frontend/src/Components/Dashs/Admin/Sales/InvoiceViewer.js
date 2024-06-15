import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import Invoice from './Invoice';
import { useLocation } from 'react-router-dom';




const InvoiceViewer = () => {

  const location = useLocation();
  const { data } = location.state;

  const invoice = {
    invoiceNumber: data.invoice_no,
    date: data.date,
    from: data.company_id && data.company_id.name,
    fromAddress: data.company_id && data.company_id.address,
    to: data.client_id.client_name,
    toAddress: data.client_id.address,
    items: data.saleitem_id,
    subtotal: data.subtotal,
    tax: data.tax,
    discount: data.discount,
    total: data.total,
    currency: data.currency,
  };


    var stylesViewer = {
            height: '90vh',
            width: '100%'
    }
    var stylesInvoice = {
        backgroundColor: 'white',
        padding: '1cm',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    }
  return (
    <PDFViewer style={stylesViewer}>
      <Invoice style={stylesInvoice} invoice={invoice} />
    </PDFViewer>
  );
};

export default InvoiceViewer;
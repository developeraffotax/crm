import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logoPng from "../../../../Assets/Images/logo.png"

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    // height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
  tableCellDesc: {
    margin: 'auto',
    fontSize: 10,
    textAlign: 'center',
    padding: 5,
    // border: '1px solid red',
    width: '400%'
  },
  tableCellDescData: {
    margin: 'auto',
    fontSize: 10,
    padding: 5,
    // border: '1px solid red',
    width: '400%'
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    textAlign: 'center',
    padding: 5,
    // border: '1px solid red',
    width: '100%'
  },
  totalBox: {
    width: '100%',
    display: "flex",
    alignItems: "flex-end",
    justifyContent: 'center',
  },
  totalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    paddingTop: 5,
    marginTop: 10,
  },
  totalsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: "50px"
  },
  totalsValue: {
    fontSize: 12,
  },
});

const Invoice = ({ invoice }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          {/* <Image style={styles.logo} src={logoPng} /> */}
          <Text>{invoice.from}</Text>
          <Text style={styles.text}>Invoice Date: {invoice.date}</Text>
        </View>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.subtitle}>Invoice # {invoice.invoiceNumber}</Text>
        <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          <View style={{ width: '100%', }}>
            <View style={{ width: '80%', }}>
              {/* <Text style={styles.text}>To:</Text> */}
              <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.to}</Text>
              <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.toAddress}</Text>
            </View>
          </View>
          <View style={{width: '100%',}}>
            <View style={{ width: '80%', }}>
              {/* <Text style={styles.text}>From:</Text> */}
              <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.from}</Text>
              <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoice.fromAddress}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDesc, styles.tableHeader]}>Description</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>VAT</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Total</Text>
          </View>
          {invoice.items.map((item) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCellDescData}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.qty}</Text>
              <Text style={styles.tableCell}>{invoice.currency}{" "}{numberWithCommas(item.unit_price)}</Text>
              <Text style={styles.tableCell}>{item.tax_rate}%</Text>
              <Text style={styles.tableCell}>{invoice.currency}{" "}{numberWithCommas(item.amount)}</Text>
</View>
))}

<View style={styles.totalBox}>
  <View>
    <View style={styles.totalsRow}>
      <Text style={styles.totalsLabel}>Subtotal:</Text>
      <Text>{invoice.currency}{" "}{numberWithCommas(invoice.subtotal)}</Text>
    </View>
    <View style={styles.totalsRow}>
      <Text style={styles.totalsLabel}>Tax:</Text>
      <Text>{invoice.currency}{" "}{numberWithCommas(invoice.tax)}</Text>
    </View>
    {invoice.discount && (invoice.discount !== 0) && 
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Discount:</Text>
        <Text>{invoice.currency}{" "}{numberWithCommas(invoice.discount)}</Text>
      </View>
    }
    <View style={styles.totalsRow}>
      <Text style={styles.totalsLabel}>Total:</Text>
      <Text>{invoice.currency}{" "}{numberWithCommas(invoice.total)}</Text>
    </View>
  </View>

</View>
</View>
          
{/* 
<PageFooter style={styles.footer}>
  <Text style={styles.footerText}>
    Thank you for your business!
  </Text>
</PageFooter> */}
</Page>
</Document>
);
}
export default Invoice;

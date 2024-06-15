
import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const Table = () => {

 const gridRef = useRef(); // Optional - for accessing Grid's API
 const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

 // Each Column Definition results in one Column.
 const [columnDefs, setColumnDefs] = useState([
  {
    // headerName: "Hey",
    field: 'make', 
    // editable: true,
    flex: 1,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    // valueGetter: p => {
    //   return "Any thing you want"
    //   return p.value.obj1.obj2.obj3 //to get value from obj inside obj
    // }
  },
  {
    field: 'model',
    flex: 1,
    editable: false,
  },
  {
    field: 'price',
    flex: 1,
    valueFormatter: p => {
      return "$ " + p.value
    }
  },
  {
    field: 'actions',
    flex: 1,
    editable: false,
    filter: false,
    cellRendererFramework: ()=><div>
      <button className='btn btn-danger h1'> delete</button>
    </div>
  }
 ]);

 // DefaultColDef sets props common to all Columns
 const defaultColDef = useMemo( ()=> ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    editable: true
   }));

 // Example of consuming Grid Event
 const cellClickedListener = useCallback( event => {
 }, []);

 // Example load data from sever
 useEffect(() => {
   fetch('https://www.ag-grid.com/example-assets/row-data.json')
   .then(result => result.json())
   .then(rowData => setRowData(rowData))
 }, []);

 //Row Id
//  const getRowId = useCallback(params => {
//   return params.data.id
//  })

// const deleteHandler = ()=> {
//   const selectedNodes = gridRef.current.api.getSelectedNodes();
//   const selectedIds = selectedNodes.map(node => node.data.id);
//   //Delete api here
//   //set table data without reloading
// }

// const onCellValueChanged = useCallback((event) => {
//     'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
//   );
// }, []);

// const onRowValueChanged = useCallback((event) => {
//   var data = event.data;
//     'onRowValueChanged: (' +
//       data.model + data.make + data.price +
//       ')'
//   );
// }, []);


 return (
   <div>


     {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
     <div className="ag-theme-alpine" style={{ height: '75vh'}}>

      {/* <button onClick={deleteHandler}>delete</button> */}

       <AgGridReact
          // getRowId={getRowId}

           ref={gridRef} // Ref for accessing Grid's API

           rowData={rowData} // Row Data for Rows

           columnDefs={columnDefs} // Column Defs for Columns
           defaultColDef={defaultColDef} // Default Column Properties

           animateRows={true} // Optional - set to 'true' to have rows animate when sorted
           rowSelection='multiple' // Options - allows click selection of rows
           rowMultiSelectWithClick = {true} //Optional - allow to select rows without hloding ctrl

           pagination = {true}
           paginationPageSize = {25}

          //  enableCellChangeFlash = {true}

           onCellClicked={cellClickedListener} // Optional - registering for Grid Event

          editType={'fullRow'}
          // onCellValueChanged={onCellValueChanged}
          // onRowValueChanged={onRowValueChanged}

          suppressDragLeaveHidesColumns={true} // disable move above header to hide column
           />
     </div>
   </div>
 );
};

export default Table;
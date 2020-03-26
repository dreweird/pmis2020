import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PmisService } from '../../../core/services/pmis.service';

@Component({
  selector: 'anms-pdz',
  templateUrl: './pdz.component.html',
  styleUrls: ['./pdz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdzComponent implements OnInit {

  rowData: any;
  components: any;
  defaultColDef: { resizable: true };
  gridApi: any;
  columnDefs = [
    { headerName: 'main', field: 'header_main', rowGroup: true, hide: true},
    { headerName: 'Province', field: 'province', rowGroup: true, hide: true},
    { headerName: 'Municipal', field: 'municipal', rowGroup: true, hide: true},
    { headerName: 'Barangay', field: 'barangay', width: 100},
    { headerName: 'Beneficiary', field: 'group'},
    { headerName: 'PAP', field: 'header_subindicator',},
    { headerName: 'Indicator', field: 'mfo_name',},
    { headerName: 'Physical Target', field: 'target', width: 100},
    { headerName: 'Budget Allocation', field: 'cost', width: 100,valueFormatter: this.currencyFormatter,
    type: 'numericColumn', 
    valueGetter: function(params) {
      let data = params.data;
      if(data){
        return Number(data.target) * Number(data.cost);
       
      }
    }},
    { headerName: 'Remarks/Status', field: '',},
  ];
  autoGroupColumnDef = {
    headerName: 'Location',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 200,
    cellRendererParams: {
      suppressCount: true, // turn off the row count
      innerRenderer: 'simpleCellRenderer'
    }
  };
  constructor(private pmisService: PmisService, private cd: ChangeDetectorRef) {
    this.pmisService.pdz().subscribe(data=>{
      this.rowData = data;
      this.cd.markForCheck();
      console.log(data);    
    });
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
   }
   
   onGridReady(params) {
    this.gridApi = params.api; 
  }
   currencyFormatter(params) {
    const number = parseFloat(params.value);
    if (params.value === undefined || params.value === null) {
      return null;
    }
    return number.toLocaleString('en-us', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  ngOnInit(): void {
  }

}
function getSimpleCellRenderer() {
  function SimpleCellRenderer() {}
  SimpleCellRenderer.prototype.init = function(params) {
    const tempDiv = document.createElement('div');
     if (params.node.group) {
      tempDiv.innerHTML =
        '<span style="font-weight: bold">' + params.value + '</span>';
    } 
    this.eGui = tempDiv.firstChild;
  };
  SimpleCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return SimpleCellRenderer;
}
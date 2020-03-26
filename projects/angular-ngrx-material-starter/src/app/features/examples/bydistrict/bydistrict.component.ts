import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import { PmisService } from '../../../core/services/pmis.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'anms-bydistrict',
  templateUrl: './bydistrict.component.html',
  styleUrls: ['./bydistrict.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BydistrictComponent implements OnInit {
  gridApi: any;
  rowData: any;
  autoGroupColumnDef: any;
  components: any;
  provselect: any;
  distselect: any;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  defaultColDef: { resizable: true };

  constructor(private pmisService: PmisService, private cd: ChangeDetectorRef) { 

    this.pmisService.distinctProv().subscribe(data=>{
      this.prov = data;
      console.log(data);
    });

    this.inputForm = new FormGroup({
      prov: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required])

    });
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
    this.autoGroupColumnDef = {
      headerName: 'Program/Project/Activity',
      cellRenderer: 'agGroupCellRenderer',
      cellClass: ['data'],
      cellClassRules: {
        indent1: function(params) {
          if (params.node.uiLevel == 1) return true;
        },
        indent2: function(params) {
          if (params.node.uiLevel == 2) return true;
        },
        indent3: function(params) {
          if (params.node.uiLevel == 3) return true;
        },
        indent4: function(params) {
          if (params.node.uiLevel == 4) return true;
        },
        indent5: function(params) {
          if (params.node.uiLevel == 5) return true;
        },
        bold: function(params) {
          if (params.node.group) return true;
        }
      },
      pinned: 'left',
      width: 300,
      field: 'mfo_name',
      cellRendererParams: {
        suppressCount: true, // turn off the row count
        innerRenderer: 'simpleCellRenderer'
      }
    };
  }
  inputForm: FormGroup;
  prov: any;
  district = [
    {value: 1},
    {value: 2}
  ];
  excelStyles = [
    { id: 'indent1', alignment: { indent: 1 } },
    { id: 'indent2', alignment: { indent: 2 } },
    { id: 'indent3', alignment: { indent: 3 } },
    { id: 'indent4', alignment: { indent: 4 } },
    { id: 'indent5', alignment: { indent: 5 } },
    { id: 'bold', font: { bold: true } },
    {
      id: 'data',
      font: { size: 11, fontName: 'Calibri' },
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: { color: '#000000', lineStyle: 'Continuous', weight: 1 },
        borderRight: { color: '#000000', lineStyle: 'Continuous', weight: 1 },
        borderTop: { color: '#000000', lineStyle: 'Continuous', weight: 1 }
      }
    },
    {
      id: 'header',
      font: { size: 11, fontName: 'Calibri', bold: true },
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: { color: '#000000', lineStyle: 'Continuous', weight: 1 },
        borderRight: { color: '#000000', lineStyle: 'Continuous', weight: 1 },
        borderTop: { color: '#000000', lineStyle: 'Continuous', weight: 1 }
      }
    },
    { id: 'headappend', font: { size: 11, fontName: 'Calibri', bold: true } }
  ];
  columnDefs = [
    { headerName: 'header_main', field: 'header_main', rowGroup: true, hide: true},
    { headerName: 'header_program', field: 'header_program', rowGroup: true, hide: true},
    { headerName: 'header_subindicator', field: 'header_subindicator', rowGroup: true, hide: true},
    { headerName: 'mfo_name', field: 'mfo_name',  hide: true},
    { headerName: 'Unit of Measure', field: 'unitmeasure', width: 100, cellClass: ['data'],},
    { headerName: 'Physical Target', field: 'target', width: 100, cellClass: ['data'],
    valueGetter: function(params) {
      let data = params.data;
      var total = 0;
      if(data){
        for (var i = 0, l = data.location.length; i < l; i++) {
          total = total + data.location[i].target;
        }
        return total;
      }
    }},
    { headerName: 'Budget Allocation', field: 'cost', width: 100,valueFormatter: this.currencyFormatter,
    type: 'numericColumn', cellClass: ['data'],
    valueGetter: function(params) {
      let data = params.data;
      var total = 0;
      if(data){
        for (var i = 0, l = data.location.length; i < l; i++) {
          total = total + data.location[i].target;
        }
        return total * Number(data.cost);
      }
    }},
    { headerName: 'Location', field: 'location', width: 300,  cellClass: ['data'],
    valueGetter: function(params) {
      let data = params.data;
      let loc = "";
      if(data){
        for (var i = 0, l = data.location.length; i < l; i++) {
          var obj = data.location[i];
          loc +=  data.location[i].municipal + '  (' + data.location[i].target + ') ';
        }
        return loc;
    
      }
    }},


  ];
  exportcsv() {
    this.gridApi.exportDataAsExcel({
      customHeader: [
        [{styleId: 'headappend', data: { type: 'String', value: 'DEPARTMENT OF AGRICULTURE' }}],
        [{styleId: 'headappend',data: { type: 'String', value: 'Caraga Region' }}],
        [{styleId: 'headappend',data: { type: 'String', value: 'Capitol Site, Butuan City' }}],
        [],
        [{styleId: 'headappend',data: { type: 'String', value: this.provselect+ ', District ' + this.distselect}}],       
      ],
      sheetName: "CY 2020 Interventions based on GAA",
      fileName: this.provselect+ ', District ' + this.distselect,
      processCellCallback: function(params) {
        var node = params.node;
        //console.log(params);
        if (node.group && params.column.colDef.field == 'mfo_name')
        return node.key;
        else if (node.group && params.column.colDef.field != 'mfo_name')
          return '';
        else return params.value;
      }
   
  

    });
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
  onGridReady(params) {
    this.gridApi = params.api; 
  }
  onGenerate(formDirective: FormGroupDirective){
    this.provselect = this.inputForm.value.prov;
    this.distselect = this.inputForm.value.district;
    this.pmisService.by_district(this.inputForm.value).subscribe((data: any)=>{
      this.rowData = data;
      this.cd.markForCheck();
      console.log(this.rowData);
    });
    formDirective.resetForm();
    this.inputForm.reset();
  }
  ngOnInit(): void {
  }

}
function getSimpleCellRenderer() {
  function SimpleCellRenderer() {}
  SimpleCellRenderer.prototype.init = function(params) {
    const tempDiv = document.createElement('div');
    // console.log(params.node);
    if (params.node.group && params.node.field === 'mfo_id') {
      // alert(params.node.field);
      tempDiv.innerHTML =
        '<span>' + params.node.allLeafChildren[0].data.mfo_name + '</span>';
    } else if (params.node.group) {
      tempDiv.innerHTML =
        '<span style="font-weight: bold">' + params.value + '</span>';
    } else {
      // console.log(params);
      tempDiv.innerHTML = '<span>' + params.value + '</span>';
    }
    this.eGui = tempDiv.firstChild;
  };
  SimpleCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return SimpleCellRenderer;
}

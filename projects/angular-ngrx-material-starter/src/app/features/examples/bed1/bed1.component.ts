import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { MatDialog } from '@angular/material/dialog';
import { AddObjectDialogComponent } from './addObject-dialog.component';
import 'ag-grid-enterprise';
import { logDialog } from '../bed2/logDialog.component';
import { PmisService } from '../../../core/services/pmis.service';

@Component({
  selector: 'anms-bed1',
  templateUrl: './bed1.component.html',
  styleUrls: ['./bed1.component.css']
})
export class Bed1Component implements OnInit, OnChanges {
  @Input() pid: number = 0;
  @Input() name: string = '';

  changeLog: string[] = [];

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  gridApi: any;
  gridColumnApi: any;
  rowData: any;
  columnDefs: any;
  autoGroupColumnDef: any;
  components: any;
  rowSelection: any;
  columnTypes: any;
  date_updated: any;
  defaultColDef: any;
  user: any;
  edit: any;
  excelStyles: any;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  mon = [
    'jan',
    'feb',
    'mar',
    'Q1',
    'apr',
    'may',
    'jun',
    'Q2',
    'jul',
    'aug',
    'sep',
    'Q3',
    'oct',
    'nov',
    'dec',
    'Q4',
    'to'
  ];

  ngOnChanges(changes: any) {
    console.log(changes.pid.currentValue);
    this.mfoService.getMFO(changes.pid.currentValue).subscribe(data => {
      this.rowData = data;
      this.cd.markForCheck();
    });
    this.mfoService
      .getLastUpdated(1, changes.pid.currentValue)
      .subscribe(data => {
        if (data === undefined) this.date_updated = '';
        else this.date_updated = data;
        this.cd.markForCheck();
        console.log(data);
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.mfoService.getMFO(this.user.user.pid).subscribe(data => {
      this.rowData = data;
      this.cd.markForCheck();
    });
  }

  exportcsv() {
    var ck = [
      'mfo_name',
      'name',
      'object_id',
      'budget',
      'adjustment',
      'adjusted'
    ];
    // for(var i=1;i<=2;i++){
    //   for(var ii=0;ii<this.mon.length;ii++){
    //     var add="";
    //     if(i==1){ add="_t"; }
    //     if(i==2&&ii==14) add="m";
    //     ck.push(this.mon[ii]+add);
    //   }
    // }

    for (var i = 0; i < this.mon.length; i++) {
      var add = '';
      if (i == 14) add = 'm';
      ck.push(this.mon[i] + add);
    }
    ck.push('un', 'fu');
    console.log(ck);
    var prog_ou = this.user.user.username;
    console.log(this.pid);
    if (this.pid != 0) prog_ou = this.name + ' - M&E Generated';
    if (prog_ou.substring(0, 7) == 'budget_')
      prog_ou = prog_ou.substring(7, prog_ou.length + 1);
    this.gridApi.exportDataAsExcel({
      customHeader: [
        [
          {
            styleId: 'headappend',
            data: { type: 'String', value: 'DEPARTMENT OF AGRICULTURE' }
          }
        ],
        [
          {
            styleId: 'headappend',
            data: { type: 'String', value: 'Regional Field Office XIII' }
          }
        ],
        [
          {
            styleId: 'headappend',
            data: { type: 'String', value: 'BED1 Report 2020' }
          }
        ],
        [
          {
            styleId: 'headappend',
            data: { type: 'String', value: prog_ou.toUpperCase() }
          }
        ],
        [
          {
            styleId: 'headappend',
            data: { type: 'String', value: 'C.Y. 2020 CURRENT APPROPRIATION' }
          }
        ],
        [
          {
            styleId: 'headappend',
            data: {
              type: 'String',
              value:
                'PMIS v4.0 Generated as of ' +
                this.months[new Date().getMonth()] +
                ' ' +
                new Date().getDate() +
                ', ' +
                new Date().getFullYear()
            }
          }
        ],
        [],
        [
          { data: { type: 'String', value: '' } },
          { data: { type: 'String', value: '' } },
          { data: { type: 'String', value: '' } },
          { data: { type: 'String', value: '' } },
          { data: { type: 'String', value: '' } },
          { data: { type: 'String', value: '' } },
          // {styleId:'t',data:{type:'String', value:'Financial Targets'},mergeAcross:16},
          {
            styleId: 'a',
            data: { type: 'String', value: 'Financial Accomplishments' },
            mergeAcross: 16
          },
          { styleId: 't', data: { type: 'String', value: '' } },
          { styleId: 't', data: { type: 'String', value: '' } }
        ]
      ],
      columnKeys: ck,
      processHeaderCallback: function(params) {
        var name = params.column.colDef.headerName;
        //console.log(params);
        //if(params.column.visible)
        if (name == 'mfo_name') {
          return 'PAP';
        } else if (
          name == 'header_program' ||
          name == 'header_mfo' ||
          name == 'header_indicator' ||
          name == 'mfo_id'
        ) {
        } // do nothing
        else {
          return params.column.colDef.headerName;
        }
      },
      shouldRowBeSkipped: function(params) {
        //console.log(params);
        return params.node.group && params.node.childrenAfterGroup.length == 1;
      },
      processCellCallback: function(params) {
        var node = params.node;
        //console.log(params);
        if (params.column.colDef.field == 'mfo_name') {
          if (node.group) {
            return node.key;
          } else {
            return params.value;
          }
        } else if (params.column.colDef.field == 'fu' && isNaN(params.value))
          return '';
        else return params.value;
      }
    });
  }

  groupRowAggNodes(nodes: any) {
    const result = {
      to_t: 0,
      to: 0,
      fu: 0,
      un: 0,
      adjusted: 0,
      budget: 0,
      adjustment: 0,
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
      Q1_t: 0,
      Q2_t: 0,
      Q3_t: 0,
      Q4_t: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      decm: 0
    };
    nodes.forEach(function(node: any) {
      const data = node.group ? node.aggData : node.data;
      if (typeof data.adjustment === 'number') {
        result.adjustment += data.adjustment;
      }
      if (typeof data.budget === 'number') {
        result.budget += data.budget;
      }
      if (
        typeof data.budget === 'number' &&
        typeof data.adjustment === 'number'
      ) {
        result.adjusted += data.budget + data.adjustment;
      }

      if (typeof data.jan === 'number') {
        result.jan += data.jan;
      }
      if (typeof data.feb === 'number') {
        result.feb += data.feb;
      }
      if (typeof data.mar === 'number') {
        result.mar += data.mar;
      }
      if (typeof data.apr === 'number') {
        result.apr += data.apr;
      }
      if (typeof data.may === 'number') {
        result.may += data.may;
      }
      if (typeof data.jun === 'number') {
        result.jun += data.jun;
      }
      if (typeof data.jul === 'number') {
        result.jul += data.jul;
      }
      if (typeof data.aug === 'number') {
        result.aug += data.aug;
      }
      if (typeof data.sep === 'number') {
        result.sep += data.sep;
      }
      if (typeof data.oct === 'number') {
        result.oct += data.oct;
      }
      if (typeof data.nov === 'number') {
        result.nov += data.nov;
      }
      if (typeof data.decm === 'number') {
        result.decm += data.decm;
      }
      result.Q1_t +=
        Number(data.jan_t) + Number(data.feb_t) + Number(data.mar_t);
      result.Q2_t +=
        Number(data.apr_t) + Number(data.may_t) + Number(data.jun_t);
      result.Q3_t +=
        Number(data.jul_t) + Number(data.aug_t) + Number(data.sep_t);
      result.Q4_t +=
        Number(data.oct_t) + Number(data.nov_t) + Number(data.dec_t);
      result.Q1 += Number(data.jan) + Number(data.feb) + Number(data.mar);
      result.Q2 += Number(data.apr) + Number(data.may) + Number(data.jun);
      result.Q3 += Number(data.jul) + Number(data.aug) + Number(data.sep);
      result.Q4 += Number(data.oct) + Number(data.nov) + Number(data.decm);
      result.to +=
        Number(data.jan) +
        Number(data.feb) +
        Number(data.mar) +
        Number(data.apr) +
        Number(data.may) +
        Number(data.jun) +
        Number(data.jul) +
        Number(data.aug) +
        Number(data.sep) +
        Number(data.oct) +
        Number(data.nov) +
        Number(data.decm);

      result.un = result.adjusted - result.to;
      result.fu = result.to / result.adjusted;
    });
    return result;
  }

  addObject(params) {
    console.log(this.user.user.b);
    if (this.user.user.b == 1) {
      if (params.colDef.headerName === 'PAP' && params.data !== undefined) {
        const selectedRows = this.gridApi.getSelectedRows();
       // console.log(selectedRows);
        const dialogRef = this.dialog.open(AddObjectDialogComponent, {
          data: { data: selectedRows[0], gridApi: this.gridApi, pid: this.pid, add: true }
        });
        return dialogRef.afterClosed();
      }
      if (params.colDef.headerName === 'Description' && params.data !== undefined) {
        const selectedRows = this.gridApi.getSelectedRows();
        console.log(selectedRows);
        const dialogRef = this.dialog.open(AddObjectDialogComponent, {
          data: { data: selectedRows[0], gridApi: this.gridApi, pid: this.pid, edit: true }
        });
        return dialogRef.afterClosed();
      }
    }
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

  percentageFormatter(params) {
    const number = parseFloat(params.value) * 100;
    if (number === undefined || isNaN(number)) {
      return 0;
    }
    return number.toLocaleString('en-us', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  updateLogs(id: number, value: number, col: string, month: string) {
    //  const uid = JSON.parse(localStorage.getItem('currentUser'));
    //  if(uid.pid === 101) uid.pid = this.pid; // if
    console.log(month);
    this.mfoService
      .updateLogs(id, value, this.pid, col, month, 1, null, null)
      .subscribe(data => console.log(data));
    this.lastUpdated();
  }
  lastUpdated() {
    if (this.pid === 0) this.pid = this.user.user.pid;
    console.log(this.pid);
    this.mfoService.getLastUpdated(1, this.pid).subscribe(data => {
      console.log(data);
      if (data === undefined) this.date_updated = '';
      else this.date_updated = data;
      this.cd.markForCheck();
    });
  }

  getLogs() {
    if (this.pid === 0) {
      this.pid = this.user.user.pid;
    }
    this.dialog.open(logDialog, {
      data: { beds: 1, pid: this.pid }
    });
  }

  onCellValueChanged(event: any) {
    if (isNaN(+event.newValue)) {
      alert('Invalid entry...input numbers only');
      event.newValue = null;
    } else {
      this.updateLogs(
        event.data.mfo_id,
        event.newValue,
        event.data.mfo_name,
        event.colDef.field
      );
      console.log(event);
      this.mfoService
        .updateAllotment(event.data.id, event.newValue, event.colDef.field)
        .subscribe(data => {
          console.log(data);
        });
    }
  }

  constructor(
    private mfoService: PmisService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.user = JSON.parse(localStorage.getItem('ANMS-AUTH'));
    this.edit = this.user.user.b == 1;

    console.log(this.edit);
    this.excelStyles = [
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
        id: 'ad',
        interior: { color: '#f1cbff', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
      },
      {
        id: 'un',
        interior: { color: '#ffbdbd', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
      },
      {
        id: 'p1',
        interior: { color: '#BBDAFF', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
      },
      {
        id: 'p2',
        interior: { color: '#86BCFF', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
      },
      //   { id: "t", interior: { color: "#fddfdf", pattern: 'Solid' }, font: { size:11, fontName: "Calibri", bold: true }, alignment:{horizontal:'Center'}},
      {
        id: 'a',
        interior: { color: '#ffb7b2', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true },
        alignment: { horizontal: 'Center' }
      },
      {
        id: 'd1',
        interior: { color: '#92FEF9', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
      },
      {
        id: 'd2',
        interior: { color: '#01FCEF', pattern: 'Solid' },
        font: { size: 11, fontName: 'Calibri', bold: true }
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
    this.rowSelection = 'single';
    this.columnDefs = [
      {
        headerName: 'header_main',
        field: 'header_main',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'header_program',
        field: 'header_program',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'header_mfo',
        field: 'header_mfo',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'header_indicator',
        field: 'header_indicator',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'header_subindicator',
        field: 'header_subindicator',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'mfo_id',
        field: 'mfo_id',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'mfo_name',
        field: 'mfo_name',
        width: 120,
        rowGroup: true,
        hide: true,
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
        }
      },

      {
        cellClass: ['data'],
        headerName: 'Description',
        field: 'name',
        width: 150,
        pinned: 'left'
      },
      {
        cellClass: ['data'],
        headerName: 'UACS Object Code',
        field: 'object_id',
        width: 100
      },
      {
        cellClass: ['data'],
        headerName: 'Original Allotment',
        field: 'budget',
        width: 100,
        editable: this.edit,
        valueFormatter: this.currencyFormatter,
        type: 'numericColumn'
      },
      {
        cellClass: ['data'],
        headerName: 'Adjustment',
        field: 'adjustment',
        width: 100,
        editable: this.edit,
        valueFormatter: this.currencyFormatter,
        type: 'numericColumn'
      },
      {
        cellClass: ['data', 'ad'],
        headerName: 'Adjusted Allotment',
        field: 'adjusted',
        width: 100,
        cellStyle: { color: 'white', 'background-color': '#b23c9a' },
        valueGetter: 'Number(data.budget) + Number(data.adjustment) ',
        valueFormatter: this.currencyFormatter,
        type: 'valueColumn'
      },
      {
        headerName: 'Financial Accomplishment',
        children: [
          {
            cellClass: ['data'],
            headerName: 'Jan',
            field: 'jan',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Feb',
            field: 'feb',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Mar',
            field: 'mar',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data', 'p1'],
            headerName: 'Q1',
            field: 'Q1',
            width: 70,
            cellStyle: { color: 'white', 'background-color': '#5472d3' },
            valueGetter:
              'Number(data.jan) + Number(data.feb) + Number(data.mar)',
            valueFormatter: this.currencyFormatter,
            type: 'numericColumn'
          },
          {
            cellClass: ['data'],
            headerName: 'Apr',
            field: 'apr',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'May',
            field: 'may',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Jun',
            field: 'jun',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data', 'p1'],
            headerName: 'Q2',
            field: 'Q2',
            width: 70,
            cellStyle: { color: 'white', 'background-color': '#5472d3' },
            valueGetter:
              'Number(data.apr) + Number(data.may) + Number(data.jun)',
            valueFormatter: this.currencyFormatter,
            type: 'numericColumn'
          },
          {
            cellClass: ['data'],
            headerName: 'Jul',
            field: 'jul',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Aug',
            field: 'aug',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Sep',
            field: 'sep',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data', 'p1'],
            headerName: 'Q3',
            field: 'Q3',
            width: 70,
            cellStyle: { color: 'white', 'background-color': '#5472d3' },
            valueGetter:
              'Number(data.jul) + Number(data.aug) + Number(data.sep)',
            valueFormatter: this.currencyFormatter,
            type: 'numericColumn'
          },
          {
            cellClass: ['data'],
            headerName: 'Oct',
            field: 'oct',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Nov',
            field: 'nov',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data'],
            headerName: 'Dec',
            field: 'decm',
            width: 70,
            editable: this.edit,
            valueFormatter: this.currencyFormatter,
            type: 'valueColumn',
            columnGroupShow: 'open'
          },
          {
            cellClass: ['data', 'p1'],
            headerName: 'Q4',
            field: 'Q4',
            width: 70,
            cellStyle: { color: 'white', 'background-color': '#5472d3' },
            valueGetter:
              'Number(data.oct) + Number(data.nov) + Number(data.decm)',
            valueFormatter: this.currencyFormatter,
            type: 'numericColumn'
          },
          {
            cellClass: ['data', 'p2'],
            headerName: 'Total Obligations',
            field: 'to',
            width: 120,
            cellStyle: { color: 'white', 'background-color': '#ef7109' },
            valueGetter:
              'Number(data.jan) + Number(data.feb) + Number(data.mar) + Number(data.apr) + Number(data.may) + Number(data.jun) + Number(data.jul) + Number(data.aug) + Number(data.sep) + Number(data.oct) + Number(data.nov) + Number(data.decm)',
            valueFormatter: this.currencyFormatter,
            type: 'totalColumn'
          }
        ]
      },

      {
        cellClass: ['data', 'un'],
        headerName: 'Unobligated',
        field: 'un',
        width: 120,
        cellStyle: { color: 'white', 'background-color': '#e83525' },
        valueGetter:
          '(Number(data.budget) + Number(data.adjustment)) - (Number(data.jan) + Number(data.feb) + Number(data.mar) + Number(data.apr) + Number(data.may) + Number(data.jun) + Number(data.jul) + Number(data.aug) + Number(data.sep) + Number(data.oct) + Number(data.nov) + Number(data.decm))',
        valueFormatter: this.currencyFormatter,
        type: 'totalColumn'
      },
      {
        cellClass: ['data'],
        headerName: '% Utilization',
        field: 'fu',
        width: 70,
        valueGetter:
          '(Number(data.jan) + Number(data.feb) + Number(data.mar) + Number(data.apr) + Number(data.may) + Number(data.jun) + Number(data.jul) + Number(data.aug) + Number(data.sep) + Number(data.oct) + Number(data.nov) + Number(data.decm)) / (Number(data.budget) + Number(data.adjustment))',
        valueFormatter: this.percentageFormatter,
        type: 'totalColumn'
      }
    ];
    this.autoGroupColumnDef = {
      headerName: 'PAP',
      cellRenderer: 'agGroupCellRenderer',
      pinned: 'left',
      width: 300,
      field: 'mfo_name',
      cellRendererParams: {
        suppressCount: true, // turn off the row count
        innerRenderer: 'simpleCellRenderer'
      }
    };
    this.columnTypes = {
      valueColumn: {
        width: 100,
        aggFunc: 'sum',
        valueParser: 'Number(newValue)',
        cellClass: 'number-cell',
        valueFormatter: this.currencyFormatter
      },
      totalColumn: {
        aggFunc: 'sum',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        cellClass: 'number-cell',
        valueFormatter: this.currencyFormatter
      }
    };
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
    this.defaultColDef = { resizable: true };
  }

  ngOnInit() {
    console.log(this.user.user.pid);
    this.lastUpdated();
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
    }  else if (params.data.discontinue == 1) {
      tempDiv.innerHTML =
      '<span style=" background-color: #ffe6e6; text-decoration: line-through;">' + params.value + '</span>';
    }  else if (params.data.refocus == 1) {
      tempDiv.innerHTML =
        '<span style="background-color: #7FFF00">' + params.value + '</span>';
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

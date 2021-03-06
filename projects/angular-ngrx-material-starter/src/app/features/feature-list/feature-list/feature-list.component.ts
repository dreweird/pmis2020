import { Component, OnInit } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import * as CanvasJS from '../../../../assets/canvasjs.min';
import 'ag-grid-enterprise';
import { Router, NavigationExtras } from '@angular/router';
import { PmisService } from '../../../core/services/pmis.service';
import { MatDialog } from '@angular/material/dialog';
import { logDialog } from '../../examples/bed2/logDialog.component';

@Component({
  selector: 'anms-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss']
})
export class FeatureListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  myDate: Date;
  gridApi: any;
  gridColumnApi: any;
  rowData: any;
  columnDefs: any;
  autoGroupColumnDef: any;
  components: any;
  rowSelection: any;
  columnTypes: any;
  show: boolean = true;
  show2: boolean = true;
  da_finChart: any;
  da_fin: any;
  da_phys: any;
  da_dis: any;
  fin_total: any;
  dis_total: any;
  janft: any;
  febft: any;
  marft: any;
  aprft: any;
  mayft: any;
  junft: any;
  julft: any;
  augft: any;
  sepft: any;
  octft: any;
  novft: any;
  decft: any;
  janfa: any;
  febfa: any;
  marfa: any;
  aprfa: any;
  mayfa: any;
  junfa: any;
  julfa: any;
  augfa: any;
  sepfa: any;
  octfa: any;
  novfa: any;
  decfa: any;
  jandt: any;
  febdt: any;
  mardt: any;
  aprdt: any;
  maydt: any;
  jundt: any;
  juldt: any;
  augdt: any;
  sepdt: any;
  octdt: any;
  novdt: any;
  decdt: any;
  janda: any;
  febda: any;
  marda: any;
  aprda: any;
  mayda: any;
  junda: any;
  julda: any;
  augda: any;
  sepda: any;
  octda: any;
  novda: any;
  decda: any;
  defaultColDef: { resizable: boolean };
  logs: any;

  constructor(
    private mfoService: PmisService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.mfoService.logsReport().subscribe(data => {
      this.logs = data;
      console.log(this.logs);
    });
    this.myDate = new Date();
    this.rowSelection = 'single';
    this.columnDefs = [
      {
        headerName: 'Programs/OUs',
        field: 'name',
        width: 120,
        pinned: 'left',
        valueFormatter: this.nameFormatter
      },
      {
        headerName: 'Adjusted Allotment',
        field: 'adjusted_alloc',
        width: 120,
        valueFormatter: this.currencyFormatter,
        cellStyle: { color: 'white', 'background-color': '#283593' }
      },
      {
        headerName: 'Total Obligation',
        field: 'fin',
        width: 120,
        valueFormatter: this.currencyFormatter,
        cellStyle: { color: 'white', 'background-color': '#3F51B5' }
      },
      {
        headerName: 'Utilization',
        field: '',
        width: 120,
        valueFormatter: this.percentageFormatter,
        cellStyle: { color: 'white', 'background-color': '#7C4DFF' },
        valueGetter: '(Number(data.fin) / Number(data.adjusted_alloc))'
      },
 
      {
        headerName: 'Total Disbursement',
        field: 'dis',
        width: 120,
        valueFormatter: this.currencyFormatter,
        cellStyle: { color: 'white', 'background-color': '#b000ff' }
      },
      {
        headerName: 'Utilization',
        field: '',
        width: 120,
        valueFormatter: this.percentageFormatter,
        cellStyle: { color: 'white', 'background-color': '#9C27B0' },
        valueGetter: '(Number(data.dis) / Number(data.adjusted_alloc))'
      },
      {
        headerName: 'Against Actual Obligation',
        valueFormatter: this.percentageFormatter,
        width: 120,
        cellStyle: { color: 'black', 'background-color': '#FFFF00' },
        valueGetter: '(Number(data.dis) / Number(data.fin))'
      },
      {
        headerName: 'Physical Target',
        field: 'pt',
        width: 120,
        valueFormatter: this.currencyFormatter,
        cellStyle: { color: 'white', 'background-color': '#E91E63' }
      },
      {
        headerName: 'Physical Accomplishment',
        field: 'pa',
        width: 120,
        valueFormatter: this.currencyFormatter,
        cellStyle: { color: 'white', 'background-color': '#C2185B' }
      },
      {
        headerName: 'Physical Percentage',
        field: '',
        width: 120,
        valueFormatter: this.percentageFormatter,
        cellStyle: { color: 'white', 'background-color': '#FF4081' },
        valueGetter: '(Number(data.pa) / Number(data.pt))'
      }
    ];

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
        cellClass: 'number-cell',
        valueFormatter: this.currencyFormatter
      }
    };
    this.defaultColDef = { resizable: true };
  }

  percentageFormatter(params) {
    const number = parseFloat(params.value) * 100;
    if (number === undefined || isNaN(number)) {
      return 0;
    }
    return (
      number.toLocaleString('en-us', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' %'
    );
  }

  nameFormatter(params) {
    let str = params.value;
    return str.toLocaleUpperCase();
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
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.mfoService.getFinPerformance().subscribe((data: []) => {
      this.rowData = data;
      this.fin_total = data.reduce(function(prev, cur: any) {
        return prev + cur.adjusted_alloc; 
      }, 0);
      let fin_acc = data.reduce(function(prev, cur: any) {
        return prev + cur.fin;
      }, 0);
      let phys_total = data.reduce(function(prev, cur: any) {
        return prev + cur.pt;
      }, 0);
      let phys_acc = data.reduce(function(prev, cur: any) {
        return prev + cur.pa;
      }, 0);
      this.dis_total = data.reduce(function(prev, cur: any) {
        return prev + cur.dt;
      }, 0);
      let dis_acc = data.reduce(function(prev, cur: any) {
        return prev + cur.dis;
      }, 0);
      this.da_fin = ((fin_acc / this.fin_total) * 100).toFixed(2) + '%';
      this.da_phys = ((phys_acc / phys_total) * 100).toFixed(2) + '%';
      this.da_dis = ((dis_acc / this.fin_total) * 100).toFixed(2) + '%';

      this.janft = data.reduce(function(prev, cur: any) {
        return prev + cur.janft;
      }, 0);
      this.febft = data.reduce(function(prev, cur: any) {
        return prev + cur.febft;
      }, 0);
      this.marft = data.reduce(function(prev, cur: any) {
        return prev + cur.marft;
      }, 0);
      this.aprft = data.reduce(function(prev, cur: any) {
        return prev + cur.aprft;
      }, 0);
      this.mayft = data.reduce(function(prev, cur: any) {
        return prev + cur.mayft;
      }, 0);
      this.junft = data.reduce(function(prev, cur: any) {
        return prev + cur.junft;
      }, 0);
      this.julft = data.reduce(function(prev, cur: any) {
        return prev + cur.julft;
      }, 0);
      this.augft = data.reduce(function(prev, cur: any) {
        return prev + cur.augft;
      }, 0);
      this.sepft = data.reduce(function(prev, cur: any) {
        return prev + cur.sepft;
      }, 0);
      this.octft = data.reduce(function(prev, cur: any) {
        return prev + cur.octft;
      }, 0);
      this.novft = data.reduce(function(prev, cur: any) {
        return prev + cur.novft;
      }, 0);
      this.decft = data.reduce(function(prev, cur: any) {
        return prev + cur.decft;
      }, 0);

      ///////////////////////////////////////
      this.janfa = data.reduce(function(prev, cur: any) {
        return prev + cur.janfa;
      }, 0);
      this.febfa = data.reduce(function(prev, cur: any) {
        return prev + cur.febfa;
      }, 0);
      this.marfa = data.reduce(function(prev, cur: any) {
        return prev + cur.marfa;
      }, 0);
      this.aprfa = data.reduce(function(prev, cur: any) {
        return prev + cur.aprfa;
      }, 0);
      this.mayfa = data.reduce(function(prev, cur: any) {
        return prev + cur.mayfa;
      }, 0);
      this.junfa = data.reduce(function(prev, cur: any) {
        return prev + cur.junfa;
      }, 0);
      this.julfa = data.reduce(function(prev, cur: any) {
        return prev + cur.julfa;
      }, 0);
      this.augfa = data.reduce(function(prev, cur: any) {
        return prev + cur.augfa;
      }, 0);
      this.sepfa = data.reduce(function(prev, cur: any) {
        return prev + cur.sepfa;
      }, 0);
      this.octfa = data.reduce(function(prev, cur: any) {
        return prev + cur.octfa;
      }, 0);
      this.novfa = data.reduce(function(prev, cur: any) {
        return prev + cur.novfa;
      }, 0);
      this.decfa = data.reduce(function(prev, cur: any) {
        return prev + cur.decfa;
      }, 0);

      ///////////////////////////////////////
      this.jandt = data.reduce(function(prev, cur: any) {
        return prev + cur.jandt;
      }, 0);
      this.febdt = data.reduce(function(prev, cur: any) {
        return prev + cur.febdt;
      }, 0);
      this.mardt = data.reduce(function(prev, cur: any) {
        return prev + cur.mardt;
      }, 0);
      this.aprdt = data.reduce(function(prev, cur: any) {
        return prev + cur.aprdt;
      }, 0);
      this.maydt = data.reduce(function(prev, cur: any) {
        return prev + cur.maydt;
      }, 0);
      this.jundt = data.reduce(function(prev, cur: any) {
        return prev + cur.jundt;
      }, 0);
      this.juldt = data.reduce(function(prev, cur: any) {
        return prev + cur.juldt;
      }, 0);
      this.augdt = data.reduce(function(prev, cur: any) {
        return prev + cur.augdt;
      }, 0);
      this.sepdt = data.reduce(function(prev, cur: any) {
        return prev + cur.sepdt;
      }, 0);
      this.octdt = data.reduce(function(prev, cur: any) {
        return prev + cur.octdt;
      }, 0);
      this.novdt = data.reduce(function(prev, cur: any) {
        return prev + cur.novdt;
      }, 0);
      this.decdt = data.reduce(function(prev, cur: any) {
        return prev + cur.decdt;
      }, 0);

      ///////////////////////////////////////
      this.janda = data.reduce(function(prev, cur: any) {
        return prev + cur.janda;
      }, 0);
      this.febda = data.reduce(function(prev, cur: any) {
        return prev + cur.febda;
      }, 0);
      this.marda = data.reduce(function(prev, cur: any) {
        return prev + cur.marda;
      }, 0);
      this.aprda = data.reduce(function(prev, cur: any) {
        return prev + cur.aprda;
      }, 0);
      this.mayda = data.reduce(function(prev, cur: any) {
        return prev + cur.mayda;
      }, 0);
      this.junda = data.reduce(function(prev, cur: any) {
        return prev + cur.junda;
      }, 0);
      this.julda = data.reduce(function(prev, cur: any) {
        return prev + cur.julda;
      }, 0);
      this.augda = data.reduce(function(prev, cur: any) {
        return prev + cur.augda;
      }, 0);
      this.sepda = data.reduce(function(prev, cur: any) {
        return prev + cur.sepda;
      }, 0);
      this.octda = data.reduce(function(prev, cur: any) {
        return prev + cur.octda;
      }, 0);
      this.novda = data.reduce(function(prev, cur: any) {
        return prev + cur.novda;
      }, 0);
      this.decda = data.reduce(function(prev, cur: any) {
        return prev + cur.decda;
      }, 0);

      console.log(this.janft);
      this.da_chartfin();
      console.log(data);
    });
  }

  da_chartfin() {
    this.da_finChart = new CanvasJS.Chart('da_finChart', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Financial Performance - Non-Commulative'
      },
      axisY: {
        title: 'Value in Peso',
        fontSize: 10
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 500000,
              userCallback: function(value: any) {
                value = value.toString();
                value = value.split(/(?=(?:...)*$)/);
                value = value.join('.');
                return 'Php' + value;
              }
            }
          }
        ]
      },
      legend: {
        cursor: 'pointer'
      },
      data: [
        {
          type: 'column',
          showInLegend: true,
          name: 'BED-1 Target',
          dataPoints: [
            { y: this.janft, label: 'Jan' },
            { y: this.febft, label: 'Feb' },
            { y: this.marft, label: 'Mar' },
            { y: this.aprft, label: 'Apr' },
            { y: this.mayft, label: 'May' },
            { y: this.junft, label: 'Jun' },
            { y: this.julft, label: 'Jul' },
            { y: this.augft, label: 'Aug' },
            { y: this.sepft, label: 'Sep' },
            { y: this.octft, label: 'Oct' },
            { y: this.novft, label: 'Nov' },
            { y: this.decft, label: 'Dec' }
          ]
        },
        {
          type: 'column',
          showInLegend: true,
          name: 'Actual Obligation',
          dataPoints: [
            { y: this.janfa, label: 'Jan' },
            { y: this.febfa, label: 'Feb' },
            { y: this.marfa, label: 'Mar' },
            { y: this.aprfa, label: 'Apr' },
            { y: this.mayfa, label: 'May' },
            { y: this.junfa, label: 'Jun' },
            { y: this.julfa, label: 'Jul' },
            { y: this.augfa, label: 'Aug' },
            { y: this.sepfa, label: 'Sep' },
            { y: this.octfa, label: 'Oct' },
            { y: this.novfa, label: 'Nov' },
            { y: this.decfa, label: 'Dec' }
          ]
        },
        {
          type: 'line',
          showInLegend: true,
          name: 'BED-3 Target',
          dataPoints: [
            { y: this.jandt, label: 'Jan' },
            { y: this.febdt, label: 'Feb' },
            { y: this.mardt, label: 'Mar' },
            { y: this.aprdt, label: 'Apr' },
            { y: this.maydt, label: 'May' },
            { y: this.jundt, label: 'Jun' },
            { y: this.juldt, label: 'Jul' },
            { y: this.augdt, label: 'Aug' },
            { y: this.sepdt, label: 'Sep' },
            { y: this.octdt, label: 'Oct' },
            { y: this.novdt, label: 'Nov' },
            { y: this.decdt, label: 'Dec' }
          ]
        },

        {
          type: 'line',
          showInLegend: true,
          name: 'Actual Disbursement',
          dataPoints: [
            { y: this.janda, label: 'Jan' },
            { y: this.febda, label: 'Feb' },
            { y: this.marda, label: 'Mar' },
            { y: this.aprda, label: 'Apr' },
            { y: this.mayda, label: 'May' },
            { y: this.junda, label: 'Jun' },
            { y: this.julda, label: 'Jul' },
            { y: this.augda, label: 'Aug' },
            { y: this.sepda, label: 'Sep' },
            { y: this.octda, label: 'Oct' },
            { y: this.novda, label: 'Nov' },
            { y: this.decda, label: 'Dec' }
          ]
        }
      ]
    });

    this.da_finChart.render();
  }

  render() {
    if (!this.show) {
      this.da_finChart.options.axisY = {
        title: 'Value in Peso',
        fontSize: 10
      };
      this.da_finChart.options.title = {
        text: 'Financial Performance - Commulative'
      };
      this.da_finChart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'BED-1 Target',
          dataPoints: [
            { y: this.janft, label: 'Jan' },
            { y: this.febft + this.janft, label: 'Feb' },
            { y: this.marft + this.febft + this.janft, label: 'Mar' },
            {
              y: this.aprft + this.marft + this.febft + this.janft,
              label: 'Apr'
            },
            {
              y: this.mayft + this.aprft + this.marft + this.febft + this.janft,
              label: 'May'
            },
            {
              y:
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Jun'
            },
            {
              y:
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Jul'
            },
            {
              y:
                this.augft +
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Aug'
            },
            {
              y:
                this.sepft +
                this.augft +
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Sep'
            },
            {
              y:
                this.octft +
                this.sepft +
                this.augft +
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Oct'
            },
            {
              y:
                this.novft +
                this.octft +
                this.sepft +
                this.augft +
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Nov'
            },
            {
              y:
                this.decft +
                this.novft +
                this.octft +
                this.sepft +
                this.augft +
                this.julft +
                this.junft +
                this.mayft +
                this.aprft +
                this.marft +
                this.febft +
                this.janft,
              label: 'Dec'
            }
          ]
        },
        {
          type: 'column',
          showInLegend: true,
          name: 'Actual Obligation',
          dataPoints: [
            { y: this.janfa, label: 'Jan' },
            { y: this.febfa + this.janfa, label: 'Feb' },
            { y: this.marfa + this.febfa + this.janfa, label: 'Mar' },
            {
              y: this.aprfa + this.marfa + this.febfa + this.janfa,
              label: 'Apr'
            },
            {
              y: this.mayfa + this.aprfa + this.marfa + this.febfa + this.janfa,
              label: 'May'
            },
            {
              y:
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Jun'
            },
            {
              y:
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Jul'
            },
            {
              y:
                this.augfa +
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Aug'
            },
            {
              y:
                this.sepfa +
                this.augfa +
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Sep'
            },
            {
              y:
                this.octfa +
                this.sepfa +
                this.augfa +
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Oct'
            },
            {
              y:
                this.novfa +
                this.octfa +
                this.sepfa +
                this.augfa +
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Nov'
            },
            {
              y:
                this.decfa +
                this.novfa +
                this.octfa +
                this.sepfa +
                this.augfa +
                this.julfa +
                this.junfa +
                this.mayfa +
                this.aprfa +
                this.marfa +
                this.febfa +
                this.janfa,
              label: 'Dec'
            }
          ]
        },
        {
          type: 'line',
          showInLegend: true,
          name: 'BED-3 Target',
          dataPoints: [
            { y: this.jandt, label: 'Jan' },
            { y: this.febdt + this.jandt, label: 'Feb' },
            { y: this.mardt + this.febdt + this.jandt, label: 'Mar' },
            {
              y: this.aprdt + this.mardt + this.febdt + this.jandt,
              label: 'Apr'
            },
            {
              y: this.maydt + this.aprdt + this.mardt + this.febdt + this.jandt,
              label: 'May'
            },
            {
              y:
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Jun'
            },
            {
              y:
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Jul'
            },
            {
              y:
                this.augdt +
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Aug'
            },
            {
              y:
                this.sepdt +
                this.augdt +
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Sep'
            },
            {
              y:
                this.octdt +
                this.sepdt +
                this.augdt +
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Oct'
            },
            {
              y:
                this.novdt +
                this.octdt +
                this.sepdt +
                this.augdt +
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Nov'
            },
            {
              y:
                this.decdt +
                this.novdt +
                this.octdt +
                this.sepdt +
                this.augdt +
                this.juldt +
                this.jundt +
                this.maydt +
                this.aprdt +
                this.mardt +
                this.febdt +
                this.jandt,
              label: 'Dec'
            }
          ]
        },

        {
          type: 'line',
          showInLegend: true,
          name: 'Actual Disbursement',
          dataPoints: [
            { y: this.janda, label: 'Jan' },
            { y: this.febda + this.janda, label: 'Feb' },
            { y: this.marda + this.febda + this.janda, label: 'Mar' },
            {
              y: this.aprda + this.marda + this.febda + this.janda,
              label: 'Apr'
            },
            {
              y: this.mayda + this.aprda + this.marda + this.febda + this.janda,
              label: 'May'
            },
            {
              y:
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Jun'
            },
            {
              y:
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Jul'
            },
            {
              y:
                this.augda +
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Aug'
            },
            {
              y:
                this.sepda +
                this.augda +
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Sep'
            },
            {
              y:
                this.octda +
                this.sepda +
                this.augda +
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Oct'
            },
            {
              y:
                this.novda +
                this.octda +
                this.sepda +
                this.augda +
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Nov'
            },
            {
              y:
                this.decda +
                this.novda +
                this.octda +
                this.sepda +
                this.augda +
                this.julda +
                this.junda +
                this.mayda +
                this.aprda +
                this.marda +
                this.febda +
                this.janda,
              label: 'Dec'
            }
          ]
        }
      ];
    } else {
      this.da_finChart.options.axisY = {
        title: 'Value in Peso',
        fontSize: 10
      };
      this.da_finChart.options.title = {
        text: 'Financial Performance - Non-Commulative'
      };
      this.da_finChart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'BED-1 Target',
          dataPoints: [
            { y: this.janft, label: 'Jan' },
            { y: this.febft, label: 'Feb' },
            { y: this.marft, label: 'Mar' },
            { y: this.aprft, label: 'Apr' },
            { y: this.mayft, label: 'May' },
            { y: this.junft, label: 'Jun' },
            { y: this.julft, label: 'Jul' },
            { y: this.augft, label: 'Aug' },
            { y: this.sepft, label: 'Sep' },
            { y: this.octft, label: 'Oct' },
            { y: this.novft, label: 'Nov' },
            { y: this.decft, label: 'Dec' }
          ]
        },
        {
          type: 'column',
          showInLegend: true,
          name: 'Actual Obligation',
          dataPoints: [
            { y: this.janfa, label: 'Jan' },
            { y: this.febfa, label: 'Feb' },
            { y: this.marfa, label: 'Mar' },
            { y: this.aprfa, label: 'Apr' },
            { y: this.mayfa, label: 'May' },
            { y: this.junfa, label: 'Jun' },
            { y: this.julfa, label: 'Jul' },
            { y: this.augfa, label: 'Aug' },
            { y: this.sepfa, label: 'Sep' },
            { y: this.octfa, label: 'Oct' },
            { y: this.novfa, label: 'Nov' },
            { y: this.decfa, label: 'Dec' }
          ]
        },
        {
          type: 'line',
          showInLegend: true,
          name: 'BED-3 Target',
          dataPoints: [
            { y: this.jandt, label: 'Jan' },
            { y: this.febdt, label: 'Feb' },
            { y: this.mardt, label: 'Mar' },
            { y: this.aprdt, label: 'Apr' },
            { y: this.maydt, label: 'May' },
            { y: this.jundt, label: 'Jun' },
            { y: this.juldt, label: 'Jul' },
            { y: this.augdt, label: 'Aug' },
            { y: this.sepdt, label: 'Sep' },
            { y: this.octdt, label: 'Oct' },
            { y: this.novdt, label: 'Nov' },
            { y: this.decdt, label: 'Dec' }
          ]
        },

        {
          type: 'line',
          showInLegend: true,
          name: 'Actual Disbursement',
          dataPoints: [
            { y: this.janda, label: 'Jan' },
            { y: this.febda, label: 'Feb' },
            { y: this.marda, label: 'Mar' },
            { y: this.aprda, label: 'Apr' },
            { y: this.mayda, label: 'May' },
            { y: this.junda, label: 'Jun' },
            { y: this.julda, label: 'Jul' },
            { y: this.augda, label: 'Aug' },
            { y: this.sepda, label: 'Sep' },
            { y: this.octda, label: 'Oct' },
            { y: this.novda, label: 'Nov' },
            { y: this.decda, label: 'Dec' }
          ]
        }
      ];
    }

    this.da_finChart.render();
  }

  fin_percentage() {
    if (!this.show2) {
      this.da_finChart.options.axisY = {
        title: 'Percentage',
        fontSize: 10,
        minimum: 0,
        maximum: 120
      };
      this.da_finChart.options.title = {
        text: 'Financial Performance - Percentage Annual'
      };
      this.da_finChart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'Actual Obligation',
          dataPoints: [
            { y: (this.janfa / this.fin_total) * 100, label: 'Jan' },
            {
              y: ((this.febfa + this.janfa) / this.fin_total) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.marfa + this.febfa + this.janfa) / this.fin_total) * 100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprfa + this.marfa + this.febfa + this.janfa) /
                  this.fin_total) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novfa +
                  this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decfa +
                  this.novfa +
                  this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  this.fin_total) *
                100,
              label: 'Dec'
            }
          ]
        },
        {
          type: 'column',
          showInLegend: true,
          name: 'Disbursement',
          dataPoints: [
            { y: (this.janda / this.dis_total) * 100, label: 'Jan' },
            {
              y: ((this.febda + this.janda) / this.dis_total) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.marda + this.febda + this.janda) / this.dis_total) * 100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprda + this.marda + this.febda + this.janda) /
                  this.dis_total) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novda +
                  this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decda +
                  this.novda +
                  this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  this.dis_total) *
                100,
              label: 'Dec'
            }
          ]
        },

        {
          type: 'line',
          showInLegend: true,
          name: 'BED-1 Target',
          dataPoints: [
            { y: (this.janft / this.fin_total) * 100, label: 'Jan' },
            {
              y: ((this.febft + this.janft) / this.fin_total) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.marft + this.febft + this.janft) / this.fin_total) * 100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprft + this.marft + this.febft + this.janft) /
                  this.fin_total) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augft +
                  this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepft +
                  this.augft +
                  this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octft +
                  this.sepft +
                  this.augft +
                  this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novft +
                  this.octft +
                  this.sepft +
                  this.augft +
                  this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decft +
                  this.novft +
                  this.octft +
                  this.sepft +
                  this.augft +
                  this.julft +
                  this.junft +
                  this.mayft +
                  this.aprft +
                  this.marft +
                  this.febft +
                  this.janft) /
                  this.fin_total) *
                100,
              label: 'Dec'
            }
          ]
        },
        {
          type: 'line',
          showInLegend: true,
          name: 'BED-3 Target',
          dataPoints: [
            { y: (this.jandt / this.dis_total) * 100, label: 'Jan' },
            {
              y: ((this.febdt + this.jandt) / this.dis_total) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.mardt + this.febdt + this.jandt) / this.dis_total) * 100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprdt + this.mardt + this.febdt + this.jandt) /
                  this.dis_total) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augdt +
                  this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepdt +
                  this.augdt +
                  this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octdt +
                  this.sepdt +
                  this.augdt +
                  this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novdt +
                  this.octdt +
                  this.sepdt +
                  this.augdt +
                  this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decdt +
                  this.novdt +
                  this.octdt +
                  this.sepdt +
                  this.augdt +
                  this.juldt +
                  this.jundt +
                  this.maydt +
                  this.aprdt +
                  this.mardt +
                  this.febdt +
                  this.jandt) /
                  this.dis_total) *
                100,
              label: 'Dec'
            }
          ]
        }
      ];

      this.da_finChart.render();
    } else {
      this.da_finChart.options.axisY = {
        title: 'Percentage',
        fontSize: 10,
        minimum: 0,
        maximum: 120
      };
      this.da_finChart.options.title = {
        text: 'Financial Performance - Percentage Monthly'
      };
      this.da_finChart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'Actual Obligation',
          dataPoints: [
            { y: (this.janfa / this.janft) * 100, label: 'Jan' },
            {
              y: ((this.febfa + this.janfa) / (this.febft + this.janft)) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.marfa + this.febfa + this.janfa) /
                  (this.marft + this.febft + this.janft)) *
                100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprfa + this.marfa + this.febfa + this.janfa) /
                  (this.aprft + this.marft + this.febft + this.janft)) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.augft +
                    this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.sepft +
                    this.augft +
                    this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.octft +
                    this.sepft +
                    this.augft +
                    this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novfa +
                  this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.novft +
                    this.octft +
                    this.sepft +
                    this.augft +
                    this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decfa +
                  this.novfa +
                  this.octfa +
                  this.sepfa +
                  this.augfa +
                  this.julfa +
                  this.junfa +
                  this.mayfa +
                  this.aprfa +
                  this.marfa +
                  this.febfa +
                  this.janfa) /
                  (this.decft +
                    this.novft +
                    this.octft +
                    this.sepft +
                    this.augft +
                    this.julft +
                    this.junft +
                    this.mayft +
                    this.aprft +
                    this.marft +
                    this.febft +
                    this.janft)) *
                100,
              label: 'Dec'
            }
          ]
        },
        {
          type: 'column',
          showInLegend: true,
          name: 'Disbursement',
          dataPoints: [
            { y: (this.janda / this.jandt) * 100, label: 'Jan' },
            {
              y: ((this.febda + this.janda) / (this.febdt + this.jandt)) * 100,
              label: 'Feb'
            },
            {
              y:
                ((this.marda + this.febda + this.janda) /
                  (this.mardt + this.febdt + this.jandt)) *
                100,
              label: 'Mar'
            },
            {
              y:
                ((this.aprda + this.marda + this.febda + this.janda) /
                  (this.aprdt + this.mardt + this.febdt + this.jandt)) *
                100,
              label: 'Apr'
            },
            {
              y:
                ((this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'May'
            },
            {
              y:
                ((this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Jun'
            },
            {
              y:
                ((this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Jul'
            },
            {
              y:
                ((this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.augdt +
                    this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Aug'
            },
            {
              y:
                ((this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.sepdt +
                    this.augdt +
                    this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Sep'
            },
            {
              y:
                ((this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.octdt +
                    this.sepdt +
                    this.augdt +
                    this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Oct'
            },
            {
              y:
                ((this.novda +
                  this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.novdt +
                    this.octdt +
                    this.sepdt +
                    this.augdt +
                    this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Nov'
            },
            {
              y:
                ((this.decda +
                  this.novda +
                  this.octda +
                  this.sepda +
                  this.augda +
                  this.julda +
                  this.junda +
                  this.mayda +
                  this.aprda +
                  this.marda +
                  this.febda +
                  this.janda) /
                  (this.decdt +
                    this.novdt +
                    this.octdt +
                    this.sepdt +
                    this.augdt +
                    this.juldt +
                    this.jundt +
                    this.maydt +
                    this.aprdt +
                    this.mardt +
                    this.febdt +
                    this.jandt)) *
                100,
              label: 'Dec'
            }
          ]
        }
      ];

      this.da_finChart.render();
    }
  }

  ngOnInit() {}

  routeProgram(params) {
    console.log(params.data);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        prog: params.data.name,
        pid: params.data.pid
      }
    };
    this.router.navigate(['dashboard/dashboard-program'], navigationExtras);
  }

  logsBed1(l) {
    console.log(l);
    this.dialog.open(logDialog, {
      data: { beds: 1, pid: l.pid }
    });
  }

  logsBed2(l) {
    console.log(l);
    this.dialog.open(logDialog, {
      data: { beds: 2, pid: l.pid }
    });
  }

  logsBed3(l) {
    console.log(l);
    this.dialog.open(logDialog, {
      data: { beds: 3, pid: l.pid }
    });
  }
}

import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { PmisService } from '../../../core/services/pmis.service';


@Component({
  selector: 'anms-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss']
})
export class LockedComponent implements OnInit {

  public toggle(event: any, index, month) {
console.log(this.locked[index].checked);
    let status = this.getReverseStatus(this.locked[index].checked);
    let proceed = confirm(`Are you sure you want to ${status} the month of ${month}?`);
    if (this.locked[index].checked && !proceed ||
      this.locked[index].checked === false && !proceed) {
        event.preventDefault();
    }else{
      this.locked[index].checked = !this.locked[index].checked;
      this.cd.markForCheck();
    }
    // if (this.hide && proceed) {
      //   this.locked[index].status = event.checked;
      //   this.cd.markForCheck();
      // } else {
      //   if(event.checked){
      //     alert(event.checked);
      //     event.source.checked = false;
      //     event.checked = false;
      //   }else{
      //     alert(event.checked);
      //     event.source.checked = true;
      //     event.checked = true;
      //   }   
      // }

  }

  locked: any;

  getStatus(isStatus) {
    return (isStatus ? 'Opened' : 'Closed');
  }
  getReverseStatus(isStatus) {
    return (!isStatus ? 'Opened' : 'Closed');
  }

  constructor(private mfoService: PmisService, private cd: ChangeDetectorRef) {
    this.mfoService.month_locked().subscribe(data => {
      data.forEach(element => {
        element.checked = Boolean(element.checked);
      });
      this.locked = data;
      this.cd.markForCheck();
      console.log(this.locked);
    })
   }

  ngOnInit(): void {

  }

}

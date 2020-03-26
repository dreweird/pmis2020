import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'anms-bydistrict',
  templateUrl: './bydistrict.component.html',
  styleUrls: ['./bydistrict.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BydistrictComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

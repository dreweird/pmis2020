import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BymunicipalComponent } from './bymunicipal.component';

describe('BymunicipalComponent', () => {
  let component: BymunicipalComponent;
  let fixture: ComponentFixture<BymunicipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BymunicipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BymunicipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

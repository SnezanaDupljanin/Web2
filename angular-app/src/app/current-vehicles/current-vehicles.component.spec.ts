import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentVehiclesComponent } from './current-vehicles.component';

describe('CurrentVehiclesComponent', () => {
  let component: CurrentVehiclesComponent;
  let fixture: ComponentFixture<CurrentVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

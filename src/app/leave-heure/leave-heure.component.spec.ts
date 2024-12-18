import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveHeureComponent } from './leave-heure.component';

describe('LeaveHeureComponent', () => {
  let component: LeaveHeureComponent;
  let fixture: ComponentFixture<LeaveHeureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveHeureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveHeureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

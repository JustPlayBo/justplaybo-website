import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustainAdComponent } from './sustain-ad.component';

describe('SustainAdComponent', () => {
  let component: SustainAdComponent;
  let fixture: ComponentFixture<SustainAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustainAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustainAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

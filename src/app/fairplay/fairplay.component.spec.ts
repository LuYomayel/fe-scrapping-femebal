import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairPlayComponent } from './fairplay.component';

describe('TableComponent', () => {
  let component: FairPlayComponent;
  let fixture: ComponentFixture<FairPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FairPlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FairPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

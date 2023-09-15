import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameAdjustComponent } from './frame-adjust.component';

describe('FrameAdjustComponent', () => {
  let component: FrameAdjustComponent;
  let fixture: ComponentFixture<FrameAdjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameAdjustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WetherWidgetComponent } from './wether-widget.component';

describe('WetherWidgetComponent', () => {
  let component: WetherWidgetComponent;
  let fixture: ComponentFixture<WetherWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WetherWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WetherWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

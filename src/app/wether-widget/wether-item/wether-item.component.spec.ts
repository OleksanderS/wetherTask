import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WetherItemComponent } from './wether-item.component';

describe('WetherItemComponent', () => {
  let component: WetherItemComponent;
  let fixture: ComponentFixture<WetherItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WetherItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WetherItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfcmComponent } from './pfcm.component';

describe('PfcmComponent', () => {
  let component: PfcmComponent;
  let fixture: ComponentFixture<PfcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfcmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

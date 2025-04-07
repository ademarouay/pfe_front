import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemboursementCnamComponent } from './remboursement-cnam.component';

describe('RemboursementCnamComponent', () => {
  let component: RemboursementCnamComponent;
  let fixture: ComponentFixture<RemboursementCnamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemboursementCnamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemboursementCnamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

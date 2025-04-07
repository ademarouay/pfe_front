import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTestComponent } from './email-test.component';

describe('EmailTestComponent', () => {
  let component: EmailTestComponent;
  let fixture: ComponentFixture<EmailTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

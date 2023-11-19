import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormEditComponent } from './review-form-edit.component';

describe('ReviewFormEditComponent', () => {
  let component: ReviewFormEditComponent;
  let fixture: ComponentFixture<ReviewFormEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewFormEditComponent]
    });
    fixture = TestBed.createComponent(ReviewFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoArticleComponent } from './upload-photo-article.component';

describe('UploadPhotoArticleComponent', () => {
  let component: UploadPhotoArticleComponent;
  let fixture: ComponentFixture<UploadPhotoArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPhotoArticleComponent]
    });
    fixture = TestBed.createComponent(UploadPhotoArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

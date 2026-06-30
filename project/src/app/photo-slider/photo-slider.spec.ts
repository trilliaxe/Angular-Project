import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSliderComponent } from './photo-slider';

describe('Slider', () => {
  let component: PhotoSliderComponent;
  let fixture: ComponentFixture<PhotoSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoSliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoSliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

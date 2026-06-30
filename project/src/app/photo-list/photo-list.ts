import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Photo } from '../models/photo.model';
import { PhotoCardComponent } from '../photo-card/photo-card';
import { PhotoSliderComponent } from '../photo-slider/photo-slider';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, PhotoCardComponent, PhotoSliderComponent],
  templateUrl: './photo-list.html',
  styleUrls: ['./photo-list.css']
})
export class PhotoListComponent implements OnChanges {
  @Input() photos: Photo[] = [];
  @Input() loading = false;
  @Input() totalResults = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() viewMode: 'grid' | 'slider' = 'grid';
  @Input() displaySize: string = 'm';

  @Output() photoSelected = new EventEmitter<Photo>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'slider'>();

  // Pour le mode liste
  listMode: 'grid' | 'list' = 'grid';

  // Slider
  sliderIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photos']) {
      this.sliderIndex = 0;
    }
  }

  onPhotoClick(photo: Photo): void {
    this.photoSelected.emit(photo);
  }

  // Slider navigation
  prevSlide(): void {
    if (this.sliderIndex > 0) {
      this.sliderIndex--;
    } else {
      this.sliderIndex = this.photos.length - 1;
    }
  }

  nextSlide(): void {
    if (this.sliderIndex < this.photos.length - 1) {
      this.sliderIndex++;
    } else {
      this.sliderIndex = 0;
    }
  }

  goToSlide(index: number): void {
    this.sliderIndex = index;
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  get visiblePages(): number[] {
    const range = 2;
    const pages: number[] = [];
    for (
      let i = Math.max(1, this.currentPage - range);
      i <= Math.min(this.totalPages, this.currentPage + range);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  }

  get currentPhoto(): Photo | null {
    return this.photos[this.sliderIndex] || null;
  }

  toggleListMode(): void {
    this.listMode = this.listMode === 'grid' ? 'list' : 'grid';
  }

  setViewMode(mode: 'grid' | 'slider'): void {
    this.viewModeChange.emit(mode);
    if (mode === 'slider') {
      this.sliderIndex = 0;
    }
  }
}

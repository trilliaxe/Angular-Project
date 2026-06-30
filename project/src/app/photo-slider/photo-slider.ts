import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Photo } from '../models/photo.model';
import { FlickrService } from '../services/flickr';

@Component({
  selector: 'app-photo-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-slider.html',
  styleUrls: ['./photo-slider.css']
})
export class PhotoSliderComponent implements OnChanges {
  @Input() photos: Photo[] = [];
  @Output() photoClick = new EventEmitter<Photo>();

  currentIndex = 0;

  constructor(private flickrService: FlickrService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photos']) {
      this.currentIndex = 0;
    }
  }

  get currentPhoto(): Photo | null {
    return this.photos[this.currentIndex] || null;
  }

  get currentImageUrl(): string {
    if (!this.currentPhoto) return '';
    return this.currentPhoto.url_l ||
      this.currentPhoto.url_m ||
      this.flickrService.buildPhotoUrl(this.currentPhoto, 'm');
  }

  prev(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.photos.length - 1
      : this.currentIndex - 1;
  }

  next(): void {
    this.currentIndex = this.currentIndex === this.photos.length - 1
      ? 0
      : this.currentIndex + 1;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  onPhotoClick(): void {
    if (this.currentPhoto) {
      this.photoClick.emit(this.currentPhoto);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'ArrowRight') this.next();
  }

  get uploadDate(): string {
    if (!this.currentPhoto?.dateupload) return '';
    return new Date(parseInt(this.currentPhoto.dateupload) * 1000)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

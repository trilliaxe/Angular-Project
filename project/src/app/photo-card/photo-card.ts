import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Photo } from '../models/photo.model';
import { FlickrService } from '../services/flickr';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-card.html',
  styleUrls: ['./photo-card.css']
})
export class PhotoCardComponent {
  @Input() photo!: Photo;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() displaySize: string = 'm';
  @Output() photoClick = new EventEmitter<Photo>();

  imageError = false;

  constructor(private flickrService: FlickrService) {}

  get thumbnailUrl(): string {
    return this.photo.url_s ||
      this.flickrService.buildPhotoUrl(this.photo, 's');
  }

  get mediumUrl(): string {
    return this.photo.url_m ||
      this.flickrService.buildPhotoUrl(this.photo, 'm');
  }

  // Renvoie l'URL de l'image selon la taille d'affichage choisie dans les filtres
  get displayUrl(): string {
    if (this.displaySize === 's') {
      return this.photo.url_s || this.flickrService.buildPhotoUrl(this.photo, 's');
    }
    if (this.displaySize === 'l') {
      return this.photo.url_l || this.flickrService.buildPhotoUrl(this.photo, 'l');
    }
    return this.photo.url_m || this.flickrService.buildPhotoUrl(this.photo, 'm');
  }

  get uploadDate(): string {
    if (!this.photo.dateupload) return '';
    return new Date(parseInt(this.photo.dateupload) * 1000)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  get truncatedTitle(): string {
    if (!this.photo.title) return 'Sans titre';
    return this.photo.title.length > 60
      ? this.photo.title.substring(0, 60) + '…'
      : this.photo.title;
  }

  onImageError(): void {
    this.imageError = true;
  }

  onClick(): void {
    this.photoClick.emit(this.photo);
  }
}

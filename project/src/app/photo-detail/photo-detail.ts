import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Photo, PhotoInfo, Comment } from '../models/photo.model';
import { FlickrService } from '../services/flickr';

@Component({
  selector: 'app-photo-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-detail.html',
  styleUrls: ['./photo-detail.css']
})
export class PhotoDetailComponent implements OnChanges {
  @Input() photo: Photo | null = null;
  @Output() close = new EventEmitter<void>();

  photoInfo: PhotoInfo | null = null;
  comments: Comment[] = [];
  authorPhotos: Photo[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'info' | 'comments' | 'author' = 'info';

  constructor(private flickrService: FlickrService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photo'] && this.photo) {
      this.loadPhotoDetails();
    }
  }

  loadPhotoDetails(): void {
    if (!this.photo) return;
    this.loading = true;
    this.error = null;
    this.photoInfo = null;
    this.comments = [];
    this.authorPhotos = [];

    this.flickrService.getPhotoDetails(
      this.photo.id,
      this.photo.secret,
      this.photo.owner
    ).subscribe({
      next: ({ info, comments, authorPhotos }) => {
        this.photoInfo = info;
        this.comments = comments;
        this.authorPhotos = authorPhotos.filter(p => p.id !== this.photo!.id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails. Vérifiez votre clé API.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get fullImageUrl(): string {
    if (!this.photo) return '';
    return this.photo.url_l ||
      this.photo.url_m ||
      this.flickrService.buildPhotoUrl(this.photo, 'l');
  }

  get authorAvatarUrl(): string {
    if (!this.photoInfo?.owner) return '';
    return this.flickrService.buildAvatarUrl(
      this.photoInfo.owner.iconserver,
      this.photoInfo.owner.iconfarm,
      this.photoInfo.owner.nsid
    );
  }

  get photoPageUrl(): string {
    if (!this.photo || !this.photoInfo) return '#';
    return this.photoInfo.urls?.url?.[0]?._content || '#';
  }

  get hasLocation(): boolean {
    return !!(this.photoInfo?.location?.latitude || this.photo?.latitude);
  }

  get latitude(): string {
    return this.photoInfo?.location?.latitude || this.photo?.latitude || '';
  }

  get longitude(): string {
    return this.photoInfo?.location?.longitude || this.photo?.longitude || '';
  }

  get mapUrl(): string {
    if (!this.hasLocation) return '';
    return `https://www.openstreetmap.org/?mlat=${this.latitude}&mlon=${this.longitude}&zoom=12`;
  }

  get formattedDate(): string {
    if (!this.photoInfo?.dates?.taken) return '';
    return new Date(this.photoInfo.dates.taken)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  get locationText(): string {
    const location = this.photoInfo?.location;
    if (!location) {
      return '';
    }

    return [location.locality?._content, location.region?._content, location.country?._content]
      .filter((value) => !!value)
      .join(', ');
  }

  formatCommentDate(dateCreate: string): string {
    return new Date(parseInt(dateCreate) * 1000)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getAuthorPhotoUrl(photo: Photo): string {
    return photo.url_s || this.flickrService.buildPhotoUrl(photo, 's');
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  openAuthorPhoto(photo: Photo): void {
    window.open(`https://www.flickr.com/photos/${photo.owner}/${photo.id}`, '_blank');
  }
}

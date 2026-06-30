import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Photo, SearchFilters } from './models/photo.model';
import { FlickrService } from './services/flickr';
import { PhotoDetailComponent } from './photo-detail/photo-detail';
import { PhotoListComponent } from './photo-list/photo-list';
import { SearchBar } from './search-bar/search-bar';
import { SearchFiltersComponent } from './search-filters/search-filters';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchBar, SearchFiltersComponent, PhotoListComponent, PhotoDetailComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  photos: Photo[] = [];
  loading = false;
  totalResults = 0;
  currentPage = 1;
  totalPages = 0;
  viewMode: 'grid' | 'slider' = 'grid';
  selectedPhoto: Photo | null = null;
  hasSearched = false;

  filters: SearchFilters = {
    text: '',
    size: 'm',
    tags: '',
    sort: 'relevance',
    minUploadDate: '',
    maxUploadDate: '',
    contentType: '1',
    safeSearch: '1',
    inGallery: false,
    extras: 'url_s,url_m,url_l,date_upload,date_taken,owner_name,tags,views,description,geo'
  };

  constructor(private flickrService: FlickrService) {}

  onSearchSubmit(text: string): void {
    this.filters.text = text;
    this.currentPage = 1;
    this.search();
  }

  onFiltersChange(partialFilters: Partial<SearchFilters>): void {
    this.filters = { ...this.filters, ...partialFilters };
    if (this.filters.text) {
      this.currentPage = 1;
      this.search();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.search();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPhotoSelected(photo: Photo): void {
    this.selectedPhoto = photo;
  }

  onDetailClose(): void {
    this.selectedPhoto = null;
  }

  onViewModeChange(mode: 'grid' | 'slider'): void {
    this.viewMode = mode;
  }

  private search(): void {
    if (!this.filters.text.trim()) return;
    this.loading = true;
    this.hasSearched = true;

    this.flickrService.searchPhotos(this.filters, this.currentPage).subscribe({
      next: (result) => {
        this.photos = result.photos.photo;
        this.totalResults = parseInt(result.photos.total);
        this.totalPages = Math.min(result.photos.pages, 50); // API Flickr limite à ~50 pages
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de recherche:', err);
        this.loading = false;
        this.photos = [];
      }
    });
  }
}

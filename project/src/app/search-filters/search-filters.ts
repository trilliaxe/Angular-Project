import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchFilters } from '../models/photo.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-filters.html',
  styleUrls: ['./search-filters.css']
})
export class SearchFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<Partial<SearchFilters>>();

  filtersForm!: FormGroup;
  panelOpen = false;

  // Options de taille d'affichage des photos
  sizeOptions = [
    { value: 's', label: 'Petite' },
    { value: 'm', label: 'Moyenne' },
    { value: 'l', label: 'Grande' },
  ];

  // Options de tri pour les résultats de recherche
  sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'date-posted-desc', label: 'Plus récent' },
    { value: 'date-posted-asc', label: 'Plus ancien' },
    { value: 'date-taken-desc', label: 'Date de prise (récent)' },
    { value: 'date-taken-asc', label: 'Date de prise (ancien)' },
    { value: 'interestingness-desc', label: 'Intérêt ↓' },
    { value: 'interestingness-asc', label: 'Intérêt ↑' },
  ];

  // Types de contenu pour filtrer les résultats
  contentTypes = [
    { value: '1', label: 'Photos seulement' },
    { value: '2', label: 'Captures d\'écran' },
    { value: '3', label: 'Autres' },
    { value: '4', label: 'Tout' },
  ];

  // Options de filtrage de contenu (safeSearch)
  safeSearchOptions = [
    { value: '1', label: 'Sûr' },
    { value: '2', label: 'Modéré' },
    { value: '3', label: 'Non restreint (NSFW)' },
  ];

  constructor(private fb: FormBuilder) {}

  // Initialiser le formulaire de filtres
  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      size: ['m'],
      sort: ['relevance'],
      minUploadDate: [''],
      maxUploadDate: [''],
      contentType: ['1'],
      safeSearch: ['1'],
      tags: [''],
      inGallery: [false],
    });

    this.filtersForm.valueChanges.subscribe(values => {
      this.filtersChange.emit(values);
    });
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }

  // Réinitialiser tous les filtres
  resetFilters(): void {
    this.filtersForm.reset({
      size: 'm',
      sort: 'relevance',
      minUploadDate: '',
      maxUploadDate: '',
      contentType: '1',
      safeSearch: '1',
      tags: '',
      inGallery: false,
    });
  }

  // Calculer le nombre de filtres actifs
  get activeFiltersCount(): number {
    const v = this.filtersForm.value;
    let count = 0;
    if (v.size !== 'm') count++;
    if (v.sort !== 'relevance') count++;
    if (v.minUploadDate) count++;
    if (v.maxUploadDate) count++;
    if (v.contentType !== '1') count++;
    if (v.safeSearch !== '1') count++;
    if (v.tags) count++;
    if (v.inGallery) count++;
    return count;
  }
}

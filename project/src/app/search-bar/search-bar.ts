import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit {
  // Événement émis lorsque l'utilisateur soumet la recherche
  @Output() searchSubmit = new EventEmitter<string>();
  // Événement émis à chaque changement de valeur dans la barre de recherche
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && value.trim().length >= 2) {
        this.searchChange.emit(value.trim());
      }
    });
  }

  onSubmit(): void {
    const value = this.searchControl.value?.trim();
    if (value) {
      this.searchSubmit.emit(value);
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}

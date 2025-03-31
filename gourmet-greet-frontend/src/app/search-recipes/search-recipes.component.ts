import { Component } from '@angular/core';

@Component({
  selector: 'app-search-recipes',
  imports: [],
  templateUrl: './search-recipes.component.html',
  styleUrl: './search-recipes.component.css',
})
export class SearchRecipesComponent {
  showAdvancedSearch: boolean = false;

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
}

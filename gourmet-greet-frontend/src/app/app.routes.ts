import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';

export const routes: Routes = [
  // {
  //   // path: 'login',
  //   // component: LoginPageComponent
  // },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailsComponent,
  },
  {
    path: 'search',
    component: SearchRecipesComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user components/user-profile/user-profile.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'recipes/add',
    component: RecipeFormComponent
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
    path: 'profile/:id',
    component: UserProfileComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

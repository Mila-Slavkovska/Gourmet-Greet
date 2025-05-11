import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user components/user-profile/user-profile.component';
import { AdminDashboardComponent } from './user components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './user components/admin-users/admin-users.component';
import { AdminRequestsComponent } from './user components/admin-requests/admin-requests.component';
import { AdminCategoriesComponent } from './user components/admin-categories/admin-categories.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { AdminProfileComponent } from './user components/admin-profile/admin-profile.component';
import { AuthGuard } from './auth.guard';

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
    canActivate: [AuthGuard],
    data: { roles: ['CHEF'] },
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
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    component: AdminDashboardComponent,
    children: [
      {path: 'profile', component: AdminProfileComponent},
      {path: 'users', component: AdminUsersComponent},
      {path: 'requests', component: AdminRequestsComponent},
      {path: 'categories', component: AdminCategoriesComponent},
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

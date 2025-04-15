import { Component } from '@angular/core';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserRecipesComponent } from '../user-recipes/user-recipes.component';

@Component({
  selector: 'app-user-profile',
  imports: [UserDetailsComponent, UserRecipesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

}

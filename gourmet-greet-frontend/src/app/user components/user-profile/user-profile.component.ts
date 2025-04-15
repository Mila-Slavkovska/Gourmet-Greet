import { Component, inject } from '@angular/core';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserRecipesComponent } from '../user-recipes/user-recipes.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-profile',
  imports: [UserDetailsComponent, UserRecipesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  authService = inject(AuthService)
  user?: User

  ngOnInit(): void {
    this.authService.setUser()
    this.user = this.authService.getUser() || undefined
  }
}

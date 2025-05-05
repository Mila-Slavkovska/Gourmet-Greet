import { Component, inject } from '@angular/core';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserRecipesComponent } from '../user-recipes/user-recipes.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [UserDetailsComponent, UserRecipesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  authService = inject(AuthService)
  httpClient = inject(HttpClient)
  route:ActivatedRoute = inject(ActivatedRoute)

  userService = inject(UserService)
  user?: User | null

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe((user) => {
      this.user = user;
    });
  }
}

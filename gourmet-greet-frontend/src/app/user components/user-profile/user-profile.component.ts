import { Component, inject } from '@angular/core';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserRecipesComponent } from '../user-recipes/user-recipes.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  user?: User

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || 1;
      console.log('Recipe ID:', id);
      this.authService.setUser(+id)
      this.user = this.authService.getUser() || undefined
    });
  }
}

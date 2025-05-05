import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  service = inject(UserService)

  loggedIn() {
    return localStorage.getItem('token') != null;
  }

  logout() {
    this.service.logout();
  }
}

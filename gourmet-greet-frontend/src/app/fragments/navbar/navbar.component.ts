import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  service = inject(UserService)
  currentUser?: User | null;


  ngOnInit(): void {
    this.service.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  loggedIn() {
    return localStorage.getItem('token') != null;
  }

  logout() {
    this.service.logout();
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidenavComponent } from '../admin-sidenav/admin-sidenav.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminRequestsComponent } from '../admin-requests/admin-requests.component';
import { AdminCategoriesComponent } from '../admin-categories/admin-categories.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, AdminSidenavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}

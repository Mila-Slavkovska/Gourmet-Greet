import { Component, inject, Input } from '@angular/core';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-admin-profile',
  imports: [UserDetailsComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  userService = inject(UserService)
  @Input() user?: User | null

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe((user) => {
      this.user = user;
    });
  }
}

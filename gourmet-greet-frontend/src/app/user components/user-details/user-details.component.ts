import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-details',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  //TODO: Find number of reviews for every user
  //TODO: Add upgrade button on user
  @Input() user?: User
  numReviews = 0
}

import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { mockUsers } from '../mock-data/mock-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO: [BE] and [FE] integration
  //TODO: Save user in local storage
  
  private loggedInUser: User | null = null

  setUser(id: number) {
    this.loggedInUser = mockUsers[id]
  }

  getUser(): User | null {
    return this.loggedInUser
  }
}

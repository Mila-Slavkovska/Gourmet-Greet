import { Component } from '@angular/core';
import { RecipesComponent } from "../recipes/recipes.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RecipesComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

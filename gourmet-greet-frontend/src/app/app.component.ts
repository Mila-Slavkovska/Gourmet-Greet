import { Component} from '@angular/core';
import { NavbarComponent } from "./fragments/navbar/navbar.component";
import { FooterComponent } from './fragments/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gourmet-greet-frontend';
}

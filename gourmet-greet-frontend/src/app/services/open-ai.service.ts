import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AIRecipeRequest } from '../interfaces/ai-recipe-request.interface';
import { AISuggestRecipeResponse } from '../interfaces/suggest-recipe-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  httpClient = inject(HttpClient)

  suggestRecipes(request: AIRecipeRequest): Observable<AISuggestRecipeResponse>{
    return this.httpClient.post<AISuggestRecipeResponse>('/api/openai/suggest', request);
  }
}

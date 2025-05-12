import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AIRecipeRequest } from '../interfaces/ai-recipe-request.interface';
import { AISuggestRecipeResponse } from '../interfaces/suggest-recipe-response.interface';
import { AIRecipeResponse } from '../interfaces/ai-recipe-response.interface';
import { CalorieEstimationResponse } from '../interfaces/calorie-estimation-response.interface';
import { CalorieEstimationRequest } from '../interfaces/calorie-estimation-request.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  httpClient = inject(HttpClient)

  suggestRecipes(request: AIRecipeRequest): Observable<AISuggestRecipeResponse>{
    return this.httpClient.post<AISuggestRecipeResponse>('/api/openai/suggest', request);
  }

  createAIRecipe(request: AIRecipeRequest): Observable<AIRecipeResponse>{
    return this.httpClient.post<AIRecipeResponse>('/api/openai/cook', request);
  }
  
  estimateCalories(calorieEstimationRequest: CalorieEstimationRequest): Observable<CalorieEstimationResponse> {
    return this.httpClient.post<CalorieEstimationResponse>(`/api/openai/nutrition-info`,calorieEstimationRequest)
  }
}

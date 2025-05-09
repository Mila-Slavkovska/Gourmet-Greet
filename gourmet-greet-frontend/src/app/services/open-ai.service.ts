import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalorieEstimationResponse } from '../interfaces/calorie-estimation-response.interface';
import { CalorieEstimationRequest } from '../interfaces/calorie-estimation-request.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  httpClient = inject(HttpClient)

  estimateCalories(calorieEstimationRequest: CalorieEstimationRequest): Observable<CalorieEstimationResponse> {
    return this.httpClient.post<CalorieEstimationResponse>(`/api/openai/nutrition-info`,calorieEstimationRequest)
  }
}

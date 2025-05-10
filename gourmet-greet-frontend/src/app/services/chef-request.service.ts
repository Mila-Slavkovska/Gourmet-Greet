import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChefRequestDto } from '../interfaces/chef-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ChefRequestService {

  httpClient = inject(HttpClient)

  getAllRequestsByStatus(status: string): Observable<ChefRequestDto[]> {
    return this.httpClient.get<ChefRequestDto[]>(`/api/chef-requests?status=${status}`);
  }

  approveRequest(id: number): Observable<ChefRequestDto> {
    return this.httpClient.post<ChefRequestDto>(`/api/chef-requests/approve/${id}`, {});
  }

  rejectRequest(id: number): Observable<ChefRequestDto> {
    return this.httpClient.post<ChefRequestDto>(`/api/chef-requests/reject/${id}`, {});
  }
}

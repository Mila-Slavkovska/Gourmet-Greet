import { HttpClient, HttpParams } from '@angular/common/http';
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

  checkIfUserHasPendingRequest(): Observable<boolean> {
    return this.httpClient.get<boolean>("/api/chef-requests/has-pending")
  }

  sendUpgradeRequest(message: string): Observable<any> {
    const params = new HttpParams().set('requestMessage', message);
    return this.httpClient.post(`/api/chef-requests`, null, { params });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpClient = inject(HttpClient)

  getCategoriesByIds(ids: number[]): Observable<Category[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.httpClient.get<Category[]>('/api/categories/ids', { params });
  }

  getCategoriesByType(type: string): Observable<Category[]> {
    const params = new HttpParams().set('type', type);
    return this.httpClient.get<Category[]>(`api/categories/by-type`,{params})
  }
}

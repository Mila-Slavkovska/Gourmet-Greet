import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { CategoryAdd } from '../interfaces/category-add.interface';

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

  createCategory(category: CategoryAdd): Observable<Category> {
    return this.httpClient.post<Category>(`api/categories`, category)
  }

  getCategoryTypes(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/categories/types');
  }
}

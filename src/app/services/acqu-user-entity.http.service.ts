import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntityServiceBase } from './acqu-user-entity-service-base';
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';
import { PagedResponse } from '../models/paged-response';
import { SearchFieldOption } from '../models/search-field-option';
import { SearchTypeOption } from '../models/search-type-option';

@Injectable({
  providedIn: 'root',
})
export class AcquUserEntityHttpService extends AcquUserEntityServiceBase {
  private readonly baseUrl = 'http://localhost:8080/api/acqu-users';

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<PagedResponse<AcquUserEntity>> {
    return this.http.post<PagedResponse<AcquUserEntity>>(`${this.baseUrl}/paging`, acquUserEntitySearchParams);
  }

  createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity> {
    return this.http.post<AcquUserEntity>(this.baseUrl, user);
  }

  updateUser(user: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.put<AcquUserEntity>(`${this.baseUrl}/${user.userEntityId}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPhoneModels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/phone-models`);
  }

  updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.patch<AcquUserEntity>(`${this.baseUrl}/${user.userEntityId}/phone-model`, {
      phoneModel: user.phoneModel,
    });
  }

  updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<any> {
    const userIds = users.map((user) => user.userEntityId);
    return this.http.put(`${this.baseUrl}/bulk-status`, { userIds, status: bulkStatus });
  }

  deleteDeletedRecords(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleted`);
  }

  exportToExcel(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/export`, acquUserEntitySearchParams, { responseType: 'blob' });
  }

  getAuditTrail(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/audit`);
  }
   // Fetch search field options from the backend
  getSearchFieldOptions(): Observable<SearchFieldOption[]> {
    return this.http.get<SearchFieldOption[]>(`${this.baseUrl}/search-field-options`);
  }
    // Fetch search type options from the backend
    getSearchTypeOptions(): Observable<SearchTypeOption[]> {
      return this.http.get<SearchTypeOption[]>(`${this.baseUrl}/search-type-options`);
    }
    
}

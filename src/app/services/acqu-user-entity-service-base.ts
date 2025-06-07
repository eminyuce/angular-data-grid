import { Observable } from 'rxjs';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';
import { PagedResponse } from '../models/paged-response';
import { SearchFieldOption } from '../models/search-field-option';
import { SearchTypeOption } from '../models/search-type-option';

export abstract class AcquUserEntityServiceBase {
  abstract getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<PagedResponse<AcquUserEntity>>;
  abstract createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity>;
  abstract updateUser(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract deleteUser(id: number): Observable<void>;
  abstract getPhoneModels(): Observable<string[]>;
  abstract updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<any>;
  abstract deleteDeletedRecords(): Observable<any>;
  abstract exportToExcel(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<Blob>;
  abstract getAuditTrail(userId: number): Observable<any[]>;
  abstract getSearchFieldOptions(): Observable<SearchFieldOption[]>;
  abstract getSearchTypeOptions(): Observable<SearchTypeOption[]>;
}

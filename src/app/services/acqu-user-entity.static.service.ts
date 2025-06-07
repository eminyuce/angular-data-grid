// user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AcquUserEntityServiceBase } from './acqu-user-entity-service-base'; // Adjust the path as necessary
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';
import { PagedResponse } from '../models/paged-response';
import { SearchFieldOption } from '../models/search-field-option';
import { SearchTypeOption } from '../models/search-type-option';

@Injectable({
  providedIn: 'root',
})
export class AcquUserEntityStaticService extends AcquUserEntityServiceBase {
  private staticPhoneModels: string[] = [
    'iPhone 13',
    'Samsung Galaxy S22',
    'Google Pixel 7',
    'OnePlus 9',
    'Nokia XR20',
  ];

  constructor() {
    super();
  }
  private firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Sam', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Drew'];
  private lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  private emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.org'];
  private descriptions = [
    'An active user who frequently interacts with the platform.',
    'A user who has recently joined.',
    'A long-term member with consistent activity.',
    'A member interested in technology and gadgets.',
    'A casual user with sporadic activity.',
    'A user who prefers mobile-friendly applications.'
  ];
  // Method to generate 300 static users
  private generateStaticUsers(): AcquUserEntity[] {
    const users: AcquUserEntity[] = [];
    for (let i = 1; i <= 500; i++) {
      const firstName = this.firstNames[i % this.firstNames.length];
      const lastName = this.lastNames[i % this.lastNames.length];
      const emailDomain = this.emailDomains[i % this.emailDomains.length];
      const description = this.descriptions[i % this.descriptions.length];
  
      users.push({
        userEntityId: i,
        userName: `${firstName} ${lastName}`,
        userEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${emailDomain}`,
        phoneModel: this.staticPhoneModels[i % this.staticPhoneModels.length],
        userDescription: description,
        status: i % 4 === 0 ? 'DELETED' : i % 3 === 0 ? 'FROZEN' : 'LIVE',
        createdDate: new Date(2021, Math.floor(i / 30) % 12, (i % 28) + 1),
        updatedDate: new Date(2023, Math.floor(i / 30) % 12, (i % 28) + 2),
      });
    }
  
    return users;
  }
  
  private staticUsers = this.generateStaticUsers();

  getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<PagedResponse<AcquUserEntity>> {
    let filteredUsers = this.staticUsers;
  
    // Apply criteriaList filters
    if (acquUserEntitySearchParams.criteriaList && acquUserEntitySearchParams.criteriaList.length > 0) {
      acquUserEntitySearchParams.criteriaList.forEach((criteria) => {
        filteredUsers = filteredUsers.filter((user) => {
          const fieldValue = (user as any)[criteria.field];
  
          switch (criteria.operator) {
            case 'like':
              return typeof fieldValue === 'string' && fieldValue.includes(criteria.value);
            case '=':
              return fieldValue == criteria.value; // Use loose equality for numeric/string flexibility
            case '<>':
              return fieldValue != criteria.value;
            case '>':
              return fieldValue > criteria.value;
            case '<':
              return fieldValue < criteria.value;
            default:
              return true; // Ignore unsupported operators
          }
        });
      });
    }
  
    // Apply date range filters for createdDate
    if (acquUserEntitySearchParams.createdFrom) {
      filteredUsers = filteredUsers.filter(
        (user) => user.createdDate >= acquUserEntitySearchParams.createdFrom!
      );
    }
    if (acquUserEntitySearchParams.createdTo) {
      filteredUsers = filteredUsers.filter(
        (user) => user.createdDate <= acquUserEntitySearchParams.createdTo!
      );
    }
  
    // Apply date range filters for updatedDate
    if (acquUserEntitySearchParams.updatedFrom) {
      filteredUsers = filteredUsers.filter(
        (user) => user.updatedDate >= acquUserEntitySearchParams.updatedFrom!
      );
    }
    if (acquUserEntitySearchParams.updatedTo) {
      filteredUsers = filteredUsers.filter(
        (user) => user.updatedDate <= acquUserEntitySearchParams.updatedTo!
      );
    }
  
    // Create paged response
    const pagedResponse: PagedResponse<AcquUserEntity> = {
      content: filteredUsers,
      totalElements: filteredUsers.length,
      totalPages: 1,
      size: filteredUsers.length,
      number: 0,
    };
  
    return of(pagedResponse);
  }
  
  

  createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity> {
    const newUser: AcquUserEntity = {
      ...user,
      userEntityId: this.staticUsers.length + 1,
      status: 'LIVE',
      createdDate: new Date(),
      updatedDate: new Date(),
    } as AcquUserEntity;
    this.staticUsers.push(newUser);
    return of(newUser);
  }

  updateUser(user: AcquUserEntity): Observable<AcquUserEntity> {
    const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
    if (index !== -1) {
      this.staticUsers[index] = { ...user, updatedDate: new Date() };
    }
    return of(this.staticUsers[index]);
  }

  deleteUser(id: number): Observable<void> {
    this.staticUsers = this.staticUsers.filter((user) => user.userEntityId !== id);
    return of(undefined); // Emits `undefined` and completes
  }

  getPhoneModels(): Observable<string[]> {
    return of(this.staticPhoneModels);
  }

  updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity> {
    const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
    if (index !== -1) {
      this.staticUsers[index].phoneModel = user.phoneModel;
    }
    return of(this.staticUsers[index]);
  }

  updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<any> {
    users.forEach((user) => {
      const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
      if (index !== -1) {
        this.staticUsers[index].status = bulkStatus as 'DELETED' | 'FROZEN' | 'LIVE' | 'TEST';
      }
    });
    return of(users).pipe(
      catchError((error) => {
        console.error('Error in updateBulkStatus:', error);
        return of();
      })
    );
  }

  deleteDeletedRecords(): Observable<any> {
    this.staticUsers = this.staticUsers.filter((user) => user.status !== 'DELETED');
    return of(this.staticUsers).pipe( // Emit the updated list of users
      catchError((error) => {
        console.error('Error in deleteDeletedRecords:', error);
        return of(); // Return an empty observable in case of error
      })
    );
  }

  exportToExcel(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<Blob> {
    const blob = new Blob(['Static Excel Data'], { type: 'application/vnd.ms-excel' });
    return of(blob).pipe(
      catchError((error) => {
        console.error('Error in exportToExcel:', error);
        return of();
      })
    );
  }

  getAuditTrail(userId: number): Observable<any[]> {
    const auditTrail = [
      { action: 'Created', timestamp: new Date('2023-01-01T10:00:00Z') },
      { action: 'Updated', timestamp: new Date('2023-01-15T15:00:00Z') },
    ];
    return of(auditTrail).pipe(
      catchError((error) => {
        console.error('Error in getAuditTrail:', error);
        return of();
      })
    );
  }

  // Static method to return search field options
  getSearchFieldOptions(): Observable<SearchFieldOption[]> {
    const options: SearchFieldOption[] = [
      { value: 'userEntityId', display: 'User Entity ID' },
      { value: 'userName', display: 'User Name' },
      { value: 'userEmail', display: 'User Email' },
      { value: 'phoneModel', display: 'Phone Model' },
      { value: 'userDescription', display: 'User Description' },
      { value: 'status', display: 'Status' },
      { value: 'createdDate', display: 'Created Date' },
      { value: 'updatedDate', display: 'Updated Date' }
    ];

    return of(options); // Wrap the array in an Observable
  }
    // Fetch search type options from the backend
 getSearchTypeOptions(): Observable<SearchTypeOption[]> {
  const options: SearchTypeOption[] = [
      { value: 'like', display: 'Contains' },
      { value: '=', display: 'Equals To' },
      { value: '<>', display: 'Not Equals To' },
      { value: '>', display: 'Greater than' },
      { value: '<', display: 'Less than' }
    ];
    return of(options); // Wrap the array in an Observable
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../models/log.model';
import { LogSearchParams } from '../models/log-search-params.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'http://localhost:8080/api/logs'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all logs
  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl);
  }

  // Fetch logs by application name
  getLogsByApplicationName(applicationName: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/application/${applicationName}`);
  }

  // Fetch logs by log level
  getLogsByLogLevel(logLevel: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/level/${logLevel}`);
  }

  // Fetch logs by timestamp range
  getLogsByTimestampRange(start: string, end: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/timestamp?start=${start}&end=${end}`);
  }

  // Fetch logs with advanced search criteria
  searchLogs(searchParams: LogSearchParams): Observable<Log[]> {
    return this.http.post<Log[]>(`${this.apiUrl}/search`, searchParams);
  }
}
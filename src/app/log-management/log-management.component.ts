import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Log } from '../models/log.model';
import { LogService } from '../services/log.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { SearchCriteria } from '../models/search-criteria.model';
import { formatDate } from '@angular/common';
import { LogSearchParams } from '../models/log-search-params.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [LogService]
})
export class LogManagementComponent implements OnInit {
  displayedColumns = [
    'select', 'actions', 'applicationName', 'logLevel', 'logMessage', 'timestamp'
  ];
  searchField: string = '';
  searchType: string = '';
  searchValue: string = '';
  filters: SearchCriteria[] = [];
  dataSource!: MatTableDataSource<Log>;
  selection = new SelectionModel<Log>(true, []);
  logForm!: FormGroup;
  showForm = false;
  editMode = false;
  message = '';
  messageClass = '';
  filterField = '';
  filterOperator = '';
  filterValue = '';
  timestampFrom: Date | null = null;
  timestampTo: Date | null = null;
  logLevels: string[] = ['INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL'];
  defaultPageSize = 10;
  defaultPageSizeOptions: number[] = [5, 10, 25, 100, 200, 500, 1000];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchFieldOptions = [
    { value: 'applicationName', display: 'Application Name' },
    { value: 'logLevel', display: 'Log Level' },
    { value: 'logMessage', display: 'Log Message' },
    { value: 'timestamp', display: 'Timestamp' }
  ];

  searchTypeOptions = [
    { value: 'like', display: 'Contains' },
    { value: '=', display: 'Equals To' },
    { value: '<>', display: 'Not Equals To' },
    { value: '>', display: 'Greater than' },
    { value: '<', display: 'Less than' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private logService: LogService
  ) {
    this.initDataSource();
  }

  ngOnInit() {
    this.loadData();
    this.initForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initForm() {
    this.logForm = this.fb.group({
      id: [null],
      applicationName: ['', Validators.required],
      logLevel: ['', Validators.required],
      logMessage: ['', Validators.required],
      timestamp: [new Date(), Validators.required]
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource<Log>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addFilter() {
    if (this.searchValue.length == 0) {
      this.showMessage(`Please enter search value`, 'error');
      return;
    }
    const filter: SearchCriteria = {
      field: this.searchField,
      operator: this.searchType,
      value: this.searchValue
    };
    this.filters.push(filter);
    this.searchValue = '';  // Reset search input
  }

  loadData() {
    const logSearchParams: LogSearchParams = {
      criteriaList: this.filters,
      timestampFrom: this.timestampFrom,
      timestampTo: this.timestampTo
    };

    this.logService.getLogs(logSearchParams).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.filters.length > 0) {
          if (this.timestampFrom && this.timestampTo) {
            this.showMessage(`Data loaded successfully with ${this.filters.length} filters and date range`, 'success');
          } else {
            this.showMessage(`Data loaded successfully with ${this.filters.length} filters`, 'success');
          }
        } else {
          if (this.timestampFrom && this.timestampTo) {
            this.showMessage('Data loaded successfully with selected date range', 'success');
          } else {
            this.showMessage('Data loaded successfully without any filters or date range', 'success');
          }
        }
      },
      error: (error) => this.showMessage('Error loading data', 'error')
    });
  }

  onSubmit() {
    if (this.logForm.valid) {
      const logData = this.logForm.value;
      const operation = this.editMode ?
        this.logService.updateLog(logData) :
        this.logService.createLog(logData);

      operation.subscribe({
        next: () => {
          this.showMessage(
            `Log ${this.editMode ? 'updated' : 'created'} successfully`,
            'success'
          );
          this.loadData();
          this.resetForm();
        },
        error: (error) => this.showMessage('Error saving log', 'error')
      });
    }
  }

  private resetForm() {
    this.logForm.reset();
    this.editMode = false;
    this.showForm = false;
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageClass = type;
    setTimeout(() => this.message = '', 3000);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  editRecord(element: Log) {
    this.showForm = true;
    this.editMode = true;
    this.logForm.patchValue(element);
  }

  viewDetails(element: Log) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Details of log from ${element.applicationName}` }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  reloadData() {
    this.loadData();
  }

  removeFilter(index: number) {
    this.filters.splice(index, 1);
    if (this.filters.length == 0) {
      this.loadData();
    }
  }

  operationTxt(value: string): string {
    const option = this.searchTypeOptions.find(option => option.value === value);
    return option ? option.display : value;
  }

  fieldTxt(value: string): string {
    const option = this.searchFieldOptions.find(option => option.value === value);
    return option ? option.display : value;
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy/MM/dd HH:mm:ss', 'en-US');
  }
}
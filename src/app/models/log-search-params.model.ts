import { SearchCriteria } from './search-criteria.model';


export interface LogSearchParams {

    criteriaList: SearchCriteria[];
  
    createdFrom?: Date | null;
  
    createdTo?: Date | null;

    pageable?: CustomPageable;
  
  }
  

  export class CustomPageable {
    page: number = 0;       // Default to 0
    size: number = 20;      // Default to 20
    customSort: CustomSort[] = []; // List of sorting parameters
  
    constructor(page?: number, size?: number, customSort?: CustomSort[]) {
      if (page !== undefined) {
        this.page = page;
      }
      if (size !== undefined) {
        this.size = size;
      }
      if (customSort) {
        this.customSort = customSort;
      }
    }
  }
  
  export class CustomSort {
    field!: string;    // Field to sort by
    direction!: string; // Sorting direction ('ASC' or 'DESC')
  
    constructor(field: string, direction: string) {
      this.field = field;
      this.direction = direction;
    }
  }
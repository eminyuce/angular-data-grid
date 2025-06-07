// Define the paginated response interface
export interface PagedResponse<T> {
    content: T[]; // List of entities (AcquUserEntity)
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;  // Current page number
  }
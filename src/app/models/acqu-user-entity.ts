export interface AcquUserEntity {
  userEntityId: number;
  userName: string;
  userEmail: string;
  phoneModel: string;
  userDescription: string;
  status: 'DELETED' | 'FROZEN' | 'LIVE' | 'TEST';
  createdDate: Date;
  updatedDate: Date;
  }
  
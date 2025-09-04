export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pan: string;
  phone: string;
  email: string;
  locationType: number;
  taluka?: string;
  panchayatName?: string;
  city?: string;
  pincode?: string;
  address?: string;
}
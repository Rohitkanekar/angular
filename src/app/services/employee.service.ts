import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeApiURL: string = "http://localhost:8080/users";

  constructor(private http: HttpClient) { }

  getEmployee(): Observable<User[]> {
    return this.http.get<User[]>(this.employeeApiURL);
  }

  createEmployee(user: User): Observable<User> {
    return this.http.post<User>(this.employeeApiURL, user);
  }

  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.employeeApiURL}/${id}`);
  }

}

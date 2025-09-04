import { Routes } from '@angular/router';
import { FlightComponent } from './core/flight/flight.component';
import { FlightDetailComponent } from './core/flight-detail/flight-detail.component';
import { EmployeesComponent } from './core/employees/employees.component';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './gaurd/auth.guard';
import { UnauthorizedComponent } from './core/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'home',
        loadComponent: () => import('./core/home/home').then(m => m.Home),
        canActivate: [AuthGuard],
        data: { role: 0 }
    },
    {
        path: 'all-recipes',
        loadComponent: () => import('./core/receipes/receipes.component').then(m => m.ReceipesComponent),
        canActivate: [AuthGuard],
        data: { role: 0 }
    },
    {
        path: 'local-recipes',
        loadComponent: () => import('./core/local-recipes/local-recipes.component').then(m => m.LocalRecipesComponent),
        canActivate: [AuthGuard],
        data: { role: 1 }
    },
    {
        path: 'employees',
        component: EmployeesComponent,
        //canActivate: [AuthGuard]
    },
    {
        path: 'flight',
        component: FlightComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'flight-detail',
        component: FlightDetailComponent,
        //canActivate: [AuthGuard]

    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    // {
    //     path: 'flight/:name',
    //     component: FlightDetailComponent
    // }
];

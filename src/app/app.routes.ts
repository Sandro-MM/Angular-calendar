import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'day',
    loadComponent: () => import('./pages/day-table/day-table.component').then(m => m.DayTableComponent),
  },
  {
    path: 'month',
    loadComponent: () => import('./pages/month-table/month-table.component').then(m => m.MonthTableComponent)
  },
  {
    path: 'week',
    loadComponent: () => import('./pages/week-table/week-table.component').then(m => m.WeekTableComponent)
  },
  {
    path: 'year',
    loadComponent: () => import('./pages/year-table/year-table.component').then(m => m.YearTableComponent)
  },
  {
    path: '**',
    redirectTo: 'day'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'day'
  },

];


import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EventModel} from '../app/store/events.model';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/eventItems';

  http = inject(HttpClient)

  getEvents() {
    return this.http.get<EventModel[]>(this.apiUrl);
  }

  deleteEvent(eventId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${eventId}`).pipe(
      catchError((error) => {
        console.error('Failed to delete event:', error);
        return throwError(() => new Error('Failed to delete event'));
      })
    );
  }
  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(this.apiUrl, event).pipe(
      catchError((error) => {
        console.error('Failed to add event:', error);
        return throwError(() => new Error('Failed to add event'));
      })
    );
  }
}

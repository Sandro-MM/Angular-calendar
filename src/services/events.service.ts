import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EventModel} from '../app/store/events.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/eventItems';

  http = inject(HttpClient)

  getEvents() {
    return this.http.get<EventModel[]>(this.apiUrl);
  }

  deleteEvent(eventId: string) {
    return this.http.delete(`${this.apiUrl}/${eventId}`);
  }
}

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EventModel} from '../../store/events.model';
import {DatePipe, NgStyle} from '@angular/common';
import {eventsStore} from '../../store/events.store';
@Component({
  selector: 'app-event-detailed',
  templateUrl: './event-detailed.component.html',
  standalone: true,
  styleUrl: './event-detailed.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgStyle
  ]
})
export class EventDetailedComponent {
  data = inject<EventModel>(MAT_DIALOG_DATA);
  store = inject(eventsStore)

  deleteEvent(id: string) {
    this.store.deleteEvent(id)
  }
}

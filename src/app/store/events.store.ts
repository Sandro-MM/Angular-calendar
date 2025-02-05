import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import {EventModel} from './events.model';
import {EventsService} from '../../services/events.service';

type EventsState = {
  eventItems: EventModel[];
};

export const eventsStore = signalStore(
  { providedIn: 'root' },
  withState<EventsState>({ eventItems: [] }),
  withMethods((store) => {
    const eventsService = inject(EventsService);

    return {
      loadEvents() {
        eventsService.getEvents().subscribe((data) => {
          store.update(() => ({ eventItems: data }));
        });
      },

      addEventItem(newEventItem: EventModel) {
        store.update((state) => ({
          eventItems: [newEventItem, ...state.eventItems],
        }));
      },

      deleteEventItem(eventId: string) {
        eventsService.deleteEvent(eventId).subscribe(() => {
          store.update((state) => ({
            eventItems: state.eventItems.filter((event) => event.id !== eventId),
          }));
        });
      }
    };
  })
);

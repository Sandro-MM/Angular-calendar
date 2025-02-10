import { inject } from '@angular/core';
import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {EventModel} from './events.model';
import {EventsService} from '../../services/events.service';

type EventsState = {
  eventItems: EventModel[];
};
const initialState: EventsState = {
  eventItems: []
}
export const eventsStore = signalStore(
  {providedIn:'root'},
  withState(initialState),
  withMethods(
    (store, eventService = inject(EventsService) ) =>({
      getEvents() {
        const callEvent  =
          eventService.getEvents().subscribe((res)=>{
            patchState(store,{eventItems:res})
        });
      },
      addEvent(event: EventModel){

      },
      deleteEvent(id: string){

      },
        updateEvent(updatedEvent: EventModel) {
          console.log("Updating Event:", updatedEvent);
          patchState(store, {
            eventItems: store.eventItems().map(event =>
              event.id === updatedEvent.id ? updatedEvent : event
            )
          });
        },
        updateEventTime(eventId: string, time: any) {
          patchState(store, {
            eventItems: store.eventItems().map((event: EventModel) => {
              if (event.id === eventId) {
                return { ...event, date: time };
              }
              return event;
            })
          });
        },
        updateEventDate(eventId: string, newDate: Date, newHour: number) {
          patchState(store, {
            eventItems: store.eventItems().map((event: EventModel) => {
              if (event.id === eventId) {
                return {
                  ...event,
                  date: new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    newHour,
                    0,
                    0,
                    0
                  ).toISOString()
                };
              }
              return event;
            })
          });
        }

      }
    )
  ),
  withHooks({
    onInit(store){
      store.getEvents()
    }
  })
);

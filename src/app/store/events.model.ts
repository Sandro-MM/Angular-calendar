export type EventModel = {
  id: string;
  date: Date;
  title: string;
  description: string;
  color: string;
  repeat?: string;
  duration: string;
};

export type EventsModel = {
  eventItems: EventModel[];
};

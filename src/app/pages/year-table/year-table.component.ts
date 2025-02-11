import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {eventsStore} from '../../store/events.store';

@Component({
  selector: 'app-year-table',
  imports: [
    CalendarPageComponent
  ],
  templateUrl: './year-table.component.html',
  standalone: true,
  styleUrl: './year-table.component.css'
})
export class YearTableComponent {
  store = inject(eventsStore); // Inject event store

  selectedDate: WritableSignal<string> = signal(new Date().toISOString());

  selectedYear: Signal<number> = computed(() => new Date(this.selectedDate()).getFullYear());

  monthsArray = Array.from({ length: 12 }, (_, i) => i);

  monthNames = computed(() =>
    this.monthsArray.map((month) =>
      new Date(this.selectedYear(), month).toLocaleString('default', { month: 'long' })
    )
  );

  onSelectedDateChange(date: string) {
    this.selectedDate.set(date)
  }

  getMonthDaysWithEvents = (month: number): { day: number; events: any[] }[][] => {
    const year = this.selectedYear();
    const firstDay = new Date(year, month, 1).getDay(); // Get first day index (0 = Sun, ..., 6 = Sat)
    const totalDays = new Date(year, month + 1, 0).getDate(); // Get total days in the month
    const weeks: { day: number; events: any[] }[][] = [[]];

    // Get events
    const allEvents = this.store.eventItems();

    // Fill the first week with empty slots if the month doesn't start on Sunday
    for (let i = 0; i < firstDay; i++) {
      weeks[0].push({ day: 0, events: [] }); // Empty slot
    }

    let currentWeek = 0;
    for (let day = 1; day <= totalDays; day++) {
      if (weeks[currentWeek].length === 7) {
        weeks.push([]); // Start a new week
        currentWeek++;
      }

      // Get events for this specific day
      const currentDay = new Date(year, month, day);
      const eventsForDay = allEvents.filter(
        (event) => new Date(event.date).toDateString() === currentDay.toDateString()
      );

      weeks[currentWeek].push({ day, events: eventsForDay });
    }

    // Fill the last week's empty slots
    while (weeks[currentWeek].length < 7) {
      weeks[currentWeek].push({ day: 0, events: [] });
    }

    return weeks;
  };
}

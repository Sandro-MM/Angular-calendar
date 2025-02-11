import {ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {CalendarPageComponent} from '../../components/calendar-page/calendar-page.component';
import {eventsStore} from '../../store/events.store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-year-table',
  imports: [
    CalendarPageComponent
  ],
  templateUrl: './year-table.component.html',
  standalone: true,
  styleUrl: './year-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearTableComponent {
  store = inject(eventsStore);
  router = inject(Router);
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
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const weeks: { day: number; events: any[] }[][] = [[]];
    const allEvents = this.store.eventItems();

    for (let i = 0; i < firstDay; i++) {
      weeks[0].push({ day: 0, events: [] });
    }
    let currentWeek = 0;
    for (let day = 1; day <= totalDays; day++) {
      if (weeks[currentWeek].length === 7) {
        weeks.push([]);
        currentWeek++;
      }
      const currentDay = new Date(year, month, day);
      const eventsForDay = allEvents.filter(
        (event) => new Date(event.date).toDateString() === currentDay.toDateString()
      );
      weeks[currentWeek].push({ day, events: eventsForDay });
    }
    while (weeks[currentWeek].length < 7) {
      weeks[currentWeek].push({ day: 0, events: [] });
    }
    return weeks;
  };



  navigateToMonth(month: number, selectedDate: string) {
    const [year, , day] = selectedDate.split('-');
    const formattedMonth = String(+month+1).padStart(2, '0');
    const formattedDate = `${year}-${formattedMonth}-${day}`;
    this.router.navigate(['/month'], { queryParams: { date: formattedDate } });
  }

}

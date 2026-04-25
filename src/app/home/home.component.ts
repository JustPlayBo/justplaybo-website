import { Component } from '@angular/core';

interface ScheduleEntry {
  day: string;
  time: string;
  activity: string;
  note?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  standalone: false,
})
export class HomeComponent {
  readonly schedule: ScheduleEntry[] = [
    { day: 'Lunedì',         time: '21:00', activity: 'Giochi da tavolo', note: 'in Ludoteca' },
    { day: 'Mercoledì',      time: '20:30', activity: 'Giochi da tavolo' },
    { day: 'Mercoledì',      time: '21:00', activity: 'Giochi di ruolo' },
    { day: 'Sabato',         time: '15:00', activity: 'Scacchi' },
    { day: 'Ultimo giovedì', time: 'sera',  activity: 'Subbuteo', note: 'una volta al mese' },
  ];
}

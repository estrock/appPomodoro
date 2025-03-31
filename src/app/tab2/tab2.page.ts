import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  sessionType = 'Trabajo';
  workSession = 25;
  shortBreakSession = 5;
  longBreakSession = 15;
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  taskName = '';
  timer: any;
  // timeLeft = 25 * 60;
  timeLeft = 1.5 * 60;
  isRunning = false;
  cycle = 0;
  // longBreak = 15 * 60;
  longBreak = 1 * 60;
  shortBreak = 0.5 * 60;
  settings = { longBreakDuration: 1 };
  isPomodoroActive = false;

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage['create']();
    const storedSettings = await this.storage.get('settings');
    if (storedSettings) this.settings = storedSettings;
  }

  startTimer() {
    this.isPomodoroActive = true;
    // this.timeLeft = this.workSession * 60;
    if (!this.taskName) return alert('Defina una tarea antes de iniciar.');
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.nextCycle();
        }
      }, 1000);
    }
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.isRunning = false;
  }

  stopTimer() {
    this.taskName = '';
    this.isPomodoroActive = false;
    clearInterval(this.timer);
    this.isRunning = false;
    // this.timeLeft = 25 * 60;
    this.timeLeft = this.workSession * 60;
  }

  // nextCycle() {
  //   clearInterval(this.timer);
  //   this.isRunning = false;
  //   this.cycle++;
  //   console.log("cycle es: ", this.cycle," y el mod de 2 es: ",this.cycle % 2," y mod por 4 es:  ",this.cycle % 4)
  //   this.sessionType = this.cycle % 2 === 0 ? 'Trabajo' : (this.cycle % 4 === 0 ? 'Descanso largo' : 'Descanso corto');

  //   if (this.cycle % 2 === 0) {
  //     // this.timeLeft = 25 * 60; // Sesión de trabajo
  //     this.timeLeft = 1.5 * 60;
  //   } else if (this.cycle % 4 === 0) {
  //     this.timeLeft = this.settings.longBreakDuration * 60;
  //     // this.cycle++;
  //   } else {
  //     this.timeLeft = this.shortBreak;
  //     // this.cycle++;
  //   }
  // }

  nextCycle() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.cycle++;
    this.showNotification(`Comenzando ${this.sessionType}`);
    console.log("cycle es: ", this.cycle, " y el mod de 2 es: ", this.cycle % 2, " y mod por 4 es:  ", this.cycle % 4);
    
    if (this.cycle % 8 === 7) {
      this.sessionType = 'Descanso largo';
      // this.timeLeft = this.settings.longBreakDuration * 60;
      this.timeLeft = this.longBreakSession * 60;
    } else if (this.cycle % 2 === 0) {
      this.sessionType = 'Trabajo';
      // this.timeLeft = 1.5 * 60; // Sesión de trabajo
      this.timeLeft = this.workSession * 60;
    } else {
      this.sessionType = 'Descanso corto';
      // this.timeLeft = this.shortBreak;
      this.timeLeft = this.shortBreakSession * 60;
    } 
    // else if (this.cycle % 4 === 3) {
    //   this.timeLeft = this.settings.longBreakDuration * 60;
    // } else {
    //   this.timeLeft = this.shortBreak;
    // }
  }

  async showNotification(message: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', { body: message });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Pomodoro Timer', { body: message });
        }
      }
    }
  }

}

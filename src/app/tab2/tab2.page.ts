import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalNotifications } from '@capacitor/local-notifications';


interface Tarea {
  fechaInicio: string;
  fechaFinal: string;
  nombreTarea: string;
  duracion: any;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})


export class Tab2Page {
  tiempo =0;
  totalElapsedTime = 0;
  sessionType = 'Trabajo';
  workSession = 25;
  shortBreakSession = 5;
  longBreakSession = 15;
  taskName = '';
  timer: any;
  timeLeft = 1.5 * 60;
  isRunning = false;
  cycle = 0;
  longBreak = 1 * 60;
  shortBreak = 0.5 * 60;
  settings = { longBreakDuration: 1 };
  isPomodoroActive = false;
  fechaInic:any;
  cuanto=0;

  constructor(private storage: Storage) {}
  tareas: Tarea[] = [];

  async ngOnInit() {
    await this.storage['create']();
    const storedSettings = await this.storage.get('settings');
    if (storedSettings) this.settings = storedSettings;
  }

  startTimer() {
    
    this.isPomodoroActive = true;
    if(this.cycle==0){
      this.timeLeft = this.workSession * 60;
      this.cuanto = this.workSession;
      this.fechaInic = new Date().toISOString();
      console.log("fecha: ",this.fechaInic);
    }
    if (!this.taskName) return alert('Defina una tarea antes de iniciar.');
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.tiempo++;
          this.timeLeft--;
          this.totalElapsedTime++;
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
    if (this.isPomodoroActive) {
      console.log("fecha: ",this.fechaInic);
      const tarea: Tarea = {
        fechaInicio: this.fechaInic,
        fechaFinal: new Date().toISOString(),
        nombreTarea: this.taskName,
        // duracion: parseFloat((this.totalElapsedTime / 60).toFixed(2)),
        duracion:  this.formatTime(this.totalElapsedTime) ,
      };
      // this.tareas.push(tarea);
      this.tareas.unshift(tarea); // `unshift` agrega la tarea al principio del array

      console.log('Tarea guardada:', tarea);
      console.log('Tareas totales:', this.tareas);
    }
    this.taskName = '';
    this.isPomodoroActive = false;
    clearInterval(this.timer);
    this.isRunning = false;
    // this.timeLeft = 25 * 60;
    this.timeLeft = this.workSession * 60;
    this.cycle=0;
    this.tiempo=0;
  }

  nextCycle() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.cycle++;
    // alert(`terminando ${this.sessionType}`);.
    this.showNotification(`terminando ${this.sessionType}`);
    console.log("cycle es: ", this.cycle, " y el mod de 2 es: ", this.cycle % 2, " y mod por 4 es:  ", this.cycle % 4);
    
    if (this.cycle % 8 === 7) {
      this.sessionType = 'Descanso largo';
      this.timeLeft = this.longBreakSession * 60;
      this.cuanto = this.longBreakSession;
      this.tiempo =0;
    } else if (this.cycle % 2 === 0) {
      this.sessionType = 'Trabajo';
      this.timeLeft = this.workSession * 60;
      this.cuanto = this.workSession;
      this.tiempo =0;
    } else {
      this.sessionType = 'Descanso corto';
      this.timeLeft = this.shortBreakSession * 60;
      this.cuanto = this.shortBreakSession;
      this.tiempo =0;
    } 
  }

  // async showNotification(message: string) {
  //   if ('Notification' in window) {
  //     if (Notification.permission === 'granted') {
  //       new Notification('Pomodoro Timer', { body: message });
  //     } else if (Notification.permission !== 'denied') {
  //       const permission = await Notification.requestPermission();
  //       if (permission === 'granted') {
  //         new Notification('Pomodoro Timer', { body: message });
  //       }
  //     }
  //   }
  // }
  // async showNotification(message: string) {
  //   if (document.visibilityState === 'visible') {
  //     alert(message);
  //   } else if ('Notification' in window) {
  //     if (Notification.permission === 'granted') {
  //       new Notification('Pomodoro Timer', { body: message });
  //       const audio = new Audio('assets/notification.mp3');
  //       audio.play();
  //     } else if (Notification.permission !== 'denied') {
  //       const permission = await Notification.requestPermission();
  //       if (permission === 'granted') {
  //         new Notification('Pomodoro Timer', { body: message });
  //         const audio = new Audio('assets/notification.mp3');
  //         audio.play();
  //       }
  //     }
  //   }
  //   if ('Notification' in window) {
  //     if (Notification.permission === 'granted') {
  //       new Notification('Pomodoro Timer', { body: message });
  //     } else if (Notification.permission !== 'denied') {
  //       const permission = await Notification.requestPermission();
  //       if (permission === 'granted') {
  //         new Notification('Pomodoro Timer', { body: message });
  //       }
  //     }
  //   }
  // }
  // async showNotification(message: string) {
  //   // Verifica si la app está en primer plano
  //   if (document.visibilityState === 'visible') {
  //     alert(message);
  //   } else {
  //     // Crear notificación local
  //     await LocalNotifications.requestPermissions();
  //     await LocalNotifications.schedule({
  //       notifications: [
  //         {
  //           title: 'Pomodoro Timer',
  //           body: message,
  //           id: new Date().getTime(), // Usar la hora actual como ID único
  //           schedule: { at: new Date(Date.now() + 1000) }, // Enviar la notificación en 1 segundo
  //           sound: 'assets/notification.mp3',
  //           actionTypeId: 'background', // Para ejecutar una acción en segundo plano
  //           extra: { customData: 'some data' }, // Puedes agregar datos personalizados
  //         },
  //       ],
  //     });
  //   }
  // }

  async showNotification(message: string) {
    // Solicitar permisos de notificación antes de mostrar cualquier notificación
    await LocalNotifications.requestPermissions();
  
    // Verifica si la app está en primer plano
    if (document.visibilityState === 'visible') {
      alert(message);
    } else {
      // Crear notificación local
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Pomodoro Timer',
            body: message,
            id: new Date().getTime(), // Usar la hora actual como ID único
            schedule: { at: new Date(Date.now() + 1000) }, // Enviar la notificación en 1 segundo
            sound: 'assets/notification.mp3',  // Si deseas un sonido personalizado
            actionTypeId: 'background', // Para ejecutar una acción en segundo plano
            extra: { customData: 'some data' }, // Puedes agregar datos personalizados
          },
        ],
      });
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

}

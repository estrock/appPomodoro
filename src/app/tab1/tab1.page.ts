import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  tareas: { nombre: string; tiempo: number }[] = [];
  temporizadorActivo = false;
  tiempoRestante!: number;
  preguntarContinuar = false;
  sesionesCompletadas = 0;
  intervalo: any;
  esTrabajo = true;

  agregarTarea() {
    this.tareas.push({ nombre: '', tiempo: 0 });
  }
  mostrarLista() {
    console.log(this.tareas);
  }

  iniciarPomodoro() {
    this.sesionesCompletadas = 0;
    this.iniciarSesionTrabajo();
  }

  iniciarSesionTrabajo() {
    if (this.sesionesCompletadas < 4) {
      this.esTrabajo = true;
      this.tiempoRestante = 25 * 60 * 1000; // 25 minutos
      this.temporizadorActivo = true;
      this.contarTiempo(() => {
        this.preguntarContinuar = true;
      });
    } else {
      this.iniciarDescansoLargo();
    }
  }

  iniciarDescansoCorto() {
    this.tiempoRestante = 5 * 60 * 1000; // 5 minutos
    this.contarTiempo(() => {
      this.sesionesCompletadas++;
      this.iniciarSesionTrabajo();
    });
  }

  iniciarDescansoLargo() {
    this.tiempoRestante = 30 * 60 * 1000; // 30 minutos
    this.contarTiempo(() => {
      this.sesionesCompletadas = 0; // Reiniciar ciclo
    });
  }

  contarTiempo(callback: Function) {
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante -= 1000;
      } else {
        clearInterval(this.intervalo);
        callback();
      }
    }, 1000);
  }

  continuarSesion() {
    this.preguntarContinuar = false;
    this.sesionesCompletadas++;
    this.iniciarDescansoCorto();
  }

  pausarSesion() {
    clearInterval(this.intervalo);
  }

  agregarTiempoExtra() {
    this.tiempoRestante += 55 * 60 * 1000; // Agrega 55 minutos
    this.preguntarContinuar = false;
  }
  

  constructor() {}

}

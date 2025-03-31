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
nombreTarea: any;

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
  pausarPomodoro() {
    clearInterval(this.intervalo);
    this.temporizadorActivo = false;
  }
  

  iniciarSesionTrabajo() {
    if (this.sesionesCompletadas < 1) {
      this.esTrabajo = true;
      // this.tiempoRestante = 25 * 60 * 1000; // 25 minutos
      this.tiempoRestante = 1 * 60 * 1000; // 30 minutos
      this.temporizadorActivo = true;
      this.contarTiempo(() => {
        this.preguntarContinuar = true;
      });
    } else {
      this.iniciarDescansoLargo();
    }
  }

  iniciarDescansoCorto() {
    this.esTrabajo = false;
    // this.tiempoRestante = 5 * 60 * 1000; // 5 minutos
    this.tiempoRestante = 0.5 * 60 * 1000; // 30 minutos
    this.contarTiempo(() => {
      this.preguntarContinuar = true;
      this.sesionesCompletadas++;
      this.iniciarSesionTrabajo();
    });
  }

  iniciarDescansoLargo() {
    this.esTrabajo = false;
    // this.tiempoRestante = 30 * 60 * 1000; // 30 minutos
    this.tiempoRestante = 2 * 60 * 1000; // 30 minutos
    this.contarTiempo(() => {
      this.preguntarContinuar = true;

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
    this.tiempoRestante += 5 * 60 * 1000; // Agrega 55 minutos
    this.preguntarContinuar = false;
  }
  

  constructor() {}

}

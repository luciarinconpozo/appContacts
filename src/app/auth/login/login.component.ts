import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  @ViewChild('myForm') myForm!: NgForm;

  submit() {
    
    this.authService.login(this.myForm.value.email, this.myForm.value.password)
      .subscribe({
        next: response => {
          
          Swal.fire({
            title: "Login correcto",
            text: "Has iniciado sesión",
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(
            () => this.router.navigateByUrl('/contacts') // Redirije a contacts tras el login

          )

        },
        error: error => Swal.fire({
          title: 'Error!',
          text: "Credenciales incorrectas",
          icon: 'error',
          confirmButtonText: 'Aceptar',

        })
      })
  }


}

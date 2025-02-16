import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidateEmailService } from '../services/validate-email.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private emailValidatorService = inject(ValidateEmailService);


  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.emailValidatorService]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.equalFields('password', 'confirmPassword') });


  equalFields(field1: string, field2: string): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const control1 = form.get(field1);
      const control2 = form.get(field2);

      if (control1?.value !== control2?.value) {
        control2?.setErrors({ nonEquals: true });
        return { nonEquals: true };
      }

      // Si los valores son iguales, eliminamos el error solo si 'nonEquals' estaba presente antes
      if (control2?.hasError('nonEquals')) {
        control2.setErrors(null);
        control2.updateValueAndValidity({ onlySelf: true });
      }

      return null;
    };

  }

  get emailErrorMsg(): string {
    const errors = this.registerForm.get('email')?.errors;
    let errorMsg: string = '';
    if(errors){
      if (errors['required']) {
        errorMsg = 'El email es obligatorio'
      }
      else if(errors['email']){
        errorMsg = 'El email no tiene formato de correo';
      }
      else if(errors['emailTaken']){
        errorMsg = 'El email ya está en uso'
      }
    }
    return errorMsg;
  }


  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;

      this.authService.register({ nombre, email, password }).subscribe({
        next: () => {
          Swal.fire({
            title: "Registro correcto",
            text: "Se ha registrado correctamente",
            icon: 'success',
            cancelButtonText: 'Aceptar'
          }).then(
            () => this.router.navigate(['/login']) // Redirige al login tras el registro)
          )

        },
        error: (error) => {
          Swal.fire({
            title: "Error en el registro",
            text: error?.error.error,
            icon: 'error',
            cancelButtonText: 'Aceptar'
          })
          console.log(error)

        }
      });
    }
  }
}


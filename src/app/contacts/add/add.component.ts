import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactsService } from '../services/contacts.service';
import { AuthService } from '../../auth/services/auth.service';
import { forkJoin, Observable } from 'rxjs';
import { Contact } from '../../shared/interfaces/contacts';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html'
})
export class AddComponent {
  contactForm!: FormGroup;
  userId!: string;

  constructor(
    private fb: FormBuilder, 
    private contactService: ContactsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      contacts: this.fb.array([]) // Inicialmente vacío
    });
    this.userId = this.authService.userId;
  }

  // Devuelve el FormArray para manipular los contactos
  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray;
  }

  // Método para crear un contacto
  createContact(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      direccion: ['', Validators.required]
    });
  }

  // Agregar un nuevo contacto al array
  addContact(): void {
    this.contacts.push(this.createContact());
  }

  // Eliminar un contacto por índice
  removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  // Guardar contactos llamando al servicio
  saveContacts(): void {
    if (this.contactForm.invalid) {
      return;
    }
  
    const requests: Observable<Contact>[] = this.contacts.controls.map(contactFormGroup => {
      const contactData = {
        userId: this.userId,
        ...contactFormGroup.value
      };
      return this.contactService.addContact(contactData);
    });
  
    forkJoin(requests).subscribe({
      next: () => {
        Swal.fire({
          title: "Guardado",
          text: "Todos los contactos han sido guardados correctamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        });
        this.contactForm.reset();
        this.contacts.clear();
      },
      error: () => {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar los contactos",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { AddComponent } from "../add/add.component";
import { ContactsService } from '../services/contacts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  imports: [AddComponent],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

  contactsService: ContactsService = inject(ContactsService);

  ngOnInit(): void {
    console.log('Componente list')
    this.contactsService.getContacts();
  }

  removeContact(id: string) {
    Swal.fire({
      title: 'Confirmación borrado',
      text: '¿Estás seguro de que quieres eliminar el registro seleccionado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactsService.removeContact(id)
          .subscribe({
            next: response => {
              Swal.fire({
                title: "Eliminado",
                text: "El contacto ha sido eliminado con éxito",
                icon: "success",
                confirmButtonText: "Aceptar"
              });
            }

          })

      }
    })
  }

}

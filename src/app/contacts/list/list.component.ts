import { Component } from '@angular/core';
import { AddComponent } from "../add/add.component";

@Component({
  selector: 'app-list',
  imports: [AddComponent],
  templateUrl: './list.component.html'
})
export class ListComponent {

}

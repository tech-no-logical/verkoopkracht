import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../../models/note';

@Component({
  selector: 'app-vk-note-modal',
  templateUrl: './vk-note-modal.component.html',
  styles: []
})
export class VkNoteModalComponent implements OnInit {

  note: Note;
  constructor(
    public modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}

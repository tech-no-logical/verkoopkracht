import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { VkNoteService } from '../vk-note.service';
import { Note } from '../../models/note';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-vk-note',
  templateUrl: './vk-note.component.html',
  styleUrls: ['./vk-note.component.css']
})
export class VkNoteComponent implements OnInit {

  noteForm;
  personOptions: Array<{id: number, name: string}> = [];
  organizationOptions: Array<{id: number, name: string}> = [];

  @Input() note: Note;

  constructor(
    private noteService: VkNoteService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.noteService.getOrganizationOptions().subscribe(
      (res) => {
        this.organizationOptions = res;
      }
    );

    this.noteService.getPersonOptions().subscribe(
      (res) => {
        this.personOptions = res;
      }
    );

    this.noteForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      details: [''],
      person_id: [''],
      organization_id: [''],
      archived: ['']
    });

    // if (this.note.id) {
      this.noteForm.setValue(this.note);
    // }

  }

}

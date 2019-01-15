import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../../models/note';
import { VkNoteService } from '../vk-note.service';
import { VkNoteModalComponent } from '../vk-note-modal/vk-note-modal.component';
import { Router } from '@angular/router';
import { VkPersonService } from '../../vk-person/vk-person.service';
import { ToastrService } from 'ngx-toastr';
import { VkService } from '../../vk.service';

@Component({
  selector: 'app-vk-notes',
  templateUrl: './vk-notes.component.html',
  styleUrls: ['./vk-notes.component.css']
})
export class VkNotesComponent implements OnInit {

  modalRef: NgbModalRef;
  notes: Array<Note> = [];
  public filter = { quickFilter: '', filters: { archived: 0 } };
  public hidePager = false;

  @Input() organization_id = 0;
  @Input() pageSize = 20;
  @Input() canDelete = true;
  @Input() size = 'all';

  columnDefs = [
    { mame: '#', field: 'id' },
    { name: 'Omschrijving', field: 'description', qf: true },
    { name: 'Organisatie', field: 'organization', qf: true, emitclick: true },
    { name: 'Status', field: 'status', qf: true },
    { name: 'Persoon', field: 'person', qf: true },
    { name: 'Gewijzigd', field: 'modified' }
  ];

  baseSortOrder = ['coupled', '-modified', 'organization', 'description'];

  constructor(
    private noteService: VkNoteService,
    private modalService: NgbModal,
    private router: Router,
    private personService: VkPersonService,
    private toastService: ToastrService,
    private service: VkService
  ) { }

  ngOnInit() {
    if (this.organization_id) {
      // remove organization if called from overview
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'organization'), 1);
    }

    if (this.size === 'sm') {
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'id'), 1);
      // this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'modified'), 1);
      this.hidePager = true;
    }
    this.getNotes();
  }

  public change(field?) {
    if (field === 'archived') {
      this.filter.filters.archived = (this.filter.filters.archived === 1 ? 0 : 1);
    }
    this.filter = JSON.parse(JSON.stringify(this.filter));
  }

  public addNote() {
    const newNote = new Note();
    if (this.organization_id) {
      this.service.getFirstPersonId(this.organization_id).subscribe(
        (res) => {
          newNote.person_id = res.id;
          newNote.organization_id = this.organization_id;
          this._addNote(newNote);
        }
      );
    } else {
      this._addNote(newNote);
    }
  }

  private _addNote(newNote) {
    this.modalRef = this.modalService.open(VkNoteModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.note = newNote;
    this.modalRef.result.then(
      (note) => {
        this.noteService.createNote(note).subscribe(
          (res) => {
            this.toastService.success('Notitie aangemaakt');
            this.getNotes();
          },
          (err) => this.toastService.error('Er is iets misgegaan')
        );
      },
      (reason) => {
        // dismissed
      }
    );
  }

  public deleteNote(id) {
    if (window.confirm('Verwijderen ?')) {
      this.noteService.deleteNote(id).subscribe(
        (res) => {
          this.toastService.success('Notitie verwijderd');
          this.getNotes();
        },
        (err) => this.toastService.error('Er is iets misgegaan')
      );
    }
  }

  public getNotes() {
    this.noteService.getNotes(this.organization_id).subscribe(
      (res) => { this.notes = res; },
      (err) => this.toastService.error('Er is iets misgegaan')
    );
  }

  public cellClicked($event) {
    if ($event.field === 'organization') {
      console.log(this.notes.find((t) => t.id === $event.id));
      this.router.navigateByUrl('/detail/' + this.notes.find((t) => t.id === $event.id).organization_id);
    }
  }

  public rowClicked(id) {
    this.noteService.getNote(id).subscribe(
      (note) => {
        if (this.size === 'sm' && (note.organization_id || note.person_id)) {
          if (note.organization_id) {
            this.router.navigateByUrl('/detail/' + note.organization_id);
          } else {
            this.personService.getPerson(note.person_id).subscribe(
              (person) => {
                if (person.organization_id) {
                  this.router.navigateByUrl('/detail/' + person.organization_id);
                } else {
                  console.log('task refers to person not belonging to an organization. bailing out.');
                }
              }
            );
          }
        } else {
          this.modalRef = this.modalService.open(VkNoteModalComponent, { size: 'lg' });
          this.modalRef.componentInstance.note = note;
          this.modalRef.result.then(
            (t) => {
              this.noteService.saveNote(t).subscribe(
                (res) => {
                  this.toastService.success('Notitie opgeslagen');
                  this.getNotes();
                },
                (err) => this.toastService.error('Er is iets misgegaan')
              );
            },
            (reason) => {
              // dismissed
            }
          );
        }
      }
    );
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../models/person';
import { VkPersonService } from '../vk-person.service';
import { VkPersonModalComponent } from '../vk-person-modal/vk-person-modal.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vk-persons',
  templateUrl: './vk-persons.component.html',
  styleUrls: ['./vk-persons.component.css']
})
export class VkPersonsComponent implements OnInit {

  modalRef: NgbModalRef;
  persons: Array<Person> = [];
  public filter = { quickFilter: '' };
  public hidePager = false;

  @Input() organization_id = 0;
  @Input() canDelete = true;
  @Input() size = 'all';

  columnDefs = [
    { mame: '#', field: 'id' },
    { name: 'Naam', field: 'name', qf: true },
    { name: 'Organisatie', field: 'organization', qf: true, emitclick: true },
    { name: 'Status', field: 'status', qf: true },
    // { name: 'Email', field: 'email', type: 'email' },
    { name: 'Telefoon', field: 'phone' },
    { name: 'Gewijzigd', field: 'modified' },
    {
      name: 'Taken', field: 'hastasks', type: 'mapped', map: [
        '<div class="text-center p3 bg-secondary text-white">Geen</div>',
        '<div class="text-center p3 bg-success text-white">Te doen</div>',
        '<div class="text-center p3 bg-danger text-white">Te laat</div>'
      ]
    }
  ];
  baseSortOrder = ['coupled', '-hastasks', 'name', 'modified', 'organization', 'status'];

  constructor(
    private personService: VkPersonService,
    private modalService: NgbModal,
    private router: Router,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    if (this.organization_id) {
      // remove organization if called from overview
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'organization'), 1);
    }

    if (this.size === 'sm') {
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'id'), 1);
      // this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'email'), 1);
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'phone'), 1);
      this.hidePager = true;
    }

    this.getPersons();
  }

  change(field?) {
    this.filter = JSON.parse(JSON.stringify(this.filter));
  }

  addPerson() {
    const newPers = new Person();
    if (this.organization_id) {
      newPers.organization_id = this.organization_id;
    }
    this.modalRef = this.modalService.open(VkPersonModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.person = newPers;
    this.modalRef.result.then(
      (pers) => {
        this.personService.createPerson(pers).subscribe(
          (res) => {
            this.toastService.success('Persoon aangemaakt');
            this.getPersons();
          },
          (err) => this.toastService.error('Er is iets misgegaan')
        );
      },
      (reason) => {
        // dismissed
      }
    );
  }

  deletePerson(id) {
    if (window.confirm('Verwijderen ?')) {
      this.personService.deletePerson(id).subscribe(
        (res) => {
          this.toastService.success('Persoon verwijderd');
          this.getPersons();
        },
        (err) => this.toastService.error('Er is iets misgegaan')
      );
    }
  }

  getPersons() {
    this.personService.getPersons(this.organization_id).subscribe(
      (res) => { this.persons = res; },
      (err) => this.toastService.error('Er is iets misgegaan')
    );
  }

  cellClicked($event) {
    if ($event.field === 'organization') {
      // $event.id is the id of the _person_
      console.log(this.persons.find((t) => t.id === $event.id));
      this.router.navigateByUrl('/detail/' + this.persons.find((t) => t.id === $event.id).organization_id);
    }
  }

  rowClicked(id) {
    this.personService.getPerson(id).subscribe(
      (person) => {
        if (this.size === 'sm' && person.organization_id) {
          this.router.navigateByUrl('/detail/' + person.organization_id);
        } else {
          this.modalRef = this.modalService.open(VkPersonModalComponent, { size: 'lg' });
          this.modalRef.componentInstance.person = person;
          this.modalRef.result.then(
            (orga) => {
              this.personService.savePerson(orga).subscribe(
                (res) => {
                  this.toastService.success('Persoon opgeslagen');
                  this.getPersons();
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

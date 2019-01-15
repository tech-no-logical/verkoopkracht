import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../models/task';
import { VkTaskService } from '../vk-task.service';
import { VkTaskModalComponent } from '../vk-task-modal/vk-task-modal.component';
import { Router } from '@angular/router';
import { VkPersonService } from '../../vk-person/vk-person.service';
import { ToastrService } from 'ngx-toastr';
import { VkService } from '../../vk.service';

@Component({
  selector: 'app-vk-tasks',
  templateUrl: './vk-tasks.component.html',
  styleUrls: ['./vk-tasks.component.css']
})
export class VkTasksComponent implements OnInit {

  modalRef: NgbModalRef;
  tasks: Array<Task> = [];
  public filter = { quickFilter: '', filters: { archived: 0, done: 0 } };
  public hidePager = false;

  @Input() organization_id = 0;
  @Input() pageSize = 20;
  @Input() canDelete = true;
  @Input() size = 'all';

  columnDefs = [
    { mame: '#', field: 'id' },
    { name: 'Omschrijving', field: 'description', qf: true },
    { name: 'Organisatie', field: 'organization', qf: true, class: 'd-none d-md-table-cell', emitclick: true },
    { name: 'Status', field: 'status', qf: true, class: 'd-none d-md-table-cell' },
    { name: 'Persoon', field: 'person', qf: true, class: 'd-none d-md-table-cell' },
    { name: 'Gewijzigd', field: 'modified' },
    { name: 'Planning', field: 'planning' },
    {
      name: 'Klaar', field: 'done', type: 'mapped', map: [
        'Nee', 'Ja'
      ]
    }

  ];
  baseSortOrder = ['coupled', 'planning', '-modified', 'description', 'organization', 'status'];

  constructor(
    private taskService: VkTaskService,
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
      this.columnDefs.splice(this.columnDefs.findIndex((col) => col.field === 'done'), 1);
      this.hidePager = true;
    }

    this.getTasks();
  }

  change(field?) {
    if (field === 'archived') {
      this.filter.filters.archived = (this.filter.filters.archived === 1 ? 0 : 1);
    }
    if (field === 'done') {
      this.filter.filters.done = (this.filter.filters.done === 1 ? 0 : 1);
    }
    this.filter = JSON.parse(JSON.stringify(this.filter));
  }

  public addTask() {
    const newTask = new Task();
    if (this.organization_id) {
      this.service.getFirstPersonId(this.organization_id).subscribe(
        (res) => {
          newTask.person_id = res.id;
          newTask.organization_id = this.organization_id;
          this._addTask(newTask);
        }
      );
    } else {
      this._addTask(newTask);
    }
  }


  _addTask(newTask) {

    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    newTask.planning = nextWeek.getFullYear() + '-' +
      ('0' + (nextWeek.getMonth() + 1)).slice(-2) + '-' +
      ('0' + nextWeek.getDate()).slice(-2);
    this.modalRef = this.modalService.open(VkTaskModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.task = newTask;
    this.modalRef.result.then(
      (task) => {
        this.taskService.createTask(task).subscribe(
          (res) => {
            this.toastService.success('Taak aangemaakt');
            this.getTasks();
          },
          (err) => this.toastService.error('Er is iets misgegaan')
        );
      },
      (reason) => {
        // dismissed
      }
    );
  }

  deleteTask(id) {
    if (window.confirm('Verwijderen ?')) {
      this.taskService.deleteTask(id).subscribe(
        (res) => {
          this.toastService.success('Taak verwijderd');
          this.getTasks();
        },
        (err) => this.toastService.error('Er is iets misgegaan')
      );
    }
  }

  getTasks() {
    this.taskService.getTasks(this.organization_id).subscribe(
      (res) => { this.tasks = res; },
      (err) => this.toastService.error('Er is iets misgegaan')
    );
  }

  cellClicked($event) {
    if ($event.field === 'organization') {
      // $event.id is the id of the _task_
      console.log(this.tasks.find((t) => t.id === $event.id));
      this.router.navigateByUrl('/detail/' + this.tasks.find((t) => t.id === $event.id).organization_id);
    }
  }

  rowClicked(id) {
    this.taskService.getTask(id).subscribe(
      (task) => {
        if (this.size === 'sm' && (task.organization_id || task.person_id)) {
          if (task.organization_id) {
            this.router.navigateByUrl('/detail/' + task.organization_id);
          } else {
            this.personService.getPerson(task.person_id).subscribe(
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

          this.modalRef = this.modalService.open(VkTaskModalComponent, { size: 'lg' });
          this.modalRef.componentInstance.task = task;
          this.modalRef.result.then(
            (t) => {
              this.taskService.saveTask(t).subscribe(
                (res) => {
                  this.toastService.success('Taak opgeslagen');
                  this.getTasks();
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

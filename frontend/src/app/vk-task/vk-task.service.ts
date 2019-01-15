import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class VkTaskService {

  protected url = AppConfig.settings.config.url;

  constructor(
    private http: HttpClient
  ) { }

  getTasks(organization_id?: number) {
    let qs = '';
    if (organization_id) {
      qs = '?org=' + organization_id.toString();
    }
    return this.http.get<Array<Task>>(this.url + '/tasks' + qs);
  }

  getTask(id) {
    return this.http.get<Task>(this.url + '/tasks/' + id);
  }

  createTask(org: Task) {
    return this.http.post<Task>(this.url + '/tasks/', org);
  }

  saveTask(org: Task) {
    return this.http.put<Task>(this.url + '/tasks/' + org.id, org);
  }

  deleteTask(id) {
    return this.http.delete(this.url + '/tasks/' + id);
  }

  getOrganizationOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/list');
  }

  getPersonOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/persons/list');
  }
}

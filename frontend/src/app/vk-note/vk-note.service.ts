import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Note } from '../models/note';


@Injectable({
  providedIn: 'root'
})
export class VkNoteService {

  protected url = AppConfig.settings.config.url;

  constructor(
    private http: HttpClient
  ) { }

  getNotes(organization_id) {
    let qs = '';
    if (organization_id) {
      qs = '?org=' + organization_id.toString();
    }
    return this.http.get<Array<Note>>(this.url + '/notes' + qs);
  }

  getNote(id) {
    return this.http.get<Note>(this.url + '/notes/' + id);
  }

  createNote(org: Note) {
    return this.http.post<Note>(this.url + '/notes/', org);
  }

  saveNote(org: Note) {
    return this.http.put<Note>(this.url + '/notes/' + org.id, org);
  }

  deleteNote(id) {
    return this.http.delete(this.url + '/notes/' + id);
  }

  getOrganizationOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/list');
  }

  getPersonOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/persons/list');
  }
  // getStatusOptions() {
  //   return this.http.get<Array<{ id: number, name: string }>>(this.url + '/notes/statuses');
  // }
}

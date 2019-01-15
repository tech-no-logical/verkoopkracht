import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Organization } from '../models/organization';

@Injectable({
  providedIn: 'root'
})
export class VkOrganizationService {

  protected url = AppConfig.settings.config.url;

  constructor(
    private http: HttpClient
  ) { }

  getOrganizations() {
    return this.http.get<Array<Organization>>(this.url + '/organizations');
  }

  getOrganization(id) {
    return this.http.get<Organization>(this.url + '/organizations/' + id);
  }

  createOrganization(org: Organization) {
    return this.http.post<Organization>(this.url + '/organizations/', org);
  }

  saveOrganization(org: Organization) {
    return this.http.put<Organization>(this.url + '/organizations/' + org.id, org);
  }

  deleteOrganization(id) {
    return this.http.delete(this.url + '/organizations/' + id);
  }

  getStatusOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/statuses');
  }

  getSectorOptions() {
    return this.http.get<Array<{ id: number, name: string }>>(this.url + '/organizations/sectors');
  }
}

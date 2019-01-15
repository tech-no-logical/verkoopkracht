import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from './app-config';

@Injectable()
export class AppConfig {

    static settings: IAppConfig;

    constructor(private http: HttpClient) { }

    load() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get<IAppConfig>(jsonFile).subscribe(
                (res) => { AppConfig.settings = res; resolve(); },
                (err) => { reject(`Could not load file '${jsonFile}': ${JSON.stringify(err)}`); }
            );
        });
    }
}

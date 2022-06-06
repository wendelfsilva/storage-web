import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PaginatedResult} from "@shared/models/paginated-result";
import {from, Observable} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {URLS} from 'src/app/app-server.urls';
import {environment} from '@env';
import {Document} from "../models/document";

@Injectable()
export class DocumentService {

    private _URL = `${environment.apiUrl}${URLS.DOCUMENT}`;
    private _PARAMETERS = new HttpParams();

    constructor(private http: HttpClient) {
    }

    addParams(key: string, value: any): void {
        if (this._PARAMETERS.has(key)) {
            this._PARAMETERS = this._PARAMETERS.set(key, value);
        } else {
            this._PARAMETERS = this._PARAMETERS.append(key, value);
        }
    }

    clearParams(): void {
        this._PARAMETERS = new HttpParams();
    }

    paginated(): Observable<PaginatedResult<Document>> {
        return this.http.get<PaginatedResult<Document>>(this._URL, this._options())
            .pipe(
                tap(response => response as PaginatedResult<Document>),
            );
    }

    upload(path: string, file: File): Observable<Document> {
        const data = new FormData();
        data.append("path", path);
        data.append("file", file);

        return this.http.post<Document>(this._URL, data, this._options());
    }

    download(path: string): Observable<Blob> {
        const url = `${this._URL}download${path}`;
        return this.http.get<Blob>(url, this._options("blob"));
    }

    private _options(responseType?: any): {} {
        const options: any = {};

        if (this._PARAMETERS) {
            options['params'] = this._PARAMETERS;
        }
        if (responseType) {
            options['responseType'] = responseType;
        }
        return options;
    }
}

import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {shareReplay, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../models/user';

import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Observable} from "rxjs";
import {URLS} from "../../app-server.urls";
import {StorageService} from "./storage.service";

export interface JwtToken {
    access: string;
    refresh: string;
}

export interface JwtDecodeToken {
    user: User;
    exp: number;
    jti: string;
    token_type: string;
}

@Injectable()
export class AuthService {
    private readonly apiUrl: string;
    private readonly userUrl: string;

    constructor(private _http: HttpClient,
                private _router: Router,
                private _storage: StorageService) {
        this.apiUrl = environment.apiUrl;
        this.userUrl = `${this.apiUrl}${URLS.USER}`;
    }

    get user(): User | null {
        const payload = this._decodeToken();
        return payload ? payload.user : null;
    }

    get token(): string | null {
        return this._storage.get('token');
    }

    login(username: string, password: string) {
        const url = `${environment.apiUrl}${URLS.TOKEN}`;
        const data = {username, password};

        return this._http.post<JwtToken>(url, data).pipe(
            tap(response => this._setSession(response)),
            shareReplay(),
        );
    }

    refreshToken(): Observable<JwtToken> {
        const token = this._refreshToken();
        const url = `${environment.apiUrl}${URLS.REFRESH_TOKEN}`;
        const data = {refresh: token};

        return this._http.post<JwtToken>(url, data).pipe(
            tap(response => this._setToken(response)),
        );
    }

    logout(goToLogin: boolean = true) {
        this._storage.del('token');
        this._storage.del('refreshToken');
        this._storage.del("preferences");

        if (goToLogin) {
            this._router.navigate(['login']).then();
        }
    }

    isLoggedIn() {
        return moment().isBefore(this._expiration());
    }

    _refreshToken(): string | null {
        return this._storage.get('refreshToken');
    }

    _setToken(jwtToken: JwtToken) {
        this._storage.set('token', jwtToken.access);
    }

    _setSession(jwtToken: JwtToken) {
        this._storage.set('token', jwtToken.access);
        this._storage.set('refreshToken', jwtToken.refresh);
    }

    _decodeToken(): JwtDecodeToken | null {
        const token = this.token;
        return token ? jwt_decode(token) as JwtDecodeToken : null;
    }

    _expiration(): Moment | null {
        const payload = this._decodeToken();
        return payload ? moment.unix(payload.exp) : null;
    }
}

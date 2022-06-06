import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from "@shared/services/translate.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
                private toast: ToastrService,
                private translate: TranslateService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            url: req.url,
            setHeaders: {
                'Accept-Language': `${this.translate.currentLang}`,
                'Authorization': `Bearer ${this.authService.token}`
            }
        });

        return next.handle(req).pipe(catchError(err => {
            if (err.status === 401 || err.status === 403) {
                this.authService.logout();
            }
            if (err.error instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener("loadend", () => {
                    this._showErrors(err.statusText, JSON.parse(reader.result!.toString()));
                });
                reader.readAsText(err.error);
            } else if (err.error['non_field_errors'] || err.error['detail']) {
                this._showErrors(err.statusText, err.error);
            } else {
                this.toast.error(`[${err.statusText}]: ${JSON.stringify(err.error)}`);
            }

            return throwError(err.error);
        }));
    }

    _showErrors(title: string, value: any): void {
        Object.keys(value).forEach((key: any) => {
            this.toast.error(`[${title}]: ${value[key]}`);
        });
    }

}

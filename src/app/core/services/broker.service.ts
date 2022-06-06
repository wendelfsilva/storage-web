import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class BrokerService<T> {

    private subject = new Subject<T>();

    connect(): Observable<T> {
        return this.subject.asObservable();
    }

    emit(data: T) {
        this.subject.next(data);
    }
}

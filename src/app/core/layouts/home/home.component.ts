import {Component} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    user?: string;

    constructor(private breakpointObserver: BreakpointObserver,
                private authService: AuthService) {

        this.user = authService.user?.username;
    }

    logout() {
        this.authService.logout();
    }
}

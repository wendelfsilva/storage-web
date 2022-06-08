import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Title} from '@angular/platform-browser';
import {tap} from 'rxjs';
import {Document} from '../../models/document';
import {DocumentService} from '../../services/document.service';
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastService} from "@shared/services/toast.service";

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

    formUpload = this.fb.group({
        path: [null, Validators.pattern('^(\\/[A-z0-9-_+]+)(\\/\\w+)*([\\/]|[.][a-zA-Z]+)?$')],
    });

    formDownload = this.fb.group({
        path: [null, Validators.pattern('^\\/[A-z0-9-_+]+.*$')]
    });

    formSearch = this.fb.group({
        id: [null],
        path: [null],
        start_date: [null],
        end_date: [null],
    });

    displayedColumns = [
        'id',
        'file_name',
        'path',
        'uploaded_at',
    ];
    dataSource: MatTableDataSource<Document> = new MatTableDataSource<Document>();
    length = 0;

    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private spinner: NgxUiLoaderService,
        private toast: ToastService,
        private title: Title
    ) {
        this.title.setTitle("Document");
    }

    ngOnInit(): void {
        this.createPaginator();
        this.search();
    }

    createPaginator(): void {
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 5;
        this.paginator.pageSizeOptions = [5, 10, 25, 50];
        this.paginator.showFirstLastButtons = true;
        this.paginator.page
            .pipe(tap(() => this.search()))
            .subscribe();
    }

    search(): void {
        this.service.clearParams();
        this.service.addParams('limit', this.paginator.pageSize);
        this.service.addParams('offset', (this.paginator.pageIndex * this.paginator.pageSize));

        if (this.formSearch.value.path) {
            this.service.addParams('path', this.formSearch.value.path);
        }
        if (this.formSearch.value.start_date && this.formSearch.value.end_date) {
            this.service.addParams("start_date", this.formSearch.value.start_date);
            this.service.addParams("start_date", this.formSearch.value.end_date);
        } else if (this.formSearch.value.start_date && !this.formSearch.value.end_date) {
            this.service.addParams("start_date", this.formSearch.value.start_date);
            this.service.addParams("start_date", this.formSearch.value.start_date);
        } else if (!this.formSearch.value.start_date && this.formSearch.value.end_date) {
            this.service.addParams("start_date", this.formSearch.value.end_date);
            this.service.addParams("start_date", this.formSearch.value.end_date);
        }

        this.service.paginated()
            .subscribe((response) => {
                this.length = response.count;
                this.dataSource.data = response.results;
            });
    }

    upload(event: any): void {
        this.spinner.start();

        const path = this.formUpload.value.path;
        if (event.target.files && event.target.files.length > 0) {
            const [file] = event.target.files;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.service.clearParams();
                this.service.upload(path, file).subscribe(() => {
                    this.toast.success('general.uploaded_successfully');
                    this.search();
                });

                this.spinner.stop();
            };
        }
    }

    download(): void {
        this.spinner.start();

        const path = this.formDownload.value.path;
        const fileName = path.split('/').pop().split('#')[0].split('?')[0];

        this.service.clearParams();
        this.service.download(path).subscribe(response => {
            this.toast.success('general.downloaded_successfully');
            this._downloadFileFromBlob(response, fileName);

            this.spinner.stop();
        });
    }

    _downloadFileFromBlob(file: Blob, fileName: string): void {
        const blob = new Blob([file], {type: file.type});
        const URL = window.URL || window.webkitURL;
        const fileUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.download = fileName;
        anchor.href = fileUrl;
        anchor.click();

        window.URL.revokeObjectURL(fileUrl);

        anchor.remove();
    }
}

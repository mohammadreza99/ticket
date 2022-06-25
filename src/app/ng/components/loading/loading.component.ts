import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '@core/utils';

@Component({
  selector: 'ng-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  loading: boolean;
  @Input() static = false;
  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((v) => {
      if (!this.static)
        this.loading = v;
      else {
        this.loading = true
      }
    });
  }

  ngOnInit(): void { }
}

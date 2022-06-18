import { Component, OnInit } from '@angular/core';
import { ActivationEnd, ActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MenuType } from '@core/models/menu-types.mode';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ng-main-page',
  templateUrl: './main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit {
  constructor(private router: Router) {
  }

  sidebarVisible = false;
  sidebarLock = false;
  menuType: MenuType = 'hover';
  sidebarItems: MenuItem[] = [
    {
      label: 'اپراتورها',
      icon: 'fad fa-users',
      routerLink: '/operator'
    },
    {
      label: 'دسته‌بندی پرسش و پاسخ',
      icon: 'fad fa-question-circle',
      routerLink: '/faq-category'
    },
    {
      label: 'سوالات متداول',
      icon: 'fad fa-question',
      routerLink: '/faq'
    },
    {
      label: 'باگ',
      icon: 'fad fa-bug',
      routerLink: '/bug'
    },
    {
      label: 'تیکت',
      icon: 'fad fa-ticket',
      routerLink: '/ticket'
    },
    {
      label: 'پاسخ پیش فرض',
      icon: 'fad fa-file-check',
      routerLink: '/default-answer'
    },
    {
      label: 'پوسته‌ها',
      icon: 'fad fa-th-large',
    },
  ];

  // default route data
  currentTitle: string = 'bug'

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof ActivationStart)).subscribe((res: any) => {
      this.currentTitle = res.snapshot.data.title
    })
  }

  onSidebarVisibleChange(event: boolean) {
    this.sidebarVisible = event;
  }
}

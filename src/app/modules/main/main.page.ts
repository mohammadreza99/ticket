import {Component, HostListener, OnInit} from '@angular/core';
import {MenuType} from '@core/models/menu-types.mode';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'ng-main-page',
  templateUrl: './main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage implements OnInit {
  constructor() {
  }

  sidebarVisible = false;
  sidebarLock = false;
  menuType: MenuType = 'hover';
  sidebarItems: MenuItem[] = [

    // {
    //   label: 'File',
    //   icon: 'fad fa-file',
    //   // routerLink: 'dashboard',
    //   items: [
    //   { label: 'Open', icon: 'pi pi-fw pi-external-link'},
    //   { label: 'Quit', icon: 'pi pi-fw pi-times' }
    //   ]
    // },
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

  @HostListener('window:resize', ['$event']) onResize(e) {
    this.handleResize();
  }

  ngOnInit(): void {
    this.handleResize();
  }

  handleResize() {
    if (window.innerWidth < 767) {
      this.onMenuTypeChange('overlay');
      this.toggleOverlayDisplay(false);
    } else {
      // TODO
      this.onMenuTypeChange('hover');
    }
  }


  getClasses() {
    let classes = `menu-${this.menuType}`;

    classes += ' rtl ';

    if (this.sidebarLock) {
      classes += ' sidebar-lock ';
    }
    if (this.sidebarVisible) {
      classes += ' sidebar-open ';
    }
    return classes;
  }

  onMenuTypeChange(event: MenuType) {
    this.menuType = event;
    if (event == 'hover') {
      this.onSidebarVisibleChange(true);
    } else {
      this.onSidebarVisibleChange(false);
    }
    this.onSidebarLockChange(false);
  }

  onSidebarVisibleChange(event: boolean) {
    this.sidebarVisible = event;
    if (this.menuType == 'overlay' || this.menuType == 'push') {
      setTimeout(() => {
        if (this.sidebarVisible) {
          this.toggleOverlayVisibility(false);
        }
      }, 0);
    }
  }

  onSidebarLockChange(event: boolean) {
    this.sidebarLock = event;
    if (this.menuType == 'overlay' || this.menuType == 'overlay-mask' || this.menuType == 'push' || this.menuType == 'push-mask') {
      this.toggleOverlayDisplay(!event);
    }
  }

  toggleOverlayDisplay(activate: boolean) {
    const overlay = document.querySelector('.p-sidebar-mask');
    const body = document.body;
    if (activate) {
      overlay?.classList.remove('d-none');
      body.classList.add('p-overflow-hidden');
    } else {
      overlay?.classList.add('d-none');
      body.classList.remove('p-overflow-hidden');
    }
  }

  toggleOverlayVisibility(activate: boolean) {
    const overlay = document.querySelector('.p-sidebar-mask') as any;
    if (overlay) {
      if (activate) {
        overlay.style.transitionDuration = '0.2ms';
        overlay.style.opacity = 1;
      } else {
        overlay.style.transitionDuration = '0ms';
        overlay.style.opacity = 0;
      }
    }
  }
}

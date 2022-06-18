import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "@modules/auth/login/auth.service";
import { UtilsService } from '@ng/services';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'ng-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss']
})
export class NavbarMenuComponent implements OnInit {

  accountItems: MenuItem[] = [
    {
      label: 'خروج',
      icon: 'pi pi-sign-out',
      command: async () => {
        const dialogRes = await this.utilsService.showConfirm(
          {
            header: 'خروج از سایت',
            message: 'آیا برای خروج اطمینان دارید؟',
            acceptLabel: 'بلی',
            rejectLabel: 'خیر'
          }
        );
        if (dialogRes) {
          this.authService.logout();
          this.router.navigate(['/auth/login'])
        }
      }
    }
  ];

  @Input() sidebarVisible: boolean = false;
  @Output() sidebarVisibleChange = new EventEmitter<boolean>();
  @Input() user: any;
  @Input() sidebarItems: MenuItem[];

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibleChange.emit(this.sidebarVisible);
  }
}

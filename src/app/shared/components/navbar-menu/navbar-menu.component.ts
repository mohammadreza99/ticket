import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UtilsService} from '@ng/services';
import {MenuItem} from 'primeng/api';
import {MenuType} from '@core/models/menu-types.mode';
import {Sidebar} from 'primeng/sidebar';
import {AuthService} from "@modules/auth/login/auth.service";

@Component({
  selector: 'ng-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss']
})
export class NavbarMenuComponent
  implements OnInit {
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
  settingSidebarVisible: boolean = false;
  fixedIconsActive: boolean = false;
  selectedTheme = 'lara-light-indigo';
  sidebarItems: MenuItem[];
  themes: MenuItem[];
  menuTypes: MenuItem[];
  activeMenu;
  @ViewChild(Sidebar) sidebar: Sidebar;
  @ViewChild('sidebarIcon') sidebarIcon: ElementRef;
  @Input() sidebarVisible: boolean = false;
  @Output() sidebarVisibleChange = new EventEmitter<boolean>();
  @Input() sidebarLock: boolean = false;
  @Output() sidebarLockChange = new EventEmitter<boolean>();
  @Input() menuType: MenuType;
  @Output() menuTypeChange = new EventEmitter<MenuType>();
  @Input() user: any;

  @Input('sidebarItems') set setSidebarItems(items: MenuItem[]) {
    this.sidebarItems = items;
    for (let i = 0; i < this.sidebarItems.length; i++) {
      Object.assign(this.sidebarItems[i], {id: i})
      if (this.sidebarItems[i].routerLink) {
        Object.assign(this.sidebarItems[i], {
          command: (args) => {
            if (!this.sidebarLock && this.menuType == 'overlay') {
              this.toggleSidebar(false);
            }
          }
        });
      }
    }
  };

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
  }

  onMenuItemClick(args, menuItem) {
    // console.log(args.path[0].innerText);
    this.activeMenu = menuItem.id;
    if (!this.sidebarLock)
      this.handleSidebarLockToggler();
  }

  onPanelMenuIconsHover(args) {
    console.log(this.sidebar);
  }

  ngOnInit() {
    this.loadData();
    setTimeout(() => {
      this.fixedIconsActive = true
    }, 200);
  }

  handleSidebarToggler() {
    this.sidebarVisible = !this.sidebarVisible;
    this.toggleSidebar(this.sidebarVisible);
  }

  handleSidebarLockToggler() {
    this.sidebarLock = !this.sidebarLock;
    this.fixedIconsActive = !this.sidebarLock;
    this.toggleSidebarLock(this.sidebarLock);
    if (this.sidebarLock)
      this.renderer.setStyle(this.sidebarIcon.nativeElement, 'transform', 'rotate(180deg)');
    else
      this.renderer.setStyle(this.sidebarIcon.nativeElement, 'transform', 'rotate(0)');

  }

  onMenuTypeChange(event: any) {
    this.menuType = event.value;
    this.menuTypeChange.emit(this.menuType);
  }

  toggleSidebar(activate: boolean) {
    this.sidebarVisible = activate;
    this.sidebarVisibleChange.emit(this.sidebarVisible);
  }

  toggleSidebarLock(activate: boolean) {
    this.sidebarLock = activate;
    this.sidebarLockChange.emit(this.sidebarLock);
  }

  loadData() {
    const menuTypes = ['overlay', 'overlay-mask', 'push', 'push-mask', 'hover', 'static', 'horizontal'];
    this.menuTypes = menuTypes.map((t) => ({label: t, value: t}));
  }

  get isModalSidebar() {
    return (this.menuType == 'overlay' || this.menuType == 'overlay-mask' || this.menuType == 'push' || this.menuType == 'push-mask');
  }
}

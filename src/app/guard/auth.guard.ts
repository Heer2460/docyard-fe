import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RoleActionConstants} from "../util/role.actions.constants";
import {AppService} from "../service/app.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private appService: AppService) {
  }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        /*if (this.validateRoute(state.url.split('?')[0])) {
            console.log('in', this.validateRoute(state.url.split('?')[0]))
            return this.validateRoute(state.url.split('?')[0]);
        } else {
            console.log('out', this.validateRoute(state.url.split('?')[0]))
            this.router.navigate(['/home']);
            // this.appService.logout();
            return false;
        }*/
        return true;

    }

    validateRoute(currentUrl: string): boolean {
        switch (currentUrl) {
            case RoleActionConstants.USER_MAIN_ROUTE.url:
                return RoleActionConstants.USER_MAIN_ROUTE.valid;

            case RoleActionConstants.USER_ROUTE.url:
                return RoleActionConstants.USER_ROUTE.valid;
          case RoleActionConstants.USER_ADD_ROUTE.url:
            return RoleActionConstants.USER_ADD_ROUTE.valid;
            case RoleActionConstants.USER_VIEW_ROUTE.url:
                return RoleActionConstants.USER_VIEW_ROUTE.valid;
            case RoleActionConstants.USER_EDIT_ROUTE.url:
                return RoleActionConstants.USER_EDIT_ROUTE.valid;

          case RoleActionConstants.GROUP_ROUTE.url:
            return RoleActionConstants.GROUP_ROUTE.valid;
          case RoleActionConstants.GROUP_ADD_ROUTE.url:
            return RoleActionConstants.GROUP_ADD_ROUTE.valid;
          case RoleActionConstants.GROUP_VIEW_ROUTE.url:
            return RoleActionConstants.GROUP_VIEW_ROUTE.valid;
          case RoleActionConstants.GROUP_EDIT_ROUTE.url:
            return RoleActionConstants.GROUP_EDIT_ROUTE.valid;

          case RoleActionConstants.ROLE_ROUTE.url:
            return RoleActionConstants.ROLE_ROUTE.valid;
          case RoleActionConstants.ROLE_ADD_ROUTE.url:
            return RoleActionConstants.ROLE_ADD_ROUTE.valid;
          case RoleActionConstants.ROLE_VIEW_ROUTE.url:
            return RoleActionConstants.ROLE_VIEW_ROUTE.valid;
          case RoleActionConstants.ROLE_EDIT_ROUTE.url:
            return RoleActionConstants.ROLE_EDIT_ROUTE.valid;

          case RoleActionConstants.REFERENCE_MAIN_ROUTE.url:
            return RoleActionConstants.REFERENCE_MAIN_ROUTE.valid;

          case RoleActionConstants.DEPARTMENT_ROUTE.url:
            return RoleActionConstants.DEPARTMENT_ROUTE.valid;
          case RoleActionConstants.DEPARTMENT_ADD_ROUTE.url:
            return RoleActionConstants.DEPARTMENT_ADD_ROUTE.valid;
          case RoleActionConstants.DEPARTMENT_VIEW_ROUTE.url:
            return RoleActionConstants.DEPARTMENT_VIEW_ROUTE.valid;
          case RoleActionConstants.DEPARTMENT_EDIT_ROUTE.url:
            return RoleActionConstants.DEPARTMENT_EDIT_ROUTE.valid;

            default:
                this.appService.logout();
                this.router.navigate(['/login']);
                return false;
        }
    }
  
}

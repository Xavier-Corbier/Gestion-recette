import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {UtilisateurService} from "../services/utilisateur.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private utilisateurService : UtilisateurService,
              private router : Router) {
  }

  /**
   * Fonction qui permet de vérifier le droit de l'utilisateur connecté
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      let sub: Subscription = this.utilisateurService.getCurrentUser().subscribe(user => {
        sub.unsubscribe();
        if (user) { // utilisateur connecté
          if(route.data["roles"]){
            if(route.data["roles"] == "admin" && user.getDroitAdmin()){ // on a besoin d'être admin
              resolve(true);
            }
            else{ // pas admin
              resolve(this.router.parseUrl('/'));
            }
          }
          resolve(true);
        } else { // utilisateur non connecté
          resolve(this.router.parseUrl('/'));
        }
      });

      this.utilisateurService.checkRechargePageGuard();// on lance la subscription si on vient de recharger la page
    })

  }

}

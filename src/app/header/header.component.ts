import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  monRole: any;
  refresh() : void
  {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.route.navigate([currentUrl]);
    });
  }
  currentUser: any = {};
  currentSeller: any;
  shops: any;
  currentStore: any;
  constructor(private router : ActivatedRoute,private service : AuthService, private httpService : HttpClientService, public route : Router, public location: Location) { }

  switch(shop : any)
  {
    localStorage.setItem('mesProduits', JSON.stringify(shop.produit));
    localStorage.setItem('mesCategories', JSON.stringify(shop.categories));
    localStorage.removeItem('panier');
    this.httpService.openSnackBar(shop.nomBoutique + ' a été choisie avec succès');
  }
  link(event : any)
  {
    const allItems = document.querySelectorAll(".nav__item");
    allItems.forEach(element =>
    {
      element.classList.remove('active');
    });
    const daItem = document.querySelector(event);
    daItem.classList.add('active');
  }
  open()
  {
    document.querySelector('.popup-container')?.classList.remove('hidden');
  }
  close()
  {
    document.querySelector('.popup-container')?.classList.add('hidden');
  }
  deconnexion()
  {
    this.service.deconnecter();
  }
  ngOnInit(): void
  {
    const allItems = document.querySelectorAll(".nav__item");
    allItems.forEach(element =>
    {
      element.classList.remove('active');
    });
    const path = this.router.snapshot.routeConfig?.path;
    const daItem = document.querySelector(`[href*=${path}]`);
    daItem?.classList.add('active');

    // -- LocalStorage Method
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    this.monRole = this.currentUser?.roles[0];
    this.currentStore= JSON.parse(localStorage.getItem('boutique') || '[]');
    this.shops = JSON.parse(localStorage.getItem('mes_boutiques') || '[]');

  }
}

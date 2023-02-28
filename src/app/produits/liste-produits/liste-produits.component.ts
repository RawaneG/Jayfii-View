import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpClientService } from 'src/app/services.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-liste-produits',
  templateUrl: './liste-produits.component.html',
  styleUrls: ['./liste-produits.component.scss']
})
export class ListeProduitsComponent implements OnInit
{
  spin : boolean = true;
  panelOpenState = false;
  mesProduits : any[] = [];
  mesCategories : any;
  pageSlice : any;
  category : any;
  isSelected !: boolean;
  isChecked : any = 'decochee';
  currentStore: any;
  currentShop: any;

  constructor(private httpService : HttpClientService, public route : Router, public location: Location) { }

  refresh()
  {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.route.navigate([currentUrl]);
    });
  }
  onPageChange(event : PageEvent)
  {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.mesProduits.length)
    {
      endIndex = this.mesProduits.length;
    }
    this.pageSlice = this.mesProduits.slice(startIndex, endIndex);
  }
  toTrash()
  {
    if(this.isSelected == true)
    {
      this.mesProduits.forEach((element : any) =>
      {
        element.etat = true;
        this.httpService.putUrl(this.httpService.produitUrl + '/' + element.id, element);
        setTimeout(() => {
        }, 500);
        location.reload();
      });
    }
    else
    {
      if(this.isChecked !== 'decochee')
      {
        this.isChecked.etat = true;
        this.httpService.putUrl(this.httpService.produitUrl + '/' + (+this.isChecked.id), this.isChecked);
        setTimeout(() => {

        }, 500);
        location.reload();
      }
    }
  }
  check(event : any)
  {
    if(event.checked === true)
    {
      this.isSelected = true;
    }
    else
    {
      this.isSelected = false;
    }
  }
  coche(event : any, produit : any)
  {
    if(event.checked == true)
    {
      this.isChecked = produit;
    }
    else
    {
      this.isChecked = 'decochee';
    }
  }
  selectCategorie(event : any)
  {
    this.category = event.nom;
  }
  filtreStock()
  {
    this.mesProduits = [];
    this.httpService.getUrl(this.httpService.shopUrl).subscribe
    (
      (reponse) =>
      {
        this.currentShop = this.httpService.getElementById(this.currentStore.id, reponse);
        this.currentShop?.produit.forEach((element : any) =>
        {
          if(element.etat == false)
          {
            if(element.quantiteEnStock <= element.limite)
            {
              this.mesProduits.push(element);
            }
          }
        });
        this.pageSlice = this.mesProduits.slice(0 , 5);
      }
    );
  }
  ngOnInit(): void
  {
    setTimeout(() => {
      this.spin = false;
    }, 500);
    this.mesProduits = JSON.parse(localStorage.getItem('mesProduits') || '[]');
    this.pageSlice = this.mesProduits.slice(0 , 5);
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) => {this.mesCategories = reponse}
    );
  }

}

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor( @Inject(DOCUMENT) private document: Document ) { }

  switchTheme(theme: boolean) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    let body = this.document.getElementsByTagName('body')[0];
    console.log(themeLink);
    console.log(body);
    console.log(theme)
    if(!theme){
      // Falso es light
      themeLink.href = './lara-light-blue.css';
      body.classList.add('light')
        body.classList.remove('dark')
    }else{
      // Verdadero es dark
      themeLink.href = './arya-blue.css';
      body.classList.add('dark')
      body.classList.remove('light')
    }

  }
}

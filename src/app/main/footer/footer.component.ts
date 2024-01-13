// Iniciar componente de angular

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem  } from 'primeng/api';
import { Menu } from 'primeng/menu';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

}

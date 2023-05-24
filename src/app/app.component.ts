import { Component } from '@angular/core';
import { ScrappingService } from './services/scrapping.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ ScrappingService ]
})
export class AppComponent {
  title = 'fe-goleadores-femebal';

  constructor(private scrappingService: ScrappingService) { }

  ngOnInit(): void {
    this.scrappingService.visitCount().subscribe( res => {
      // console.log(res);
    });
  }
}

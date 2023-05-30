import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent } from './main/footer/footer.component';
import { HeaderComponent } from './main/header/header.component';
import { LayoutComponent } from './main/layout/layout.component';
import { ScrappingService } from './services/scrapping.service';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { FairPlayComponent } from './fairplay/fairplay.component';
import { TableComponent } from './table/table.component';


import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LayoutComponent,
    TableComponent,
    SpinnerOverlayComponent,
    HeaderComponent,
    FairPlayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessagesModule,
    ToastModule,
    ConfirmDialogModule,
    InputSwitchModule,
    MenubarModule,
    TooltipModule
  ],
  providers: [
    ScrappingService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

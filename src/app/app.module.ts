import { provideHttpClient } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { Produts } from "./produts/produts";
import { AppServices } from "./app.service";
import { CurrencyPipe, CommonModule } from '@angular/common';

@NgModule({
  // declarations: [
  //   Produts
  // ],
  providers: [
    AppServices,
    provideHttpClient()
  ]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
// import { routes } from './adddepartment-routing.module;
import { Produts } from './produts';
import { AppServices } from '../app.service';
import { RouterModule } from '@angular/router';
 
@NgModule({
//   declarations: [Produts],
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    FormsModule
  ]
})
@NgModule({
  declarations: [Produts],
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ProdutsModule { }

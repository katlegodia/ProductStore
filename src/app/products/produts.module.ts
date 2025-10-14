import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
// import { routes } from './adddepartment-routing.module';
import { Products } from './products'; // Uncomment and correct this line if 'Products' is exported from './products'
import { AppServices } from '../app.service';
import { RouterModule } from '@angular/router';
 
@NgModule({
  // declarations: [Products],
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    FormsModule
  ]
})
export class AdddepartmentModule { }
 
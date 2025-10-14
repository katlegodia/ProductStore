import { environment } from "./environment";
// import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@anng gular/common/http";
import { inject, Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // <-- Correct import

@Injectable({
  providedIn: 'root'
})
export class AppServices {   

    private apiUrl: string = environment.Endpoint;    
    private http = inject(HttpClient);

    // constructor(()) {
    // //     // this.getProducts();
    // }

    getProducts() {
        console.log('getProducts called');
        
        const url = `${this.apiUrl}/products`;
        console.log(url);
        return this.http.get(url);
    }

    getProductById(id: any) {
        console.log('getProductById called with id:', id);
        const url = `${this.apiUrl}/products/${id}`;
        console.log(url);
        return this.http.get(url);
    }
  }

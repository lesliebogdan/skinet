import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Pagination } from './models/pagination';
import { Product } from './models/model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'skinet course';
  products: Product[]=[];
  



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Pagination<Product[]>>('https://localhost:5001/api/products?pageSize=10').subscribe({
      next: (response) => this.products = response.data, // what to do next
      error: error => console.log(error), // what to do if you get an error
      complete:()=> {
        console.log('request completed');
        console.log('extra statement');
      }
    })
  }

}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../shared/models/order';
import { BehaviorSubject } from 'rxjs';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  baseUrl = environment.apiUrl;

  shipping = 0;

  constructor(private http:HttpClient) { }


  getOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrder(id:number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }



  

}

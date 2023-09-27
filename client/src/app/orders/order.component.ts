import { Component, Input, OnInit, Output } from '@angular/core';
import { OrderService } from './order.service';
import { Order } from '../shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orders: Order[]=[];


  constructor(public orderService: OrderService){
    
  }
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: response => {
        this.orders = response;
      },
      error: error => console.log(error)
    })

  }



}

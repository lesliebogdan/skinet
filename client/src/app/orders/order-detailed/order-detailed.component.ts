import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from 'src/app/shared/models/order';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  
  order?: Order;
  quantity = 1;
  quantityInBasket = 0;
  shipping = 0;

  constructor(private orderService:OrderService, private activatedRoute:ActivatedRoute,
    private bcService:BreadcrumbService){
      this.bcService.set('@orderDetails',' ')
    }

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id)
      this.orderService.getOrder(+id).subscribe({
      next: order => {
        this.order =order;


        this.bcService.set('@orderDetails','Order No: ' + order.id + ' - '+ order.status);
        
      },
      error: error => console.log(error)
    });
  }

}

import { BasketService } from 'src/app/basket/basket.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
@Input() checkoutForm?: FormGroup;
deliveryMethods: DeliveryMethod[] = [];

constructor(private checkoutService: CheckoutService, private BasketService: BasketService){}


  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: dm=> this.deliveryMethods = dm
    })
    console.log(this.checkoutForm)
  }

  setShippingPrice(deliveryMethod: DeliveryMethod){
    this.BasketService.setShippingPrice(deliveryMethod);
  }

}

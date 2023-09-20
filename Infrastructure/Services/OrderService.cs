using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {

        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IUnitOfWork unitOfWork,IBasketRepository basketRepo)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;

        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, 
        int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from the repo (we do not trust what is in it though) - qty can be - price no
            // think like a real shop (stickers on products in a shop - then going to the counter the price is via a database on the counter)
            var basket = await _basketRepo.GetBasketAsync(basketId);
            // get items from the product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name,
                productItem.PictureUrl);

                var orderItem = new OrderItem(itemOrdered,productItem.Price,item.Quantity);

                items.Add(orderItem);
            }
            // get the deliver method (we will only have the id of the delivery method)
            
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            //calc subtotal

            var subtotal = items.Sum(item => item.Price *item.Quantity);

            //create the order
            var order = new Order(items,buyerEmail,shippingAddress,deliveryMethod,subtotal);

            _unitOfWork.Repository<Order>().Add(order);
            // TO DO ==> save to db (will do shortly)

            var result = await _unitOfWork.Complete();

            if(result <= 0) return null;

            // delete basket 
            await _basketRepo.DeleteBasketAsync(basketId);

            //return order
            return order;

            

        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id,buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    await OrderItemModel.destroy({
      where: {
        order_id: entity.id
      }
    });

    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id
        }
      }
    );

    await OrderItemModel.bulkCreate(entity.items.map((item) => ({
      id: item.id,
      order_id: entity.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
    })));
  }

  async find(id: string): Promise<Order> {
    try {
      const result = await OrderModel.findOne({
        where: { id },
        include: ["items"],
      })
      const items = result.items.map(model => new OrderItem(
        model.id,
        model.name,
        model.price,
        model.product_id,
        model.quantity
      ));
      const order = new Order(id, result.customer_id, items)
      return order;
    } catch (error) {
      throw new Error("Order not found");
    }
  }

  async findAll(): Promise<Order[]> {
    const result = await OrderModel.findAll({
      include: ["items"],
    })

    return result.map((order) => {
      const items = order.items.map(model => new OrderItem(
        model.id,
        model.name,
        model.price,
        model.product_id,
        model.quantity
      ));
      return new Order(order.id, order.customer_id, items)
    })

  }

}

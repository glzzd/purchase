import BacketModel from "../models/BacketModel.js";
import OrderModel from "../models/OrderModel.js";
import RaportModel from "../models/RaportModel.js";
import UserModel from "../models/UserModel.js";

export const makeNewOrder = async (id, orders, raport) => {
    try {
        console.log(raport);
        
      const user = await UserModel.findById(id);
      const userBacket = await BacketModel.find({ order_by: id, is_raport_generated: false });
  
      if (!userBacket || userBacket.length === 0) {
        return;
      }
  
      const backetId = userBacket[0]._id; // İlgili sepetin _id'sini alıyoruz
  
      for (const item of orders) {
        const newOrder = new OrderModel({
          order_by: id,
          backet_id: backetId, // Sepet ID'sini ekliyoruz
          order_by_fullname: `${user.surname} ${user.name} ${user.fathername}`,
          order_for: item.order_for,
          product: item.product,
          product_type: item.product_type,
          product_specifications: item.product_specifications,
          order_count: item.order_count,
          order_reason: item.order_reason,
          order_note: item.order_note,
          raport_id: raport._id,
          order_status: 'pending'
        });
  
        await newOrder.save();
      }
    } catch (error) {
      console.error("Error creating order:", error.message);
    }
  };
  
  export const allOrders = async (req, res) => {
    try {
      // Find all orders, sorted by createdAt (descending)
      const orders = await OrderModel.find().sort({ createdAt: -1 }); // Sort by 'createdAt' in descending order

      // If no orders are found
      if (orders.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'Sifariş tələbi tapılmadı.',
            });
        }
        
        // Fetch related report details for each order
        const ordersWithRaports = await Promise.all(
            orders.map(async (order) => {
                const raport = await RaportModel.findById(order.raport_id); // Assuming raport_id is in the order model
                if (raport) {
                    return {
                        ...order.toObject(), // Convert mongoose document to plain object
                        raport_by: raport.raport_by,
                        raport_temp_no: raport.raport_temp_no,
                        raport_no: raport.raport_no,
                        raport_url: raport.raport_url,
                    };
                } else {
                    return order.toObject(); // In case there's no matching raport, return the order only
                }
            })
        );
        console.log(ordersWithRaports);
  
      // Respond with the modified orders that include raport information
      res.status(200).json({
        success: true,
        orders: ordersWithRaports, // Return orders along with raport details
      });
    } catch (error) {
      console.error('Hata:', error.message);
      res.status(500).json({
        success: false,
        message: 'Sifarişlər alınırken bir hata oluştu.',
      });
    }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { lot_no, contract_no, tenant } = req.body;

    // Order'ı bul ve güncelle
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          lot_no,
          contract_no,
          tenant,
        },
      },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "Error updating order", error });
  }
};

export const getOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  try {
    // Siparişi bul
    const order = await OrderModel.findById(orderId); 

    // Eğer sipariş bulunmazsa
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sifariş tapılmadı.',
      });
    }

    // Raport bilgilerini getir
    const raport = await RaportModel.findById(order.raport_id); // Assuming raport_id is in the order model

    if (raport) {
      // Sipariş ile raport bilgilerini birleştir
      const orderWithRaport = {
        ...order.toObject(), // Mongoose belgesini düz bir nesneye çevir
        raport_by: raport.raport_by,
        raport_temp_no: raport.raport_temp_no,
        raport_no: raport.raport_no,
        raport_url: raport.raport_url,
      };
      
      // Sipariş ve raport ile döndür
      return res.status(200).json({
        success: true,
        order: orderWithRaport, // Siparişin rapor detaylarıyla birlikte
      });
    } else {
      // Eğer raport bulunmazsa sadece siparişi döndür
      return res.status(200).json({
        success: true,
        order: order.toObject(), // Sadece siparişi döndür
      });
    }
  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sifariş alınırken bir hata oluştu.',
    });
  }
};

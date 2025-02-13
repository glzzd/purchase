import mongoose from "mongoose";
import BacketModel from "../models/BacketModel.js";
import LotModel from "../models/LotModel.js";
import OrderModel from "../models/OrderModel.js";
import RaportModel from "../models/RaportModel.js";
import UserModel from "../models/UserModel.js";

export const makeNewOrder = async (id, orders, raport) => {
    try {

        
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
  
      // Fetch related report details and tenant details for each order
      const ordersWithRaportsAndTenant = await Promise.all(
        orders.map(async (order) => {
          // Fetch report details
          const raport = await RaportModel.findById(order.raport_id); // Assuming raport_id is in the order model
          
          // Fetch tenant details if tenant is valid
          let tenant = null;
          if (order.tenant && mongoose.Types.ObjectId.isValid(order.tenant)) {
            tenant = await UserModel.findById(order.tenant); // Only fetch tenant if it's a valid ObjectId
          }  
          // Build the order with raport and tenant info
          const orderWithDetails = {
            ...order.toObject(), // Convert mongoose document to plain object
            raport_by: raport ? raport.raport_by : null,
            raport_temp_no: raport ? raport.raport_temp_no : null,
            raport_no: raport ? raport.raport_no : null,
            raport_url: raport ? raport.raport_url : null,
            tenant: tenant ? `${tenant.surname} ${tenant.name}` : "Təyin edilməyib", // Tenant full name or "Təyin edilməyib"
          };
  
          return orderWithDetails;
        })
      );
  
      // Respond with the modified orders that include raport and tenant information
      res.status(200).json({
        success: true,
        orders: ordersWithRaportsAndTenant, // Return orders along with raport and tenant details
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
    const { lot_no } = req.body;

    // Lot'u bul
    const lot = await LotModel.findOne({ lot_no });
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }

    console.log(lot);
    const tenant = lot.tenant ? lot.tenant : null
    

    
    
    // Contract numarasını kontrol et
    const contract = lot.contract_no ? `${lot.contract_no}` : "Təyin edilməyib";

    // Order'ı bul ve güncelle
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          lot_no,
          contract_no: contract,
          tenant: tenant,
        },
      },
      { new: true } // Güncellenmiş dokümanı döndür
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    } 
    
    // Güncellenmiş order'ı döndür
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
    let tenant = null;
    if (order.tenant && mongoose.Types.ObjectId.isValid(order.tenant)) {
      tenant = await UserModel.findById(order.tenant); // Only fetch tenant if it's a valid ObjectId
    }
    
    // Sipariş ve raport bilgilerini birleştir
    const orderWithDetails = {
      ...order.toObject(), // Mongoose belgesini düz bir nesneye çevir
      raport_by: raport ? raport.raport_by : null,
      raport_temp_no: raport ? raport.raport_temp_no : null,
      raport_no: raport ? raport.raport_no : null,
      raport_url: raport ? raport.raport_url : null,
      tenant: tenant ? `${tenant.surname} ${tenant.name}` : "Təyin edilməyib", // Tenant full name or "Təyin edilməyib"

    };

    // Sipariş ve detaylarla döndür
    return res.status(200).json({
      success: true,
      order: orderWithDetails, // Siparişin rapor ve tenant detaylarıyla birlikte
    });

  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sifariş alınırken bir hata oluştu.',
    });
  }
};


import mongoose from "mongoose";
import BacketModel from "../models/BacketModel.js";
import LotModel from "../models/LotModel.js";
import OrderModel from "../models/OrderModel.js";
import RaportModel from "../models/RaportModel.js";
import UserModel from "../models/UserModel.js";

export const makeNewOrder = async (id, orders, raport) => {
  try {
    if (!id) {
      console.error("Error: User ID is missing.");
      return;
    }


    // Kullanıcıyı getir
    const user = await UserModel.findById(id);
    if (!user) {
      console.error("Error: User not found.");
      return;
    }

    // Kullanıcının səbətini kontrol et
    const userBacket = await BacketModel.find({
      order_by: id,
      is_raport_generated: false
    });

    if (!userBacket || userBacket.length === 0) {
      console.error("Error: No valid backet found.");
      return;
    }

    const backetId = userBacket[0]._id;

    for (const item of orders) {
      try {
        const newOrder = new OrderModel({
          order_by: id,
          backet_id: backetId,
          order_by_fullname: `${user.surname} ${user.name} ${user.fathername}`,
          order_for: item.order_for,
          product: item.product,
          product_specifications: item.product_specifications || [],
          order_count: item.order_count,
          order_reason: item.order_reason || "", // Boş olmaması için varsayılan değer
          order_note: item.order_note || "",
          raport_id: raport?._id || null, // raport varsa ekle, yoksa null yap
        });

        await newOrder.save();
      } catch (orderError) {
        console.error("Error creating order for product:", item.product, orderError.message);
      }
    }

    console.log("All orders processed successfully.");
  } catch (error) {
    console.error("Error in makeNewOrder:", error.message);
  }
};
  
  export const allOrders = async (req, res) => {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
  
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sifariş tələbi tapılmadı.',
        });
      }
  
      const ordersWithRaportsAndTenant = await Promise.all(
        orders.map(async (order) => {
          const raport = await RaportModel.findById(order.raport_id); 
          
          let tenant = null;
          if (order.tenant && mongoose.Types.ObjectId.isValid(order.tenant)) {
            tenant = await UserModel.findById(order.tenant); 
          }  
          const orderWithDetails = {
            ...order.toObject(), 
            raport_by: raport ? raport.raport_by : null,
            raport_temp_no: raport ? raport.raport_temp_no : null,
            raport_no: raport ? raport.raport_no : null,
            raport_url: raport ? raport.raport_url : null,
            tenant: tenant ? `${tenant.surname} ${tenant.name}` : "Təyin edilməyib", 
          };
  
          return orderWithDetails;
        })
      );
  
      res.status(200).json({
        success: true,
        orders: ordersWithRaportsAndTenant, 
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
  const {temp_raport_no, new_status, new_raport_no}=req.body
  
  try {
    const raport = await RaportModel.findOne({ raport_temp_no: temp_raport_no });
    if (!raport) {
      return res.status(404).json({
        success: false,
        message: "Raport tapılmadı",
      });
    }
  
    const orders = await OrderModel.find({ raport_id: raport._id });
  
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bu raportla bağlı sifariş tapılmadı",
      });
    }
  
    await OrderModel.updateMany(
      { raport_id: raport._id }, 
      { $set: { order_status: new_status, raport_no_from_bc: new_raport_no } } 
    );
  
    return res.status(200).json({
      success: true,
      message: "Uğurlu əməliyyat",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Xəta baş verdi",
    });
  }
}

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


import LotModel from "../models/LotModel.js";

export const createLot = async (req, res) => {
    const { lot_name, contract_no } = req.body;
    try {
     
        const lastLot = await LotModel.findOne().sort({ lot_no: -1 });
    
        const newLotNo = lastLot ? lastLot.lot_no + 1 : 1;
    
        const newLot = new LotModel({
            lot_name,
            contract_no,
          lot_no: newLotNo,
        });
    
        await newLot.save();
    
        res.status(201).json({
          success: true,
          message: "Lot uğurla yaradıldı.",
          lot: newLot,
        });
      } catch (error) {
        console.error("Error creating lot:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while creating the lot.",
        });
      }
}

export const getAllLots = async (req, res) => {
    try {
      const lots = await LotModel.find().sort({ createdAt: -1 });
  
      if (!lots || lots.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No lots found.",
        });
      }
  
      // Return the list of lots
      res.status(200).json({
        success: true,
        lots,
      });
    } catch (error) {
      console.error("Error fetching lots:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching lots.",
      });
    }
  };
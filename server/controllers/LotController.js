import ContractModel from "../models/ContractModel.js";
import LotModel from "../models/LotModel.js";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";


export const createLot = async (req, res) => {
  const { token } = req.cookies;


  // Check if the token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }


  try {
    const secretKey = process.env.JWT_SECRET;

    // Verify JWT token and get the user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Find the user from the database
    const user = await UserModel.findById(userId);

    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get the last created lot to generate a new lot number
    const lastLot = await LotModel.findOne().sort({ lot_no: -1 });

    const newLotNo = lastLot ? lastLot.lot_no + 1 : 1;

    // Create a new lot
    const newLot = new LotModel({
      lot_no: newLotNo,
      created_by: user._id,
    });

    
    // Save the new lot to the database
    await newLot.save();

    return res.status(201).json({
      success: true,
      message: "Lot successfully created.",
      lot: newLot,
    });
  } catch (error) {
    console.error("Error creating lot:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the lot.",
    });
  }
};

export const getAllLots = async (req, res) => {
    try {
      const lots = await LotModel.find().sort({ createdAt: -1 });
  
      if (!lots || lots.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No lots found.",
        });
      }
  
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

  export const updateLotDetails = async (req, res) => {
    const {lotId} = req.params
    const {lot_name,contract_no} = req.body
    try {
      const selectedLot = await LotModel.findById(lotId)
      const selectedContract = await ContractModel.findOne({contract_no})

      
      selectedLot.lot_name=lot_name
      selectedLot.contract_id=selectedContract._id
      selectedLot.contract_no=selectedContract.contract_no
      selectedLot.save()

      res.status(200).json({
        success: true,
        selectedLot,
      })
      
    } catch (error) {
      console.error("Error fetching lots:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching lots.",
      });
    }
    
  }

  export const getLotDetails = async (req, res) => {
    const { lotId } = req.params;
  
    try {

      const lotDetails = await LotModel.findById(lotId);
      const createdBy = await UserModel.findById(lotDetails.created_by)
      
      if (!lotDetails) {
        return res.status(404).json({
          success: false,
          message: "Lot tapılmadı.",
        });
      }

      res.status(200).json({
        success: true,
        data: lotDetails,
        created_by:createdBy
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lot detalları çəkilərkən xəta baş verdi.",
      });
    }
  };
  
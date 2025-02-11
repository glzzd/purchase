import ContractModel from "../models/ContractModel.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import moment from "moment-timezone";

export const createNewContract = async (req, res) => {
  const { contract_name, contract_no, contract_between } = req.body;
  const {token} = req.cookies

  if (!contract_no) {
    return res.status(400).json({
      success: false,
      message: "Müqavilə nömrəsi qeyd edilməyib",
    });
  }
  if (!contract_between) {
    return res.status(400).json({
      success: false,
      message: "Qarşı tərəfin adı qeyd edilməyib",
    });
  }

  try {
    const existingContract = await ContractModel.findOne({contract_no})
    if(existingContract){
        return res.status(400).json({
            success: false,
            message: "Bu müqavilə sistemdə mövcuddur.",
          });
    }
    const secretKey = process.env.JWT_SECRET; 
    const decoded = jwt.verify(token, secretKey); 
    const userId = decoded.id; 
    const user = await UserModel.findById(userId)

    
    const newContract = new ContractModel({
      contract_name,
      contract_no,
      contract_between,
      created_by:user._id
    });


    await newContract.save();


    res.status(201).json({
      success: true,
      message: "Yeni müqavilə uğurla əlavə edildi.",
      contract: newContract, 
    });
  } catch (error) {
    console.error("Müqavilə əlavə edilərkən xəta baş verdi:", error.message);
    res.status(500).json({
      success: false,
      message: "Müqavilə əlavə edilərkən xəta baş verdi.",
    });
  }
};


export const getContractDetails = async (req, res) => {
    const { contractId } = req.params;
  
    try {
      const contract = await ContractModel.findById(contractId);
  
      if (!contract) {
        return res.status(404).json({
          success: false,
          message: "Müqavilə tapılmadı.",
        });
      }
  
      const contractCreatorDetails = await UserModel.findById(contract.created_by);
  
      if (!contractCreatorDetails) {
        return res.status(404).json({
          success: false,
          message: "Müqaviləni yaradan istifadəçi tapılmadı.",
        });
      }
      const formattedCreatedAt = moment(contract.createdAt)
      .tz("Asia/Baku")
      .format("DD.MM.YYYY HH:mm:ss");
      
      res.status(200).json({
        success: true,
        contract: {
          ...contract.toObject(),
          formattedCreatedAt,
          created_by_details: {
            fullname: `${contractCreatorDetails.surname} ${contractCreatorDetails.name} ${contractCreatorDetails.fathername}`,
            rank: contractCreatorDetails.rank,
            position: contractCreatorDetails.position,
            structure: contractCreatorDetails.structure,
          },
        },
      });
    } catch (error) {
      console.error("Müqavilə detalları çəkilərkən xəta baş verdi:", error.message);
      res.status(500).json({
        success: false,
        message: "Müqavilə detalları çəkilərkən xəta baş verdi.",
      });
    }
  };

  export const getAllContracts = async (req, res) => {
    try {
      // Bütün müqavilələri "created_by" sahəsi ilə birlikdə al
      const contracts = await ContractModel.find()
        .sort({ createdAt: -1 })
        .populate("created_by", "surname name fathername rank position structure");
  
      if (!contracts || contracts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Müqavilələr tapılmadı.",
        });
      }
      
      const contractsWithDetails = contracts.map((contract) => {
        const createdByDetails = contract.created_by ? {
          fullname: `${contract.created_by.surname} ${contract.created_by.name} ${contract.created_by.fathername}`,
          rank: contract.created_by.rank,
          position: contract.created_by.position,
          structure: contract.created_by.structure,
        } : null;
      
        return {
          ...contract.toObject(),
          created_by_details: createdByDetails,
        };
      });
      
  
      res.status(200).json({
        success: true,
        contracts: contractsWithDetails,
      });
    } catch (error) {
      console.error("Müqavilələr alınarkən xəta baş verdi:", error.message);
      res.status(500).json({
        success: false,
        message: "Müqavilələr alınarkən xəta baş verdi.",
      });
    }
  };
  

  export const updateContractDetails = async (req, res) => {
    const { contractId } = req.params;  // Contract ID from URL
    const { contract_name, contract_no, contract_between } = req.body;  // New values from request body
    const { token } = req.cookies;  // JWT token to verify the user
    
   
  
    try {
      // Find the contract by ID
      const contract = await ContractModel.findById(contractId);

        
      if (!contract) {
        return res.status(404).json({
          success: false,
          message: "Müqavilə tapılmadı.", 
        });
      }
  
      if (contract_no !== contract.contract_no) {
        const existingContract = await ContractModel.findOne({ contract_no });
        if (existingContract) {
          return res.status(400).json({
            success: false,
            message: "Bu müqavilə nömrəsi artıq mövcuddur.",  // "This contract number already exists."
          });
        }
      }
  
      // Verify user from token
      const secretKey = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.id;
  
      // If needed, you can verify if the user is authorized to update this contract
      if (contract.created_by.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bu müqaviləni redaktə etmək üçün yetkiniz yoxdur.",  // "You don't have permission to edit this contract."
        });
      }
      
      // Update contract details
      contract.contract_name = contract_name;
      contract.contract_no = contract_no;
      contract.contract_between = contract_between;

  
      // Save updated contract
      await contract.save();
  
      res.status(200).json({
        success: true,
        message: "Müqavilə uğurla yeniləndi.",  // "Contract updated successfully."
        contract,  // Return the updated contract
      });
    } catch (error) {
      console.error("Müqavilə yenilənərkən xəta baş verdi:", error.message);  // "Error occurred while updating the contract"
      res.status(500).json({
        success: false,
        message: "Müqavilə yenilənərkən xəta baş verdi.",  // "Error occurred while updating the contract."
      });
    }
  };
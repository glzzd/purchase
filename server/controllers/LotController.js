import ContractModel from "../models/ContractModel.js";
import ExpenseItemModel from "../models/ExpenseItems.js";
import LotModel from "../models/LotModel.js";
import OrderModel from "../models/OrderModel.js";
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
    // Tüm lotları en yeniye göre sırala
    const lots = await LotModel.find().sort({ createdAt: -1 });

    if (!lots || lots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lots found.",
      });
    }

    // Her bir lot için ilgili tenant bilgilerini alın
    const lotsWithTenant = await Promise.all(
      lots.map(async (lot) => {
        const tenant = lot.tenant ? await UserModel.findById(lot.tenant) : null;

        // Expense item bilgisi için gerekli detayları al
        const expenseItem = lot.expenseItem
          ? await ExpenseItemModel.findById(lot.expenseItem)
          : null;

        return {
          ...lot.toObject(),
          tenant,
          expenseItem: expenseItem ? expenseItem.itemCode : null, // Sadece itemCode döndür
        };
      })
    );

    res.status(200).json({
      success: true,
      lots: lotsWithTenant,
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
  const { lotId } = req.params;
  const updates = req.body;

  try {
    const selectedLot = await LotModel.findById(lotId);
    if (!selectedLot) {
      return res
        .status(404)
        .json({ success: false, message: "Lot not found." });
    }

    if (updates.contract_no) {
      const selectedContract = await ContractModel.findOne({
        contract_no: updates.contract_no,
      });
      if (!selectedContract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found." });
      }
      selectedLot.contract_id = selectedContract._id;
      selectedLot.contract_no = selectedContract.contract_no;

      // OrderModel'de de contract_no ve tenant güncelleniyor
      await OrderModel.updateMany(
        { lot_no: selectedLot.lot_no },
        {
          $set: {
            contract_no: selectedContract.contract_no,
          },
        }
      );
    }

    if (updates.tenant) {
      selectedLot.tenant = updates.tenant;
      await OrderModel.updateMany(
        { lot_no: selectedLot.lot_no },
        {
          $set: {
            tenant: updates.tenant,
          },
        }
      );
    }

    if (updates.lot_name) selectedLot.lot_name = updates.lot_name;
    if (updates.expenseItem) selectedLot.expenseItem = updates.expenseItem;
    if (updates.isInternal !== undefined)
      selectedLot.isInternal = updates.isInternal;

    if (updates.estimatedAmount !== undefined) {
  const oldAmount = Number(selectedLot.estimatedAmount || 0); // eski değer
  const newAmount = Number(updates.estimatedAmount); // yeni değer
  const difference = newAmount - oldAmount;

  // ÖNEMLİ: ExpenseItem değiştiyse eski ve yeni itemlere müdahale et
  const oldExpenseItemId = selectedLot.expenseItem ? selectedLot.expenseItem.toString() : null;
  const newExpenseItemId = updates.expenseItem || oldExpenseItemId;

  selectedLot.estimatedAmount = newAmount;
  selectedLot.expenseItem = newExpenseItemId; // expenseItem değiştiyse bunu da güncelle

  if (oldExpenseItemId && newExpenseItemId && oldExpenseItemId !== newExpenseItemId) {
    // ExpenseItem değişmiş: eski itemden blokajı geri al, yeni iteme uygula

    // Eski expenseItem detayları
    const oldExpenseItemDetails = await ExpenseItemModel.findById(oldExpenseItemId);
    if (oldExpenseItemDetails) {
      // Eski itemde blockedBalance ve amount'u geri al
      oldExpenseItemDetails.blockedBalance = Number(oldExpenseItemDetails.blockedBalance || 0) - oldAmount;
      oldExpenseItemDetails.amount = Number(oldExpenseItemDetails.amount || 0) + oldAmount;

      oldExpenseItemDetails.purchaseHistory.push({
        purchaseDate: new Date(),
        amount: -oldAmount,
        description: `Lot ${selectedLot.lot_no} üçün ayrılmış məbləğin köhnə ExpenseItem-dən çıxarılması.`,
      });

      await oldExpenseItemDetails.save();
    }

    // Yeni expenseItem detayları
    const newExpenseItemDetails = await ExpenseItemModel.findById(newExpenseItemId);
    if (newExpenseItemDetails) {
      newExpenseItemDetails.blockedBalance = Number(newExpenseItemDetails.blockedBalance || 0) + newAmount;
      newExpenseItemDetails.amount = Number(newExpenseItemDetails.amount || 0) - newAmount;

      newExpenseItemDetails.purchaseHistory.push({
        purchaseDate: new Date(),
        amount: newAmount,
        description: `Lot ${selectedLot.lot_no} üçün ayrılmış məbləğin yeni ExpenseItem-ə əlavə edilməsi.`,
      });

      await newExpenseItemDetails.save();
    }
  } else {
    // ExpenseItem değişmemiş, sadece miktar farkını uygula
    const expenseItemDetails = await ExpenseItemModel.findById(newExpenseItemId);

    if (expenseItemDetails) {
      expenseItemDetails.blockedBalance = Number(expenseItemDetails.blockedBalance || 0) + difference;
      expenseItemDetails.amount = Number(expenseItemDetails.amount || 0) - difference;

      expenseItemDetails.purchaseHistory.push({
        purchaseDate: new Date(),
        amount: newAmount,
        description: `Lot ${selectedLot.lot_no} üçün ayrılmışdır.`,
      });

      await expenseItemDetails.save();
    }
  }
}


    await selectedLot.save();

    res.status(200).json({ success: true, selectedLot });
  } catch (error) {
    console.error("Error updating lot details:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating lot details.",
      });
  }
};

export const getLotDetails = async (req, res) => {
  const { lotId } = req.params;

  try {
    const lotDetails = await LotModel.findById(lotId);
    console.log(lotDetails);

    const createdBy = await UserModel.findById(lotDetails.created_by);

    if (!lotDetails) {
      return res.status(404).json({
        success: false,
        message: "Lot tapılmadı.",
      });
    }

    res.status(200).json({
      success: true,
      data: lotDetails,
      created_by: createdBy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lot detalları çəkilərkən xəta baş verdi.",
    });
  }
};

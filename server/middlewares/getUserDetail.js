import jwt from "jsonwebtoken";

export const getAuthUserDetail = async (req, res, next) => {
  const { tempToken, token } = req.cookies;

  

  if (!tempToken && !token) {
    return res.status(401).json({
      success: false,
      message: "Təkrar daxil olun.",
    });
  }
  
  try {
    let email;
    let id;
    if (tempToken) {
      const decodedTempToken = jwt.verify(tempToken, process.env.JWT_SECRET);
      email = decodedTempToken.email;
      id=decodedTempToken.id
    } else if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      email = decodedToken.email;
      id=decodedToken.id

    }

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Etibarsız token.",
      });
    }

    req.body.email = email;
    req.body.id = id;
    next();
  } catch (error) {
    console.error("Token Doğrulama Hatası:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token doğrulama zamanı xəta baş verdi.",
    });
  }
};

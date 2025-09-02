import jwt from 'jsonwebtoken';

const generateTokenApp = (id) => {
  const token = jwt.sign({ id }, process.env.jwts, {
    expiresIn: "30d",
  });
  
  const refreshToken = jwt.sign({ id }, process.env.refresh, {
    expiresIn: "30d" // Longer expiry for refresh token
  });

  return {
    accessToken: token,
    refreshToken: refreshToken
  };
};

export default generateTokenApp;
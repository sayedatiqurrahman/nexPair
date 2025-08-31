import jwt from "jsonwebtoken"
import refreshTokenModel from "../models/refreshToken.model.js"

const accessTokenSecret = process.env.HASHSECRET
const refreshTokenSecret = process.env.HASHSECRET
class tokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, accessTokenSecret, {expiresIn:"1m"})
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn:"1y"})
        return { accessToken , refreshToken}
    } 

    async storeRefreshToken(payload){
      try {
         await refreshTokenModel.create({...payload})
        
      } catch (error) {
          console.log('error from storeRefreshToken 18:', error)
      }
    }

    async verifyAccessToken(token){
        return await jwt.verify(token, accessTokenSecret)
    }
    async verifyRefreshToken(token){
        return await jwt.verify(token, refreshTokenSecret)
    }
    async findRefreshTokenFromDB(userId,token){
        return  await refreshTokenModel.findOne({userId, token})
    }
    async updateRefreshTokenInDB(userId,token){
        const tokenData =   await refreshTokenModel.findOne({userId})
        tokenData.token = token;
        tokenData.save()
        return tokenData
    }

    async removeToken(refreshToken){
        await refreshTokenModel.deleteOne({token:refreshToken})
    }

}

export default new tokenService ()
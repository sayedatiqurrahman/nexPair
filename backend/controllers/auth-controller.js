

import UserDto from "../dtos/user.dtos.js"
import hashServices from "../Services/hash.services.js"
import otpServices from "../Services/otp.services.js"
import tokenService from "../Services/token.service.js"
import userServices from "../Services/user.services.js"
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuthControllers {

    async sendOtpByEmail(req, res) {
        const { email } = req.body
        if (!email) res.status(400).json({ message: "Email field is required!!!" })
        const otp = await otpServices.generatorOtp()

        const ttl = 1000 * 60 * 5; // 5 minutes in ms
        const expires = Date.now() + ttl; // ✅ ADD, not multiply

        const data = `${email}.${otp}.${expires}`
        const hash = await hashServices.hashOtp(data)

        try {
            console.log("otp", otp)
            // await otpServices.sendByEmail(email, otp)
            return res.status(200).json({ hash: `${hash}.${expires}`, email, message: "A verification Mail Send to your Email" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Message Sending failed", error })
        }

        res.status(200).json({ hash })
    }

    async sendOtp(req, res) {
        const { phone } = req.body
        if (!phone) res.status(400).json({ message: "phone field is required!!!" })
        const otp = await otpServices.generatorOtp()

        const ttl = 1000 * 60 * 5; // 5 minutes in ms
        const expires = Date.now() + ttl; // ✅ ADD, not multiply

        const data = `${phone}.${otp}.${expires}`
        const hash = await hashServices.hashOtp(data)

        try {
            await otpServices.sendBySMS(phone, otp)
            return res.status(200).json({ hash: `${hash}.${expires}`, phone })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Message Sending failed", error })
        }

        res.status(200).json({ hash })
    }


    async verifyOtp(req, res) {
        const { otp, hash, email } = req.body

        if (!otp || !hash || !email) return res.status(400).json({ message: "Something is Missing , please try again !!!" })

        const [hashOtp, expires] = hash.split('.')


        if (Date(expires) < Date.now()) {
            return res.status(400).json({ message: "OTP Expired. Please Try again" });
        }


        const data = `${email}.${otp}.${expires}`


        // const isValid = OldHash === hash
        const isValid = await otpServices.verifyOtp(hashOtp, data)

        if (!isValid) return res.status(401).json({ message: "invalid OTP" })

        let user;
        // let accessToken;
        // let refreshToken;

        try {
            user = await userServices.findUser({ email });
            if (!user) {
                user = await userServices.createUser({ email });
            }
        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({ message: "DB Error" });
        }

        const { refreshToken, accessToken } = tokenService.generateTokens({ id: user._id, activated: false });
        await tokenService.storeRefreshToken({ token: refreshToken, userId: user._id })

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        });
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        });

        const userDto = new UserDto(user)
        return res.status(200).json({ auth: true, user: userDto });
    }

    async activateAccount(req, res) {
        const { name, avatar } = req.body;

        if (!name || !avatar) {
            return res.status(400).json({ message: "Name or avatar is missing, please try again!" });
        }

        try {
         
            // Find user
            const user = await userServices.findUser({ _id: req.userId });
            if (!user) {
                return res.status(404).json({ message: "User does not exist" });
            }

            // Update user
            user.activated = true;
            user.name = name;
            user.avatar = avatar; // path to serve via static

            await user.save();

            // Send response
            return res.status(200).json({ user: new UserDto(user), auth: true });

        } catch (error) {
            console.error("Error activating account:", error);
            return res.status(500).json({ message: "DB or Image processing error" });
        }
    }


    async refreshToken(req, res){
        const {refreshToken: refreshTokenFromCookie} = req.cookies;
        // console.log("refreshToken", refreshTokenFromCookie)
        if(!refreshTokenFromCookie) return res.status(404).json({message:"please login first !!!"})
        const userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie)

        if(!userData.id) return res.status(401).json({message:"token invalid..."})

            // find token from db
        const tokenExist = await tokenService.findRefreshTokenFromDB(userData.id, refreshTokenFromCookie)
        if(!tokenExist) return res.status(401).json({message:"invalid token"})

            
            
                        // user
        try {

            const user = await userServices.findUser({_id:userData.id})
            if(!user) return res.status(404).json({message:"user dose not exist..."})

            const {refreshToken, accessToken} = tokenService.generateTokens({id:userData.id})

            // update tokens
            await tokenService.updateRefreshTokenInDB(userData.id , refreshToken)

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                httpOnly: true
            });
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                httpOnly: true
            });

            const userDto = new UserDto(user)
            return res.status(200).json({ auth: true, user: userDto });
             
        } catch (error) {
            console.log("error", error)
            res.status(500).json({message:"server error, refresh"})
        }
    }

   async logout(req,res){
    const {refreshToken} = req.cookies
    await tokenService.removeToken(refreshToken)

    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    res.status(200).json({user:null, auth:false})
    
   }

}

export default new AuthControllers()
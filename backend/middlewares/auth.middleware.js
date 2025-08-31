import tokenService from "../Services/token.service.js"


export default  async function authMiddleware (req,res,next){
        try {
            const {accessToken} = req.cookies

            if(!accessToken) throw new Error("Invalid token")
            console.log("accessToken", accessToken)


            const userData = await tokenService.verifyAccessToken(accessToken)
     

            req.userId = userData.id

        next()
        } catch (error) {
            res.status(401).json({message:"invalid token"})
        }
}
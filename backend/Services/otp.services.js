import "dotenv/config"
import crypto from 'crypto';
import axios from "axios";
import emailServices from "./email.services.js";
import hashServices from "./hash.services.js";


class OtpService {
    async generatorOtp() {
        const otp = crypto.randomInt(100000, 1000000);
        return otp;
    }

    async sendBySMS(phone, otp) {
        if (!phone || !otp) {
            throw new Error("Phone Number & otp is required")
        }

  
        const api_key= process.env.BULKSMSBD_API_KEY   ;  
        const senderid = 'Random' //process.env.BULKSMSBD_SENDER_ID ;  
        const number= phone; 
        const message= `your coder-hub OTP code is: ${otp}`;                 
  
        try {
            const response = await axios.post(
                "https://control.msg91.com/api/v5/flow", {
                "template_id": "68975a812546c37273237ac3",
                "short_url": "1",
                "recipients": [
                    {
                        "mobiles": [phone],
                        "VAR1": otp
                    }
                ]
                  });

            console.log(response.data);
        } catch (error) {
            console.error("SMS sending failed:", error.response?.data || error.message);
            res.status(500).json({ success: false, error: error.response?.data || error.message });
        }

    }

    async sendByEmail(email,otp) {
       const html_template = await emailServices.htmlTemplateUpdater('./../views/otp.html','OTP_CODE',otp)
       const Email_response = await emailServices.sendEmail(email, 'Coders_Hub Otp !!!', html_template)

       console.log('Email send successfully',Email_response)
       
    }

    async verifyOtp(hashOtp, data) {
       const computedHash = await hashServices.hashOtp(data)
        console.log("computedHash", computedHash)
       return computedHash === hashOtp

     }
}

export default new OtpService()
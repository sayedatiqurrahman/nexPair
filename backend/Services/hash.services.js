import "dotenv/config"
import crypto  from 'crypto';
class HashService{
   async hashOtp(data){
      const hash =  crypto.createHmac('sha256', process.env.HASHSECRET).update(data).digest('hex')
      return hash
    }
}

export default new HashService()
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});


// List of all the endpoints
export const sendOtp = (data) => api.post('/api/send-otp', data);
export const sendOtpByEmail = (data) => api.post('/api/email-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate', data);
export const logout = () => api.post('/api/logout');

// rooms routes endpoints
export const createRoom = (data) => api.post('/api/rooms', data);
export const getAllRooms = () => api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);


export const UploadAvatar = async (formData) => await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBBAPIKEY}`,
    formData, { baseURL: "`https://api.imgbb.com/1" }
)

// Interceptors
// api.interceptors.response.use(
//     (config) => {
//         return config;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         if (
//             error?.response?.status === 401 &&
//             originalRequest &&
//             !originalRequest?._isRetry
//         ) {
//             originalRequest.isRetry = true;
//             try {
//                 await api.get('/api/refresh');

//                 return api.request(originalRequest);
//             } catch (err) {
//                 console.log(err.message);
//             }
//         }
//         throw error;
//     }
// );

api.interceptors.response.use((config)=>config  ,async(error)=>{
    const originalRequest = error.config;
    if(error.response.status === 401 && originalRequest && !originalRequest._isRetry){
        originalRequest._isRetry = true;

        try {
            await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/refresh`,{withCredentials:true})

            return api.request(originalRequest)
        } catch (error) {
            console.log(error.message)
        }
    }
    
    throw error
   
})

export default api;

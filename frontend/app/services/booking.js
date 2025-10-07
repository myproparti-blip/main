import api from "./axios";

export const addBooking=async()=>{
    try{
        const response =await api.post("/bookings");
        return response.data;
    }catch(error){
        "error adding data"
    }
}

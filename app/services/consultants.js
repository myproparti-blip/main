import api from "./axios";

export const getConsultants=async()=>{
    try{
        const response=await api.get("/consultants");
        return response.data;

    }catch(error){
        console.error("Error fetching consultants:", error);
    }
}
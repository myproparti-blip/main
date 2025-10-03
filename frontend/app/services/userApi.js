import api from "./axios";

export const addUser=async()=>{
    try{
        const response =await api.post("/createUser");
        return response.data;
    }catch(error){
        "error adding data"
    }
}

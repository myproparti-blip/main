import api from "./axios";

export const addProperty=async(postData)=>{
    try{
const response=await api.post("/properties",postData);
return response.data;
    }catch(error){
        'error adding data'
    }
}
export const getProperty=async()=>{
    try{
const response=await api.get("/properties");
return response.data;
    }catch(error){
        'error fetching data'
    }
}
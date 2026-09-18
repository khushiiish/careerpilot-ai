import api from "./axios";



export async function uploadResumeRequest(file:File){
    const formData=new FormData();
    formData.append("resume",file);

    const {data}=await api.post("/resumes/upload",formData,{
        headers:{"Content-Type":"multipart/form-data"},
    })
    return data;

}

export async function getMyResumesRequest(){
    const {data} =await api.get("/resumes");
    return data;
}
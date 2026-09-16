import multer from "multer";
import path from "path";
import { Request } from "express";

const storage=multer.diskStorage({
    destination:(_req,_file,cb)=> {
        cb(null,path.join(process.cwd(),"uploads/resumes"))
    },
    filename:(_req,file,cb)=>{
        const uniqueSuffix=`${Date.now()}- ${Math.round(Math.round(Math.random()* 1e9))}`;
        cb(null, `${uniqueSuffix}${path.extreme(file.originalname)}`)
    }
});

function fileFilter(
    _req:Request,
    file:Express.Multer.File,
    cb:multer.FileFilterCallback
){
    if(file.mimetype== "application/pdf"){
        cb(null,true)
    }else{
        cb(new Error("only PDF Files are allowed"))
    }
}

export const uploadResume=multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 *1024 * 1024 },

})
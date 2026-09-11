import fs from "fs/promises";
import {PDFParse} from "pdf-parse";

export async function extractTextFromPdf(filePath:string):Promise<string>{
    const buffer=await fs.readFile(filePath);
    const parser=new PDFParse({data:buffer});

    try{
        const result=await parser.getText();
        return sanitizeText(result.text);

    }finally{
        await parser.destroy()
    }
    
}

function sanitizeText(text: string): string {
    return text.replace(/\u0000/g, "")
    .trim();
}

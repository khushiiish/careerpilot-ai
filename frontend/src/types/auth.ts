export interface User {
    id:string;
    name:string;
    email:string;
    isPremium:boolean
}

export interface SignupPayload {
name:string;
email:string;
password:string

}


export interface LoginPayload {
    email:string;
    password:string;

}

export interface AuthResponse {
    status:string;
    user: User;
    accessToken:string;

}


export interface ApiErrorResponse {
    status:string;
    message?:string;
    errors?:{field:string; message:string}[]
}

export interface InterviewQuestion {
    category:string;
    question:string;
    difficulty:"easy" | "medium" | "hard";
    tip:string
}

export interface InterviewQuestionsResult  {
    questions:InterviewQuestion[];
    focusArea:string[]
}
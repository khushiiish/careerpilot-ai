"use client"
import React, { Component, ReactNode } from "react";
interface Props{
    children:ReactNode
}
interface State{
    hasError:boolean
    error:Error | null
}

export default class ErrorBoundary extends Component<Props,State>{
    constructor(props:Props){
        super(props)
        this.state = {
            hasError:false,
            error:null
        }
    }

    static getDerivedStateFromError(error:Error):State{
        return {
            hasError:true,
            error:error
        }
    }
    componentDidCatch(error:Error){

        console.error("ErrorBoundary caught an error", error);
}
render(){
     if(this.state.hasError){
        return(
            <div className="min-h-screen bg-link flex items-center justify-center px-8">
                <div className="max-w-md w-full text-center">
                    <p className="font-mono  text-xs text-red-400 uppercase tracking-widest mb-4">
                      Something went wrong. Please try again later.  
                    </p>
                    <h1 className="font-display text-2xl font-semibold mb-3">Unexpected error</h1>
                    <p className="text-muted text-sm mb-8 leading-relaxed">
                        {this.state.error?.message??"An unexpected error occurred."}
                    </p>
                    <button 
                    onClick={()=>{
                        this.setState({hasError:false,error:null});
                        window.location.href="/dashboard";
                    }}
                    className="bg-signal text-ink font-medium text-sm rounded-md px-6 py-2.5 hover:bg-signal/90 transition">
                        Back to Dashboard
                    </button>
                </div>
                
            </div>
        )

}
return this.props.children;
}
}
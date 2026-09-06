import AuthLayout from "@/src/components/AuthLayout";
import React from "react";


export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>;

}
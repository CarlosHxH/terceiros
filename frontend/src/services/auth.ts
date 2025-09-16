import { api } from "@/lib/api";
import { SignInForm } from "@/schemas/auth";

export const signIn = async (data: SignInForm) => {
    return api<Usuario>({
        endpoint: "/api/auth/login/",
        method: "POST",
        data
    })
}

export const signUp = async (data: SignInForm) => {
    return api<APISignInResponse>({
        endpoint: "/api/auth/register/",
        method: "POST",
        data
    })
}

export const refreshToken = async (data: SignInForm) => {
    return api<APISignInResponse>({
        endpoint: "/api/auth/refresh-token/",
        method: "POST",
        data
    })
}

export const changePassword = async (data: SignInForm) => {
    return api<APISignInResponse>({
        endpoint: "/api/auth/change-password/",
        method: "POST",
        data
    })
}

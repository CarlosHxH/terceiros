import { api } from "@/lib/api";

export const sendPonto = async (data: FormData) => {
    return api<Usuario>({
        endpoint: "/api/auth/login/",
        method: "POST",
        data
    })
}
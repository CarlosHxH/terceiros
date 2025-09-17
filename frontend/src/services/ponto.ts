import { api } from "@/lib/api";

export const sendPonto = async (data: FormData) => {
    return api<ApiPontoRequest>({
        endpoint: "/api/pontos/",
        method: "POST",
        data
    })
}
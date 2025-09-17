"use server";

import axios, { AxiosError } from "axios";
import { auth } from "@/lib/auth";

type Props = {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: object;
    withAuth?: boolean
}

const BASE_URL = process.env.API_URL;

export const api = async <TypeResponse>({ endpoint, method = "GET", data, withAuth = true }: Props): Promise<API<TypeResponse>> => {
    const session = await auth()

    // Log da configuração inicial
    console.log('API Configuration:', {
        baseURL: BASE_URL,
        endpoint,
        method,
        withAuth,
        hasSession: !!session,
        hasAccessToken: !!session?.user?.access_token
    });

    const instance = axios.create({
        baseURL: BASE_URL,
        timeout: 30000, // Aumentado para 30 segundos
    })

    if (withAuth && session?.user.access_token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${session.user.access_token}`
    }

    // Log dos headers
    console.log('Request headers:', instance.defaults.headers);

    try {
        console.log('Making request to:', `${BASE_URL}${endpoint}`);
        console.log('Request method:', method);

        // Para FormData, não faça log do data completo (pode ser muito grande)
        if (data instanceof FormData) {
            console.log('Request data: FormData with entries:');
            for (let [key, value] of data.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
                } else {
                    console.log(`  ${key}:`, value);
                }
            }
        } else {
            console.log('Request data:', data);
        }

        const request = await instance(endpoint, {
            method,
            params: method == "GET" && data,
            data: method != "GET" && data
        })

        /*console.log('Request successful:', {
            status: request.status,
            statusText: request.statusText,
            headers: request.headers
        });*/

        return {
            success: true,
            data: request.data,
        };
    } catch (error) {
        //console.error('Request failed:', error);

        const e = error as AxiosError<APIError>
        /*
        // Log detalhado do erro
        console.error('Error details:', {
            message: e.message,
            code: e.code,
            status: e.response?.status,
            statusText: e.response?.statusText,
            data: e.response?.data,
            headers: e.response?.headers
        });
        */

        // Verificar se é erro de rede, timeout, etc.
        if (!e.response) {
            // Erro de rede ou timeout
            return {
                success: false,
                detail: e.code === 'ECONNABORTED' 
                    ? 'Timeout - A requisição demorou muito para responder'
                    : e.message || 'Erro de conexão com o servidor',
                code: e.code || 'NETWORK_ERROR',
                data: null
            }
        }

        // Erro HTTP com resposta do servidor
        return {
            success: false,
            detail: e.response?.data?.detail || e.response?.statusText || e.message || "An unexpected error occurred",
            code: e.response?.data?.code || `HTTP_${e.response?.status}` || "UNKNOWN_ERROR",
            data: null
        }
    }
}
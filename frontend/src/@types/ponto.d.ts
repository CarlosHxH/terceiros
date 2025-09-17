type ApiPontoRequest = {
    ip: string,
    foto: File | null,
    latitude: string,
    longitude: string,
    funcionario: number
}

type ApiPontoResponse<TData> = {
    id: number,
    foto: string,
    ip: string,
    latitude: string,
    longitude: string,
    created_at: string,
    updated_at: string,
    funcionario: number
}

type FormDataState = {
    userId?: string;
    coords?: { lat: number; lng: number };
    photo?: File | null;
    datatime?: string;
}
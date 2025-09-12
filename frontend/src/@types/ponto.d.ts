type ApiPontoRequest = {
    userId: string;
    access_token: string
    photo?: File;
    coords: {
        lat: string | number;
        lng: string | number;
    }
    createAt?: string;
}

type ApiPontoResponse<TData> = {
    success?: false;
    code?: string;
    data?: TData
}

type FormDataState = {
    userId?: string;
    coords?: { lat: number; lng: number };
    photo?: File | null;
    datatime?: string;
}
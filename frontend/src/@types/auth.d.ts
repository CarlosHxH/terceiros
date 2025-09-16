type Usuario = {
    usuario: {
        id: number,
        username: string,
        email: string,
        first_name: string,
        last_name: string,
        cpf: string,
        telefone: string,
        is_active: boolean,
        is_staff: boolean,
        date_joined: string,
        last_login: string | null,
        created_at: string,
        updated_at: string
    },
    tokens: {
        access: string,
        refresh: string
    },
    message: string
}



type User = {
    id: number;
    name: string;
    email: string;
}

/* API */
type APISignInResponse = Usuario & {
    user: User;
    access_token: string
}

type APISignUpResponse = Usuario & {
    user: User;
    access_token: string
}
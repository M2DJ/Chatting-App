export interface AuthInterface {
    success: boolean,
    data: any | null,
    error: any | null
}

export interface SearchedUsers{
    user_email: string;
    user_name: string | null;
}
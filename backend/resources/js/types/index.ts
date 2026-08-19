export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    [key: string]: unknown;
}

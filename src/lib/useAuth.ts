import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    users: { email: string; password: string; name: string }[];
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const DEMO_USER = {
    email: 'demo@oncovision.com',
    password: '123456'
};

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            users: [{ email: DEMO_USER.email, password: DEMO_USER.password, name: 'Demo User' }],
            register: async (name: string, email: string, password: string) => {
                const { users } = get();

                // Verifica se o email já está cadastrado
                if (users.some(user => user.email === email)) {
                    throw new Error('Email já cadastrado');
                }

                // Adiciona o novo usuário
                set(state => ({
                    users: [...state.users, { email, password, name }],
                    user: { email, name },
                    isAuthenticated: true
                }));

                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
            },
            login: async (email: string, password: string) => {
                const { users } = get();
                const user = users.find(u => u.email === email && u.password === password);

                if (!user) {
                    throw new Error('Credenciais inválidas');
                }

                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API

                set({
                    user: { email: user.email, name: user.name },
                    isAuthenticated: true
                });
            },
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false
                });
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                users: state.users
            }),
        }
    )
);

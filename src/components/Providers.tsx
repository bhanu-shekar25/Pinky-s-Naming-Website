"use client";

import { UserProvider } from "@/lib/context/UserContext";
import { InitialUserModal } from "@/components/features/InitialUserModal";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            {children}
            <InitialUserModal />
        </UserProvider>
    );
}

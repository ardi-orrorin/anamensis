'use client';
import {LoginProvider} from "@/app/login/{hooks}/LoginProvider";

const Layout = ({ children } : { children: React.ReactNode }) => {

    return (
        <LoginProvider>
            {children}
        </LoginProvider>
    );
}

export default Layout;
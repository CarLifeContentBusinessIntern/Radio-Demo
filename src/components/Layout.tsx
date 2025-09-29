import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
    type: string;
    children: ReactNode;
}


function Layout({ type, children }: LayoutProps) {
    return (
        <>
            <div className="sticky top-0 left-0 w-full z-50">
                <Header type={type} />
            </div>
            <main>{children}</main>
        </>
    );
}

export default Layout;

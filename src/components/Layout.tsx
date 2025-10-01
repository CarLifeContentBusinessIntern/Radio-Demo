import type { ReactNode } from 'react';
import Header from './Header';
import type { HeaderType } from '../types';

interface LayoutProps {
  type: HeaderType;
  title?: string;
  children: ReactNode;
}

function Layout({ type, title, children }: LayoutProps) {
  return (
    <>
      <div className="sticky top-0 left-0 w-full z-50">
        <Header type={type} title={title} />
      </div>
      <main>{children}</main>
    </>
  );
}

export default Layout;

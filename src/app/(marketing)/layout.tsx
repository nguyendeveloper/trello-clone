import { ReactNode } from 'react';

import { Navbar } from '@/app/(marketing)/_components/navbar';

interface Props {
  children: ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pt-40 pb-20 bg-slate-100">{children}</main>
    </div>
  );
}

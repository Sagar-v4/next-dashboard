import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Authentication`,
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <div className="flex h-full min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 to-slate-900">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;

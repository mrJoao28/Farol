import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farol · Visão geral",
  description: "Veja onde a jornada do seu usuário deixou de funcionar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

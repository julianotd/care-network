import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Care Network — Ecossistema de Cuidado em Rede",
  description: "Plataforma de coordenação terapêutica para TEA e Desenvolvimento",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

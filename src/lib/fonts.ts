import { Outfit, Inter, Syne, Archivo_Black, Space_Mono } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const archivoblack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-brutal',
  display: 'swap',
});

const spacemono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono-tech',
  display: 'swap',
});

export const fontVariables = `${outfit.variable} ${inter.variable} ${syne.variable} ${archivoblack.variable} ${spacemono.variable}`;

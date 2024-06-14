import { Shadows_Into_Light, Montserrat } from 'next/font/google';

export const handFont = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hand',
});

export const bodyFont = Montserrat({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
});

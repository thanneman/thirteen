import { GameProvider } from '@/context/GameContext'
import { Inter } from 'next/font/google'
import './globals.css';

export const metadata = {
  title: 'Thirteen Score Tracker',
  description: 'Thirteen Score Tracker',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <GameProvider>
          <main className='container p-4 mx-auto'>
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  )
}
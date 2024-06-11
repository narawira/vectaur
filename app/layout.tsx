import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from "@/components/app/navigation"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react';
import { SplashScreen } from '@/components/app/splash-screen';
import { Footer } from '@/components/app/footer';
import { cn } from '@/lib/utils';
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	metadataBase: new URL('https://vectaur.netlify.app'),
	title: 'Vectaur',
	description: 'Elevating Your Figma Experience to New Heights',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={inter.className}>
			<body className={cn("bg-white text-foreground w-full sm:max-w-7xl mx-auto min-h-screen")}>
				<SplashScreen />
				<Navigation />
				<main className="pt-[65px]">
					{children}
				</main>
				<Toaster />
				{process.env.NEXT_PUBLIC_ENV === 'production' && (
					<Analytics />
				)}
				<Footer />
			</body>
		</html>
	)
}

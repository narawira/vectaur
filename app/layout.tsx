import './globals.css'
import { Inter } from 'next/font/google'
import { MainNav } from "@/components/app/main-nav"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react';
import { Button } from '@/components/ui/button';
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	metadataBase: new URL('https://plugin.vectaur.co'),
	title: 'Vectaur',
	description: 'Elevating Your Figma Experience to New Heights',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={`${inter.className} bg-slate-100`}>
			<body className="bg-white text-foreground max-w-[480px] mx-auto lg:border-l lg:border-r min-h-screen">
				<div className="border-b fixed top-0 left-1/2 -translate-x-1/2 bg-white max-w-[480px] border-l w-full border-r z-50">
					<div className="flex h-16 items-center justify-between px-4">
						<MainNav />
					</div>
				</div>
				<main className="pt-[65px]">{children}</main>
				<Toaster />
				{process.env.NEXT_PUBLIC_ENV === 'production' && (
					<Analytics />
				)}
				<div className="flex w-full items-center justify-between px-4 py-2 border-t gap-x-2 fixed bottom-0 left-0 bg-indigo-50 border-indigo-300">
					<div className="text-xs text-indigo-800">You can use this plugin for free, but if you want to support the development of this plugin, you can buy me a coffee.</div>
					<a href="https://github.com/sponsors/narawira" target="_blank" className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white border border-indigo-500 bg-indigo-500 shadow-sm hover:bg-indigo-600 hover:text-white p-2 w-40">
						Donate Here
					</a>
				</div>
			</body>
		</html>
	)
}

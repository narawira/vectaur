"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";
import { Figma, GalleryHorizontalEnd, LibraryBig, ListTodo, Palette, PieChart } from "lucide-react";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	const getLinkClass = (href: string) => {
		const baseClass = "text-xs font-medium py-2 px-2.5 rounded-md transition-colors flex items-center gap-x-1";

		if (href === '/ai') {
			return `${baseClass} text-indigo-500 hover:text-indigo-600 hover:bg-indigo-100 ${pathname === href ? 'bg-indigo-100 text-indigo-600' : ''}`;
		}

		return pathname === href ? `${baseClass} text-slate-600 bg-slate-100` : `${baseClass} text-slate-500 hover:text-slate-600 hover:bg-slate-100`;
	}

	return (
		<nav
			className={cn("flex items-center sm:justify-between sm:w-full space-x-1", className)}
			{...props}
		>
			<Link href="/" className="hidden sm:block">
				<Image alt="Vectaur" src="/vectaur.svg" width={100} height={20} />
			</Link>
			<div className="flex items-center space-x-1">
				<Link href="/" className={getLinkClass("/")}>
					<GalleryHorizontalEnd className="w-4 h-4"></GalleryHorizontalEnd>
					<span>Vectors</span>
				</Link>
				<Link href="/gradient" className={getLinkClass("/gradient")}>
					<Palette className="w-4 h-4"></Palette>
					<span>Gradients</span>
				</Link>
				<Link href="/chart" className={`${getLinkClass("/chart")} block sm:hidden`}>
					<PieChart className="w-4 h-4"></PieChart>
					<span>Charts</span>
				</Link>
				<Link href="/task" className={`${getLinkClass("/task")} block sm:hidden`}>
					<ListTodo className="w-4 h-4"></ListTodo>
					<span>Tasks</span>
				</Link>
				<Link href="https://www.figma.com/community/plugin/1302809395790552743/vectaur" target="_blank" className={`${getLinkClass("/task")} hidden sm:flex`}>
					<Figma className="w-4 h-4"></Figma>
					<span>Use on Figma</span>
				</Link>
			</div>
		</nav>
	)
}
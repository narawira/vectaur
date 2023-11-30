"use client";

import { insideFigma } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
	const [isInsideFigma, setIsInsideFigma] = useState(false);

	useEffect(() => {
		const isFigma = insideFigma();

		setIsInsideFigma(isFigma)
	}, [])

	if (isInsideFigma) {
		return null;
	}

	return (
		<div className="flex w-full items-center justify-center px-4 py-3 border-t gap-x-3 fixed bottom-0 left-0 bg-white sm:max-w-7xl sm:left-1/2 sm:-translate-x-1/2">
			{/* <Link href="/" className="text-xs underline">About</Link> */}
			<Link href="/license" className="text-xs underline">License</Link>
			<a href="https://github.com/narawira/vectaur" target="_blank" className="text-xs underline">Open Source</a>
		</div>
	);
}
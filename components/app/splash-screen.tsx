"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'

export function SplashScreen() {
	const [show, setShow] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setShow(false);
		}, 1000)
	}, []);

	return (
		<div className={`flex items-center justify-center h-screen bg-white fixed top-0 left-0 w-screen z-[60] transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
			<div className="text-center animate-pulse duration-1000">
				<Image src="/vecta.svg" alt="Vecta" width={160} height={160} />
				<div className="font-mono">
					Loading ...
				</div>
			</div>
		</div>
	);
}
// @ts-nocheck
"use client";

import { useState, createRef, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertGradient } from "@/lib/utils";

import GradientData from "@/data/gradients.json";

interface Gradient {
	name: string
	background: string
	dominant: string
	color: string
}

export default function WorkingTask() {
	const [keyword, setKeyword] = useState('');
	const [gradients, setGradients] = useState<Gradient[]>([] as Gradient[]);

	const refs = gradients.reduce((acc, value, index) => {
		acc[value.color] = createRef();
		return acc;
	}, {});

	const scrollToRef = (color) => {
		refs[color].current.scrollIntoView({ behavior: 'smooth' });
	}

	const handleClick = (color) => {
		scrollToRef(color);
	}

	useEffect(() => {
		if (keyword === '') {
			setGradients(GradientData);
			return;
		} else {
			setGradients(GradientData.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase())));
		}
	}, [keyword])

	const prevColor = useRef(null);

	return (
		<div className="grid grid-cols-12">

			<div className="flex items-center justify-center border-b col-span-full">
				<Input placeholder="Search something here ..." value={keyword} onChange={(e) => setKeyword((e.target as HTMLInputElement).value)} className="border-0 shadow-none rounded-none focus-visible:ring-0 h-auto px-3 py-2" />
				{keyword && (
					<Button onClick={() => {
						setKeyword('');
					}} variant={'ghost'} className="rounded-none border-0 py-2 px-2">
						<X className="w-5 h-5"></X>
					</Button>
				)}
			</div>

			<div className="col-span-4 overflow-x-hidden overflow-y-scroll h-[calc(100vh-103px)] border-r border-slate-200 p-2 space-y-2">
				<div style={{ backgroundColor: 'rgb(255, 255, 255)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border text-slate-500" onClick={() => handleClick('01-Light')}>Light</div>
				<div style={{ backgroundColor: 'rgb(123, 237, 159)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('02-Lime')}>Lime</div>
				<div style={{ backgroundColor: 'rgb(46, 213, 115)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('03-Green')}>Green</div>
				<div style={{ backgroundColor: 'rgb(236, 204, 104)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('04-Golden')}>Golden</div>
				<div style={{ backgroundColor: 'rgb(255, 127, 80)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('05-Coral')}>Coral</div>
				<div style={{ backgroundColor: 'rgb(255, 165, 2)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('06-Orange')}>Orange</div>
				<div style={{ backgroundColor: 'rgb(255, 99, 72)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('07-Tomato')}>Tomato</div>
				<div style={{ backgroundColor: 'rgb(255, 71, 87)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('08-Watermelon')}>Watermelon</div>
				<div style={{ backgroundColor: 'rgb(112, 161, 255)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('09-Blue')}>Blue</div>
				<div style={{ backgroundColor: 'rgb(55, 66, 250)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('10-Sky')}>Sky</div>
				<div style={{ backgroundColor: 'rgb(87, 96, 111)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('11-Grisaille')}>Grisaille</div>
				<div style={{ backgroundColor: 'rgb(47, 53, 66)' }} className="p-2 text-xs w-full opacity-90 transition-all duration-300 hover:opacity-100 rounded-lg text-center cursor-pointer border border-transparent text-white" onClick={() => handleClick('12-Prestige')}>Prestige</div>
			</div>

			<div className="col-span-8 h-[calc(100vh-103px)] overflow-x-hidden overflow-y-scroll">
				<div className="inline-grid gap-[1px] grid-rows-[100px_100px] grid-cols-[159px_159px] bg-slate-200">
					{gradients && gradients.map(({ name, background, color }, index) => {
						const isFirstItemInGroup = color !== prevColor.current;
						prevColor.current = color;

						return (
							<div ref={isFirstItemInGroup ? refs[color] : null} key={index} onClick={() => insertGradient(background)} className="cursor-pointer hover:border-indigo-600 w-[159px] h-[100px] bg-white flex flex-col items-center justify-start py-2 group">
								<div className="w-[140px] h-[50px] rounded-md mb-2 scale-90 transition-all duration-300 group-hover:scale-100 group-hover:rounded-2xl" style={{ background }}></div>
								<div className="text-xs text-center text-slate-500">{name}</div>
							</div>
						);
					})}
					{gradients.length === 0 && (
						<div className="col-span-full text-center text-slate-500 py-20">No data found</div>
					)}
				</div>
			</div>

		</div>
	)
}
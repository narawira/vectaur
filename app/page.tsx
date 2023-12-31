"use client";

import Image from "next/image"
import { useEffect, useRef, useState } from "react";
import Spinner from 'react-spinner-material';

import { cn, debounce, insertFromUrl, insideFigma } from "@/lib/utils";
import { Carrot, Crown, DownloadCloud, Gem, Layers, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TagData from "@/data/tags.json";
import VectorData from "@/data/vectors.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

type TagItem = {
	name: string;
	count: number;
}

type VectorItem = {
	id: number;
	order: number;
	svg: string;
	png: string;
	caption: string;
	type: number;
	created_at: string;
	tags: string[];
}

function SearchBar(
	props: {
		isInsideFigma: boolean;
		keyword: string | number | readonly string[] | undefined;
		setKeyword: (arg: string) => void;
		setPage: (arg: number) => void;
		setIsLoading: (arg: boolean) => void;
		setVector: (arg: VectorItem[]) => void;
		setSearch: (arg: string) => void;
		setType: (arg: string) => void;
		setTheme: (arg: string) => void;
		searchImage: () => void;
	}
) {
	return (
		<>
			{props.isInsideFigma && (
				<div className="flex items-center justify-center border-b col-span-full">
					<Input placeholder="Search something here ..." value={props.keyword} onChange={e => props.setKeyword((e.target as HTMLInputElement).value)} className="border-0 shadow-none rounded-none focus-visible:ring-0 h-auto px-3 py-2" />
					{props.keyword && <Button onClick={() => {
						props.setPage(1); // Reset the page

						props.setIsLoading(true);
						props.setVector([]); // Reset the vector

						props.setKeyword('');
						props.setSearch('');
						props.setType('');
						props.setTheme('');
					}} variant={'ghost'} className="rounded-none border-0 py-2 px-2">
						<X className="w-5 h-5"></X>
					</Button>}
					<Button onClick={() => props.searchImage()} className="rounded-none border-0 py-4 px-3">
						<Search className="w-5 h-5"></Search>
					</Button>
				</div>
			)}
		</>
	);
}

function ThemeFilter(
	props: {
		isInsideFigma: boolean,
		theme: string;
		changeTheme: (arg0: string) => void;
		tag: {
			name: any;
			count: any;
		}[];
	}
) {
	return (
		<div className={cn("overflow-x-hidden overflow-y-scroll border-r border-slate-200", (props.isInsideFigma ? "h-[calc(100vh-102px)]" : "h-[calc(100vh-315px)]"))}>
			<div className={`border-b text-xs px-2 py-1.5 cursor-pointer hover:bg-slate-100 text-slate-600 flex items-center justify-between ${props.theme === '' ? 'bg-slate-100' : ''}`} onClick={() => props.changeTheme('')}>
				<div className="">All</div>
			</div>
			{Array.isArray(props.tag) && props.tag.map(
				({ name, count }, index) => (
					<div key={`${name}-${index}`} className={`border-b text-xs px-2 py-1.5 cursor-pointer hover:bg-slate-100 text-slate-600 flex items-center justify-between ${props.theme === name ? 'bg-slate-100' : ''}`} onClick={() => props.changeTheme(name)}>
						<div className="">{name}</div>
						<div className="bg-indigo-200 text-indigo-700 py-0.5 px-1 rounded-sm">{count}</div>
					</div>
				)
			)}
		</div>
	);
}

function TypeFilter(
	props: {
		changeType: (arg0: string) => void;
		type: string;
	}
) {
	return (<div className="flex divide-x border-b">
		<div onClick={() => props.changeType('')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${props.type !== '' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
			<Layers className="w-3 h-3"></Layers>
			<div className="">All</div>
		</div>
		<div onClick={() => props.changeType('illustration')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${props.type !== 'illustration' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
			<Crown className="w-3 h-3"></Crown>
			<div className="">Illustration</div>
		</div>
		<div onClick={() => props.changeType('icon')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${props.type !== 'icon' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
			<Carrot className="w-3 h-3"></Carrot>
			<div className="">Icon</div>
		</div>
		<div onClick={() => props.changeType('misc')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${props.type !== 'misc' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
			<Gem className="w-3 h-3"></Gem>
			<div className="">Misc</div>
		</div>
	</div>);
}

function WebFilter(
	props: {
		isInsideFigma: boolean,
		theme: string;
		changeTheme: (arg0: string) => void;
		tag: {
			name: any;
			count: any;
		}[];
		changeType: (arg0: string) => void;
		type: string;
	}
) {
	return (<div className="sticky top-[64px]">
		<div className="space-y-4 py-4">
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
					Discover
				</h2>
				<div className="space-y-1">
					<Button onClick={() => props.changeType('')} variant={props.type !== '' ? 'ghost' : 'secondary'} className="w-full justify-start">
						<Layers className="mr-1.5 h-4 w-4"></Layers>
						<div className="">All</div>
					</Button>
					<Button onClick={() => props.changeType('illustration')} variant={props.type !== 'illustration' ? 'ghost' : 'secondary'} className="w-full justify-start">
						<Crown className="mr-1.5 h-4 w-4"></Crown>
						<div className="">Illustration</div>
					</Button>
					<Button onClick={() => props.changeType('icon')} variant={props.type !== 'icon' ? 'ghost' : 'secondary'} className="w-full justify-start">
						<Carrot className="mr-1.5 h-4 w-4"></Carrot>
						<div className="">Icon</div>
					</Button>
					<Button onClick={() => props.changeType('misc')} variant={props.type !== 'misc' ? 'ghost' : 'secondary'} className="w-full justify-start">
						<Gem className="mr-1.5 h-4 w-4"></Gem>
						<div className="">Misc</div>
					</Button>
				</div>
			</div>
			<div className="py-2">
				<h2 className="relative px-7 text-lg font-semibold tracking-tight">
					Themes
				</h2>
				<ScrollArea className="h-[calc(100vh-385px)] px-1">
					<div className="space-y-1 p-2">
						<Button variant={props.theme !== '' ? 'ghost' : 'secondary'} className="w-full justify-start font-normal" onClick={() => props.changeTheme('')}>
							<div className="">All</div>
						</Button>
						{Array.isArray(props.tag) && props.tag.map(
							({ name, count }, index) => (
								<Button key={`${name}-${index}`} variant={props.theme !== name ? 'ghost' : 'secondary'} className="w-full justify-between font-normal" onClick={() => props.changeTheme(name)}>
									<div className="">{name}</div>
									<div className="bg-indigo-200 text-indigo-700 py-0.5 px-1 rounded-sm text-xs w-6">{count}</div>
								</Button>
							)
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	</div>);
}

export default function Plugin() {
	const [keyword, setKeyword] = useState('');
	const [search, setSearch] = useState('');
	const [theme, setTheme] = useState('');
	const [type, setType] = useState('');
	const [vector, setVector] = useState<VectorItem[]>([]);
	const [tag, setTag] = useState<TagItem[]>([]);
	const [page, setPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState(false);
	const [insertLoading, setInsertLoading] = useState(false);
	const [hasMorePages, setHasMorePages] = useState(true);
	const [isInsideFigma, setIsInsideFigma] = useState(false);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// This effect will run once, after the component mounts. 
	// It sets `isInsideFigma` to true, indicating that we're now running on the client.
	useEffect(() => {
		const isFigma = insideFigma();

		setIsInsideFigma(isFigma);
	}, []);

	const changeType = (type: string) => {
		setPage(1); // Reset the page
		setIsLoading(true);
		setVector([]); // Reset the vector
		setSearch('');
		setType(type);
		setTheme('');
	}

	const changeTheme = (theme: string) => {
		setPage(1); // Reset the page
		setIsLoading(true);
		setVector([]); // Reset the vector
		setSearch('');
		setType('');
		setTheme(theme);
	}

	const searchImage = () => {
		setPage(1); // Reset the page
		setIsLoading(true);
		setVector([]); // Reset the vector
		setSearch(keyword);
		setType('');
		setTheme('');
	}

	const isBottom = (el: HTMLDivElement) => {
		return el.getBoundingClientRect().bottom <= window.innerHeight;
	}

	const handleScroll = debounce(() => {
		const container = scrollContainerRef.current;
		if (container && isBottom(container) && !isLoading && hasMorePages) {
			setPage(prevPage => prevPage + 1);
		}
	}, 500)

	const insertingNode = async (node: string, type: string) => {
		setInsertLoading(true);
		await insertFromUrl(node, type);
		setInsertLoading(false);
	}

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => {
				container.removeEventListener('scroll', handleScroll);
			}
		}
	}, [handleScroll, isLoading, hasMorePages]);

	useEffect(() => {
		if (tag.length === 0) {
			setTag(TagData);
		}
	}, [tag])

	useEffect(() => {
		setIsLoading(true);

		// Use VectorData as the data source
		const allData = VectorData;

		// Implement searching
		const searchData = allData.filter(item => item.caption?.includes(search));

		// Implement filtering
		const filteredData = searchData.filter(item => {
			if (theme === '' && type === '') return true;
			if (theme === '' && type !== '') return item.type === type;
			if (theme !== '' && type === '') return item.tags.includes(theme);
			if (theme !== '' && type !== '') return item.type === type && (theme === 'all' ? true : item.tags.includes(theme))
		});

		// Implement pagination
		const perPage = 30; // Set the number of items per page
		const offset = (page - 1) * perPage;
		const paginatedData = filteredData.slice(offset, offset + perPage);

		setVector((prevVector) => {
			const newVector = [...prevVector];
			paginatedData.forEach((data) => {
				if (!newVector.find((item) => item.id === data.id)) {
					// @ts-ignore
					newVector.push(data);
				}
			});
			return newVector;
		});

		setHasMorePages(filteredData.length > offset + perPage);
		setIsLoading(false);
	}, [page, search, theme, type]);

	return (
		<>
			{insertLoading && (
				<div className="fixed top-0 left-0 right-0 bottom-0 bg-white/95  z-50 flex items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<div className="text-xl font-medium text-indigo-600">Inserting...</div>
						<div className="text-slate-600 text-sm max-w-xs text-center">
							Please wait while we are inserting the vector into your design.
						</div>
					</div>
				</div>
			)}

			<SearchBar
				isInsideFigma={isInsideFigma}
				keyword={keyword}
				setKeyword={setKeyword}
				setSearch={setSearch}
				setTheme={setTheme}
				setType={setType}
				setVector={setVector}
				setPage={setPage}
				setIsLoading={setIsLoading}
				searchImage={searchImage}
			/>

			<div className="grid grid-cols-12">

				<div className={cn('col-span-4')}>
					{!isInsideFigma && (
						<WebFilter
							isInsideFigma={isInsideFigma}
							theme={theme}
							tag={tag}
							changeTheme={changeTheme}
							type={type}
							changeType={changeType}
						/>
					)}
					{isInsideFigma && (
						<ThemeFilter
							isInsideFigma={isInsideFigma}
							theme={theme}
							tag={tag}
							changeTheme={changeTheme}
						/>
					)}
				</div>

				<div className="col-span-8">
					{isInsideFigma && (
						<TypeFilter
							type={type}
							changeType={changeType}
						/>
					)}

					{Array.isArray(vector) && vector.length > 0 && (
						<div ref={scrollContainerRef} className={cn((isInsideFigma ? "h-[calc(100vh-132px)] bg-slate-200" : ""), "overflow-x-hidden overflow-y-scroll inline-grid gap-[1px] grid-rows-[159px_159px] grid-cols-[159px_159px] sm:flex sm:flex-wrap")}>
							{Array.isArray(vector) && vector.map((node, index) => (
								<div key={`${node.type}-${node.id}`} className={isInsideFigma ? '' : 'w-[50%-1px] sm:w-[calc(100%/3-1px)] lg:w-[calc(100%/4-1px)]'}>
									{isInsideFigma && (
										<div onClick={() => insertingNode(node.svg, 'svg')} className="cursor-pointer hover:border-indigo-600">
											<Image src={node.png} height={1024} width={1024} alt={node.caption} />
										</div>
									)}
									{!isInsideFigma && (
										<div className="cursor-pointer hover:border-indigo-600 p-2 group flex items-center justify-center">
											<div className="group-hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 relative">
												<div className="opacity-0 group-hover:opacity-100 absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center gap-x-2 z-10">
													<Button>
														<DownloadCloud className="w-4 h-4 mr-2 hidden md:block"></DownloadCloud>
														<span>PNG</span>
													</Button>
													<Button>
														<DownloadCloud className="w-4 h-4 mr-2 hidden md:block"></DownloadCloud>
														<span>SVG</span>
													</Button>
												</div>
												<Image src={node.png} height={1024} width={1024} alt={node.caption} className="scale-95 group-hover:scale-100 opacity-100 group-hover:opacity-20 transition-all duration-300 z-0" />
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{!isLoading && Array.isArray(vector) && vector.length === 0 && (
						<div className={cn("flex items-center justify-center", (isInsideFigma ? "h-[calc(100vh-132px)]" : ""))}>
							<div className="flex flex-col items-center justify-center">
								<div className="text-xl font-medium text-indigo-600">No {
									type === '2' ? 'Icon' :
										type === '3' ? 'Ornament' : 'Illustration'
								} Found</div>
								<div className="text-slate-400 text-sm text-center">
									Try another keyword or check other type.
								</div>
							</div>
						</div>
					)}
				</div>

			</div>

			<div className="fixed top-6 right-2">
				{isLoading && (
					<Spinner radius={16} stroke={2} color={"#4338ca"} visible={true} />
				)}
			</div>
		</>
	);
}

"use client";

import Image from "next/image"
import { useEffect, useRef, useState } from "react";
import Spinner from 'react-spinner-material';

import { debounce, insertFromUrl } from "@/lib/utils";
import { Carrot, Crown, Gem, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TagData from "@/data/tags.json";
import VectorData from "@/data/vectors.json";

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
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [hasMorePages, setHasMorePages] = useState(true);

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
		const perPage = 10; // Set the number of items per page
		const offset = (page - 1) * perPage;
		const paginatedData = filteredData.slice(offset, offset + perPage);

		// @ts-ignore
		setVector((prevVector) => [...prevVector, ...paginatedData]);
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

			<div className="flex items-center justify-center border-b col-span-full">
				<Input placeholder="Search something here ..." value={keyword} onChange={(e) => setKeyword((e.target as HTMLInputElement).value)} className="border-0 shadow-none rounded-none focus-visible:ring-0 h-auto px-3 py-2" />
				{keyword && (
					<Button onClick={() => {
						setPage(1); // Reset the page
						setIsLoading(true);
						setVector([]); // Reset the vector
						setKeyword('');
						setSearch('');
						setType('');
						setTheme('');
					}} variant={'ghost'} className="rounded-none border-0 py-2 px-2">
						<X className="w-5 h-5"></X>
					</Button>
				)}
				<Button onClick={() => searchImage()} className="rounded-none border-0 py-4 px-3">
					<Search className="w-5 h-5"></Search>
				</Button>
			</div>

			<div className="grid grid-cols-12">

				<div className="col-span-4 overflow-x-hidden overflow-y-scroll h-[calc(100vh-153px)] border-r border-slate-200">
					<div className={`border-b text-xs px-2 py-1.5 cursor-pointer hover:bg-slate-100 text-slate-600 flex items-center justify-between ${theme === '' ? 'bg-slate-100' : ''}`} onClick={() => changeTheme('')}>
						<div className="">All</div>
					</div>
					{Array.isArray(tag) && tag.map(({ name, count }, index) => (
						<div key={Math.random() + index} className={`border-b text-xs px-2 py-1.5 cursor-pointer hover:bg-slate-100 text-slate-600 flex items-center justify-between ${theme === name ? 'bg-slate-100' : ''}`} onClick={() => changeTheme(name)}>
							<div className="">{name}</div>
							<div className="bg-indigo-200 text-indigo-700 py-0.5 px-1 rounded-sm">{count}</div>
						</div>
					))}
				</div>

				<div className="col-span-8">
					<div className="flex divide-x border-b">
						<div onClick={() => changeType('')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${type !== '' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
							<div className="">All</div>
						</div>
						<div onClick={() => changeType('illustration')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${type !== 'illustration' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
							<Crown className="w-3 h-3"></Crown>
							<div className="">Illustration</div>
						</div>
						<div onClick={() => changeType('icon')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${type !== 'icon' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
							<Carrot className="w-3 h-3"></Carrot>
							<div className="">Icon</div>
						</div>
						<div onClick={() => changeType('misc')} className={`cursor-pointer hover:bg-slate-100 w-full px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${type !== 'misc' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
							<Gem className="w-3 h-3"></Gem>
							<div className="">Misc</div>
						</div>
					</div>

					{Array.isArray(vector) && vector.length > 0 && (
						<div ref={scrollContainerRef} className="h-[calc(100vh-182px)] overflow-x-hidden overflow-y-scroll inline-grid gap-[1px] grid-rows-[159px_159px] grid-cols-[159px_159px] bg-slate-200">
							{Array.isArray(vector) && vector.map((node, index) => (
								<div onClick={() => insertingNode(node.svg, 'svg')} key={Math.random() + node.id} className="cursor-pointer hover:border-indigo-600">
									<Image src={node.png} height={1024} width={1024} alt={node.caption} />
								</div>
							))}
						</div>
					)}

					{!isLoading && Array.isArray(vector) && vector.length === 0 && (
						<div className="flex items-center justify-center h-[calc(100vh-153px)]">
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

"use client";

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { Props } from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import { insertChart } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dices, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

type TrendType = 'up' | 'down' | 'random';
type ApexStroke = {
	show?: boolean
	curve?: 'smooth' | 'straight' | 'stepline' | 'monotoneCubic' | ('smooth' | 'straight' | 'stepline' | 'monotoneCubic')[]
	lineCap?: 'butt' | 'square' | 'round'
	colors?: string[]
	width?: number | number[]
	dashArray?: number | number[]
	fill?: ApexFill
}
interface ChartData {
	categories: number[];
	data: any[];
	labels: string[];
}

export default function Chart() {
	const MIN_POINT = 1;
	const MAX_POINT = 20;

	const MIN_RADIANT = 0;
	const MAX_RADIANT = 100;

	const MIN_STROKE = 1;
	const MAX_STROKE = 5;

	const MIN_RADIUS = 0;
	const MAX_RADIUS = 10;

	const [point, setPoint] = useState<number>(3);
	const [stroke, setStroke] = useState<number>(MIN_STROKE);
	const [radius, setRadius] = useState<number>(MIN_RADIUS);
	const [radiant, setRadiant] = useState<number>(MIN_RADIANT);

	const [trend, setTrend] = useState<TrendType>('random');
	const [type, setType] = useState<Props["type"] | 'funnel'>('area');

	const [label, setLabel] = useState<boolean>(true);
	const [horizontal, setHorizontal] = useState<boolean>(false);
	const [curve, setCurve] = useState<ApexStroke["curve"]>('straight');

	const [options, setOptions] = useState<Props>({
		tooltip: {
			enabled: false,
		},
		dataLabels: {
			enabled: label,
		},
		chart: {
			id: "vectaur",
			toolbar: {
				show: false,
			},
		},
		zoom: {
			enabled: false,
		},
		selection: {
			enabled: false,
		},
		fill: {
			opacity: 0.8
		},
	})

	const [series, setSeries] = useState<Props["series"]>([])

	const radiantChange = (value: string) => {
		const parsed = parseInt(value, 10);
		const radiant = isNaN(parsed) ? 0 : parsed;

		setRadiant(radiant > MAX_RADIANT ? MAX_RADIANT : radiant < MIN_RADIANT ? MIN_RADIANT : radiant);
	};

	const pointChange = (value: string) => {
		const parsed = parseInt(value, 10);
		const point = isNaN(parsed) ? 0 : parsed;

		setPoint(point > MAX_POINT ? MAX_POINT : point < MIN_POINT ? MIN_POINT : point);
	};

	const strokeChange = (value: string) => {
		const parsed = parseInt(value, 10);
		const stroke = isNaN(parsed) ? 0 : parsed;

		setStroke(stroke > MAX_STROKE ? MAX_STROKE : stroke < MIN_STROKE ? MIN_STROKE : stroke);
	};

	const radiusChange = (value: string) => {
		const parsed = parseInt(value, 10);
		const radius = isNaN(parsed) ? 0 : parsed;

		setRadius(radius > MAX_RADIUS ? MAX_RADIUS : radius < MIN_RADIUS ? MIN_RADIUS : radius);
	};

	const typeChange = (value: Props["type"] | 'funnel') => {
		setType(value)
	}

	const randomize = (): ChartData => {
		let categories: number[] = [];
		let data: any[] = [];
		let labels: string[] = [];
		let currentValue: number = 0;

		switch (type) {
			case 'area':
			case 'bar':
			case 'funnel':
			case 'heatmap':
			case 'line':
			case 'radar':
			case 'scatter':
				currentValue = Math.floor(Math.random() * 50) + 25; // start with a random value between 25 and 75
				categories = Array.from({ length: point }, (_, i) => 1 + i);
				data = categories.map(() => {
					const change = Math.floor(Math.random() * 10) + 1; // random change between 1 and 10
					switch (trend) {
						case 'up':
							currentValue += change;
							break;
						case 'down':
							currentValue -= change;
							break;
						case 'random':
							currentValue += Math.random() < 0.5 ? change : -change;
							break;
					}
					return currentValue;
				});
				break;
			case 'pie':
				labels = Array.from({ length: point }, (_, i) => 'Team ' + (i + 1));
				data = labels.map(() => Math.floor(Math.random() * 100) + 1); // random value between 1 and 100
				break;
			case 'radialBar':
				labels = ['Circle 1'];
				data = [radiant]; // random value between 1 and 100
				break;
		}

		return { categories, data, labels };
	}

	const download = () => {
		try {
			// @ts-ignore
			insertChart(document.querySelector('#apexchartsvectaur')?.innerHTML);
		} catch (error) {
			throw new Error('Error while downloading chart');
		}
	}

	const random = () => {
		const { data } = randomize();

		if (type === 'pie' || type === 'donut' || type === 'radialBar') {
			setSeries(data);
		} else {
			setSeries([{ name: "series", data }]);
		}
	}

	useEffect(() => {
		const { categories, data, labels } = randomize();

		if (type === 'pie' || type === 'donut' || type === 'radialBar') {
			setSeries(data);
		} else {
			setSeries([{ name: "series", data }]);
		}

		const plotOptions = {
			bar: {
				borderRadius: type === 'funnel' ? 0 : radius,
				horizontal: type === 'funnel' ? true : horizontal,
				...(type === 'funnel' && { barHeight: '80%', isFunnel: true }),
			},
		};

		const dataLabels = {
			enabled: label,
			...(type === 'funnel' && {
				formatter: function (value: string) {
					return value;
				},
				dropShadow: {
					enabled: true,
				},
			}),
		};

		const xaxis = { categories };

		setOptions((options) => ({
			...options,
			plotOptions,
			dataLabels,
			stroke: {
				width: stroke,
				...(type === 'line' || type === 'area') && { curve },
			},
			... (type === 'pie' || type === 'donut') && {
				responsive: [{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}],
				labels,
			},
			... (type === 'radialBar') && {
				plotOptions: {
					radialBar: {
						hollow: {
							size: '70%',
						}
					},
				},
				labels,
			},
			xaxis,
		}));
	}, [point, trend, type, label, stroke, radius, horizontal, curve, radiant])

	const chartElement = useMemo(
		() => (
			<ApexChart
				key={type}
				options={options}
				type={type === 'funnel' ? 'bar' : type} series={series}
				width={435}
				height={220}
			/>
		), [options, series, type]
	)

	return (
		<div className="space-y-3 px-4 py-2 h-[calc(100vh-115px)] overflow-y-scroll overflow-x-hidden">
			<Alert>
				<Info className="h-4 w-4" />
				<AlertDescription className="pt-1 text-xs">
					If the chart is not working or showing error, please try to change the chart type, settings, or restart plugin.
				</AlertDescription>
			</Alert>

			<div className="border rounded-xl shadow-sm">
				{chartElement}
			</div>

			<Card className="p-4">
				<div className="grid grid-cols-3 gap-4">
					<div className="w-full col-span-2">
						<Label>Type of Chart</Label>
						<Select value={type} onValueChange={(selected) => typeChange(selected as Props["type"])}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Choose chart type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="area">Area</SelectItem>
									<SelectItem value="bar">Column / Bar</SelectItem>
									<SelectItem value="funnel">Funnel</SelectItem>
									<SelectItem value="heatmap">Heatmap</SelectItem>
									<SelectItem value="line">Line</SelectItem>
									<SelectItem value="pie">Pie</SelectItem>
									<SelectItem value="radar">Radar</SelectItem>
									<SelectItem value="radialBar">Circle</SelectItem>
									<SelectItem value="scatter">Scatter</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					{type !== 'pie' && type !== 'donut' && type !== 'radialBar' && (
						<div className="w-full">
							<Label>Type of Trend</Label>
							<Select value={trend} onValueChange={(selected) => setTrend(selected as TrendType)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choose chart type" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="up">
											<span>Up</span>
										</SelectItem>
										<SelectItem value="down">
											<span>Down</span>
										</SelectItem>
										<SelectItem value="random">
											<span>Random</span>
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					)}

					{type === 'bar' && (
						<div className="grid w-full items-center gap-1.5">
							<Label>Horizontal Bar</Label>
							<div className="flex items-center space-x-2 py-2">
								<Checkbox id="horizontal" checked={horizontal} onCheckedChange={() => setHorizontal(!horizontal)} />
								<label
									htmlFor="horizontal"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{horizontal ? 'Enabled' : 'Disabled'}
								</label>
							</div>
						</div>
					)}
					{type !== 'radialBar' && (
						<div className="grid w-full items-center gap-1.5">
							<Label>Data Labels</Label>
							<div className="flex items-center space-x-2 py-2">
								<Checkbox id="label" checked={label} onCheckedChange={() => setLabel(!label)} />
								<label
									htmlFor="label"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{label ? 'Enabled' : 'Disabled'}
								</label>
							</div>
						</div>
					)}
					{type === 'bar' && (
						<div className="grid w-full items-center gap-1.5">
							<Label htmlFor="radius">Column Rounded</Label>
							<Input type="number" id="radius" value={radius} onChange={(e) => radiusChange(e.target.value)} min={MIN_RADIUS} max={MAX_RADIUS} />
						</div>
					)}
					{(type === 'line' || type === 'area') && (
						<div className="grid w-full items-center gap-1.5">
							<Label>Type of Trend</Label>
							<Select value={curve?.toString()} onValueChange={(selected) => setCurve(selected as ApexStroke["curve"])}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choose line curve" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="straight">
											<span>Straight</span>
										</SelectItem>
										<SelectItem value="smooth">
											<span>Smooth</span>
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					)}
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="stroke">Border Width</Label>
						<Input type="number" id="stroke" value={stroke} onChange={(e) => strokeChange(e.target.value)} min={MIN_STROKE} max={MAX_STROKE} />
					</div>
					{type !== 'radialBar' && (
						<div className="grid w-full items-center gap-1.5">
							<Label htmlFor="point">Total Data</Label>
							<Input type="number" id="point" value={point} onChange={(e) => pointChange(e.target.value)} min={MIN_POINT} max={MAX_POINT} />
						</div>
					)}
					{type === 'radialBar' && (
						<div className="grid w-full items-center gap-1.5">
							<Label htmlFor="radiant">Total Degree</Label>
							<Input type="number" id="radiant" value={radiant} onChange={(e) => radiantChange(e.target.value)} min={MIN_RADIANT} max={MAX_RADIANT} />
						</div>
					)}
				</div>
			</Card>

			<div className="flex gap-x-2">

				<Button onClick={() => random()} variant={'outline'} className="w-full gap-x-2">
					<Dices className="w-4 h-4"></Dices>
					<span>Roll the dice</span>
				</Button>
				<Button onClick={() => download()} className="w-full">
					Add to Design
				</Button>
			</div>
		</div>
	)
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { figmaAPI } from "./figmaAPI";

export function debounce(func: { apply: (arg0: any, arg1: IArguments) => void; }, delay: number | undefined) {
	let debounceTimer: string | number | NodeJS.Timeout | undefined;
	return function () {
		// @ts-ignore
		const context = this;
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(context, args), delay);
	}
}

export function insideFigma() {
	if (typeof window === 'undefined') {
		// We are in server-side rendering or a non-browser environment like a worker.
		return false;
	}

	// We are in a browser environment.
	return window.self !== window.top;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function insertFromUrl(url: string, format: string = "svg") {
	if (format === "svg") {
		const svgCode = await fetch(url).then((response) => response.text());

		// Run code in the Figma plugin sandbox
		await figmaAPI.run(
			async (figma, { svgCode, nodeID }: { svgCode: string; nodeID: string }) => {
				let node = figma.getNodeById(nodeID);

				// Create node
				node = figma.createNodeFromSvg(svgCode);

				// Set the size of the node to 1024x1024
				node.resize(1024, 1024);

				// Remove the last rectangle that acts as a background
				const reversedChildren = [...node.children].reverse();

				const backgroundRectangle = reversedChildren.find(child => child.type === 'RECTANGLE');
				if (backgroundRectangle) {
					backgroundRectangle.remove();
				}

				const backgroundVector = reversedChildren.find(child => {
					return child.type === 'VECTOR' &&
						child.width === 1024 &&
						child.height === 1024 &&
						child.fills.some((fill: { color: { r: number; g: number; b: number; }; }) => fill.color.r === 1 && fill.color.g === 1 && fill.color.b === 1);
				});
				if (backgroundVector) {
					backgroundVector.remove();
				}

				// Create a group with the node
				const group = figma.group([node], node.parent);

				// Move all children of the frame to the root group
				for (const child of group.children) {
					if (child.type === 'FRAME') {
						while (child.children.length > 0) {
							group.appendChild(child.children[0]);
						}
						child.remove();
					}
				}

				figma.currentPage.appendChild(group);

				// Insert the node at the center of the current user view
				const center = figma.viewport.center;
				group.x = center.x - group.width / 2;
				group.y = center.y - group.height / 2;

				// Center the viewport to the group
				figma.viewport.scrollAndZoomIntoView([group]);

				// Return the node's ID or some fallback if the node is somehow undefined
				return node ? node.id : "No Node ID Available";
			},
			{ svgCode, nodeID: "some-node-id" },
		);
	} else if (format === "png") {
		// Run code in the Figma plugin sandbox
		await figmaAPI.run(
			async (figma, { url }: { url: string }) => {
				figma.createImageAsync(url).then(async (image: any) => {
					// Create node
					const node = figma.createRectangle()

					// Resize the node to match the image's width and height
					const { width, height } = await image.getSizeAsync()
					node.resize(width, height)

					// Set the fill on the node
					node.fills = [
						{
							type: 'IMAGE',
							imageHash: image.hash,
							scaleMode: 'FILL'
						}
					]

					// Center the viewport to the node
					figma.viewport.scrollAndZoomIntoView([node]);
				})
			},
			{ url },
		);
	}
};

export async function insertChart(svg: string) {
	// Run code in the Figma plugin sandbox
	await figmaAPI.run(
		async (figma, { svg, nodeID }: { svg: string; nodeID: string }) => {
			let node = figma.getNodeById(nodeID);

			// Load the "Inter" font
			await figma.loadFontAsync({ family: "Inter", style: "Regular" });

			// Create node
			node = figma.createNodeFromSvg(svg);

			// Create a group with the node
			const group = figma.group([node], node.parent);

			// Create a rectangle for the background
			const background = figma.createRectangle();
			background.resize(group.width, group.height);
			background.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // white background
			background.cornerRadius = 10; // 10px radius

			// Add the background to the group
			group.appendChild(background);
			// Move all children of the frame to the root group
			for (const child of group.children) {
				if (child.type === 'FRAME') {
					while (child.children.length > 0) {
						group.appendChild(child.children[0]);
					}
					child.remove();
				}
			}

			// Recursive function to resize text nodes
			async function resizeTextNodes(node: {
				y: any;
				x: any;
				textAutoResize: string;
				textAlignVertical: string;
				textAlignHorizontal: string; type: string; fontName: { family: string; style: string; }; resize: (arg0: number, arg1: number) => void; width: number; height: number; fontSize: number; children: any;
			}, scaleFactor: number) {
				// Check if the node is a text node
				if (node.type === 'TEXT') {
					// Store the original position
					const originalX = node.x;
					const originalY = node.y;

					// Change the font to "Inter"
					node.fontName = { family: "Inter", style: "Regular" };

					// Resize the text node and increase the font size proportionally
					node.resize(node.width * scaleFactor, node.height * scaleFactor);
					node.fontSize *= scaleFactor;
					node.textAlignHorizontal = 'CENTER';
					node.textAlignVertical = 'CENTER';
					node.textAutoResize = 'WIDTH_AND_HEIGHT';

					// Set the position back to the original position
					node.x = originalX;
					node.y = originalY;
				} else if ('children' in node) {
					// If the node is a group, iterate over its children
					for (const child of node.children) {
						await resizeTextNodes(child, scaleFactor);
					}
				}
			}

			// Calculate the original aspect ratio
			const aspectRatio = group.width / group.height;

			// Calculate the new height and width
			const newHeight = 1024;
			const newWidth = aspectRatio * newHeight;

			// Calculate the scale factor
			const scaleFactor = newHeight / group.height;

			// Resize the group
			group.resize(newWidth, newHeight);

			// Resize text nodes in the group
			await resizeTextNodes(group, scaleFactor);

			figma.currentPage.appendChild(group);

			// Insert the node at the center of the current user view
			const center = figma.viewport.center;
			group.x = center.x - group.width / 2;
			group.y = center.y - group.height / 2;

			// Center the viewport to the group
			figma.viewport.scrollAndZoomIntoView([group]);

			// Return the node's ID or some fallback if the node is somehow undefined
			return node ? node.id : "No Node ID Available";
		},
		{ svg, nodeID: "some-node-id" },
	);
};

export async function insertGradient(gradientCSS: string) {
	await figmaAPI.run(
		async (figma, { gradientCSS, nodeID }: { gradientCSS: string; nodeID: string }) => {
			let node = figma.getNodeById(nodeID);

			if (!node) {
				if (figma.currentPage.selection.length > 0) {
					node = figma.currentPage.selection[0];
				} else {
					node = figma.createRectangle();
					node.resize(1024, 1024);
				}
			}

			// Parsing functions
			function parseCSSGradient(cssGradient: string) {
				const match = cssGradient.match(/linear-gradient\(([^,]+),\s*(.+)\)$/);
				if (!match) throw new Error('Invalid gradient format');

				const angle = parseAngle(match[1].trim());
				const stops = match[2].split(/,(?![^\(]*\))/).map(parseColorStop);

				return { angle, stops };
			}

			function parseAngle(angleString: string) {
				const angle = parseInt(angleString, 10);
				return isNaN(angle) ? 0 : angle;
			}

			function parseColorStop(stopString: string) {
				const parts = stopString.trim().match(/(rgba?\([^)]+\))\s*(\d+%)?/);
				if (!parts) throw new Error('Invalid color stop format');

				const color = parseRGBA(parts[1]);
				const position = parts[2] ? parseFloat(parts[2]) / 100 : undefined;
				return { color, position };
			}

			function parseRGBA(rgba: string) {
				const parts = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/);
				if (!parts) throw new Error('Invalid RGBA format');

				return {
					r: parseInt(parts[1], 10) / 255,
					g: parseInt(parts[2], 10) / 255,
					b: parseInt(parts[3], 10) / 255,
					a: parts[4] !== undefined ? parseFloat(parts[4]) : 1
				};
			}

			function convertAngleToFigmaTransform(angle: number) {
				const radians = (angle * Math.PI) / 180;
				const sin = Math.sin(radians);
				const cos = Math.cos(radians);
				return [[cos, sin, 0], [-sin, cos, 0]];
			}


			// Parse and apply the gradient
			const { angle, stops } = parseCSSGradient(gradientCSS);
			const gradientTransform = convertAngleToFigmaTransform(angle);

			node.fills = [
				{
					type: 'GRADIENT_LINEAR',
					gradientStops: stops.map(stop => ({
						color: stop.color,
						position: stop.position
					})),
					gradientTransform: gradientTransform
					// Removed the scaleMode property
				}
			];

			figma.viewport.scrollAndZoomIntoView([node]);

			return node ? node.id : "No Node ID Available";
		},
		{ gradientCSS, nodeID: "some-node-id" },
	);
}

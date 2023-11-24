export function Sponsorship() {
	return (
		<div className="flex w-full items-center justify-between px-4 py-2 border-t gap-x-2 fixed bottom-0 left-0 bg-indigo-50 border-indigo-300 sm:max-w-7xl sm:left-1/2 sm:-translate-x-1/2 sm:border-x">
			<div className="text-xs text-indigo-800">You can use this plugin for free, but if you want to support the development of this plugin, you can buy me a coffee.</div>
			<a href="https://github.com/sponsors/narawira" target="_blank" className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white border border-indigo-500 bg-indigo-500 shadow-sm hover:bg-indigo-600 hover:text-white p-2 w-40">
				Donate Here
			</a>
		</div>
	);
}
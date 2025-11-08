interface IconSvgProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

export const MoonIcon = ({ size = 24, ...props }: IconSvgProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-moon"
		{...props}
	>
		<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"/>
	</svg>
)

export const SunIcon = ({ size = 24, ...props }: IconSvgProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-sun"
		{...props}
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="M5 5l1.5 1.5" />
		<path d="M17.5 17.5L19 19" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="M5 19l1.5-1.5" />
		<path d="M17.5 6.5L19 5" />
	</svg>
)

export const ServerIcon = ({ size = 24, ...props }: IconSvgProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-server"
		{...props}
	>
		<path fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v5h18V5a2 2 0 0 0-2-2H5ZM3 14v-2h18v2a2 2 0 0 1-2 2h-6v3h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-3H5a2 2 0 0 1-2-2Z" clipRule="evenodd"/>
	</svg>
)




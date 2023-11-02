import clsx from 'clsx'
import {
	MouseEvent as ReactMouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const Navbar = () => {
	const requestRef = useRef<number>(0)
	const navRef = useRef<HTMLElement>(null)
	const followingCircleRef = useRef<HTMLSpanElement>(null)
	const [isHover, setIsHover] = useState(false)
	const [lerpPosition, setLerpPosition] = useState({ x: 0, y: 0 })
	const [position, setPosition] = useState({ x: 0, y: 0 })

	const setMousePosition = useCallback(() => {
		setLerpPosition({
			x: lerp(lerpPosition.x, position.x, 0.15),
			y: lerp(lerpPosition.y, position.y, 0.15)
		})

		requestRef.current = requestAnimationFrame(setMousePosition)
	}, [position, lerpPosition])

	const handleMouseMove = (e: MouseEvent | ReactMouseEvent) => {
		const { clientX, clientY } = e
		const { left, top } = navRef.current!.getBoundingClientRect()
		const x = clientX - left
		const y = clientY - top
		setPosition({ x, y })
	}

	useEffect(() => {
		window.addEventListener('mousemove', (e) => handleMouseMove(e))
		requestRef.current = requestAnimationFrame(setMousePosition)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			cancelAnimationFrame(requestRef.current)
		}
	}, [setMousePosition])

	return (
		<header>
			<nav
				ref={navRef}
				onMouseEnter={() => setIsHover(true)}
				onMouseMove={(e) => handleMouseMove(e as ReactMouseEvent)}
				onMouseLeave={() => setIsHover(false)}
			>
				<span
					ref={followingCircleRef}
					className={clsx('following-circle', isHover && 'is-hover')}
					style={{
						transform: `translate(${lerpPosition.x}px, ${lerpPosition.y}px)`
					}}
				/>
				<ul>
					<li>Home</li>
					<li>Work</li>
					<li>Profile</li>
					<li>Journal</li>
				</ul>
			</nav>
		</header>
	)
}

export default Navbar

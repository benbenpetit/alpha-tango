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
  const [navPos, setNavPos] = useState({ x: 0, y: 0 })
  const [lerpPosition, setLerpPosition] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const pointRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [itemsX, setItemsX] = useState<number[]>([])
  const [lerpPointX, setLerpPointX] = useState(0)
  const [pointX, setPointX] = useState(0)

  const handleWindowResize = () => {
    const items = listRef.current!.children
    const itemsX = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const { left, width } = item.getBoundingClientRect()
      const x = left - navRef.current!.getBoundingClientRect().left + width / 2
      itemsX.push(x)
    }
    setItemsX(itemsX)
    setNavPos({
      x: navRef.current!.getBoundingClientRect().left,
      y: navRef.current!.getBoundingClientRect().top
    })
  }

  const handleMouseEnterLink = (i: number) => {
    const position = itemsX[i]
    setPointX(position)
  }

  const handleMouseLeaveLink = () => {
    const position = itemsX[activeItemIndex]
    setPointX(position)
  }

  const setMousePosition = useCallback(() => {
    setLerpPosition({
      x: lerp(lerpPosition.x, position.x, 0.15),
      y: lerp(lerpPosition.y, position.y, 0.15)
    })

    setLerpPointX(lerp(lerpPointX, pointX, 0.08))

    requestRef.current = requestAnimationFrame(setMousePosition)
  }, [position, lerpPosition, pointX, lerpPointX])

  const handleMouseMove = useCallback(
    (e: MouseEvent | ReactMouseEvent) => {
      const { clientX, clientY } = e
      const x = clientX - navPos.x
      const y = clientY - navPos.y
      setPosition({ x, y })
    },
    [navPos]
  )

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('mousemove', (e) => handleMouseMove(e))
    requestRef.current = requestAnimationFrame(setMousePosition)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(requestRef.current)
    }
  }, [handleMouseMove, setMousePosition])

  useEffect(() => {
    handleWindowResize()
    setTimeout(() => {
      handleWindowResize()
    }, 1000)
  }, [navRef])

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
            transform: `translate(calc(${lerpPosition.x}px - 50%), calc(${lerpPosition.y}px - 50%))`
          }}
        />
        <span
          ref={pointRef}
          className='point'
          style={{ transform: `translateX(calc(${lerpPointX}px - 50%))` }}
        />
        <ul ref={listRef}>
          {['Home', 'Work', 'Profile', 'Journal'].map((item, i) => (
            <li
              key={i}
              className={clsx(activeItemIndex === i && 'is-active')}
              onClick={() => setActiveItemIndex(i)}
              onMouseEnter={() => handleMouseEnterLink(i)}
              onMouseLeave={handleMouseLeaveLink}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar

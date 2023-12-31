import { useLenis } from '@studio-freight/react-lenis'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FLOWERS } from '../constants/data'

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const Navbar = () => {
  const lenis = useLenis()
  const requestRef = useRef<number>(0)
  const navRef = useRef<HTMLElement>(null)
  const pointRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [itemsX, setItemsX] = useState<number[]>([])
  const [lerpPointX, setLerpPointX] = useState(-100)
  const [pointX, setPointX] = useState(-100)

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
  }

  const handleMouseEnterLink = (i: number) => {
    const position = itemsX[i]
    setPointX(position)
  }

  const handleMouseLeaveLink = useCallback(() => {
    const position = itemsX[activeItemIndex]
    setPointX(position)
  }, [activeItemIndex, itemsX])

  useEffect(() => {
    const setMousePosition = () => {
      setLerpPointX(lerp(lerpPointX, pointX, 0.08))
      requestRef.current = requestAnimationFrame(setMousePosition)
    }

    window.addEventListener('resize', handleWindowResize)
    requestRef.current = requestAnimationFrame(setMousePosition)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      cancelAnimationFrame(requestRef.current)
    }
  }, [lerpPointX, pointX])

  useEffect(() => {
    handleWindowResize()
    setTimeout(() => {
      handleWindowResize()
    }, 1000)
  }, [navRef])

  return (
    <header>
      <nav ref={navRef}>
        <span
          ref={pointRef}
          className='point'
          style={{ transform: `translateX(${lerpPointX}px)` }}
        />
        <ul ref={listRef}>
          {FLOWERS.map((flower, i) => (
            <a
              href={`#${flower.href}`}
              onClick={() =>
                lenis.scrollTo(`#${flower.href}`, {
                  duration: 2
                })
              }
            >
              <li
                key={i}
                className={clsx(activeItemIndex === i && 'is-active')}
                onClick={() => setActiveItemIndex(i)}
                onMouseEnter={() => handleMouseEnterLink(i)}
                onMouseLeave={handleMouseLeaveLink}
              >
                {flower.title}
              </li>
            </a>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar

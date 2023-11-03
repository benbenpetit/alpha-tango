import { ReactLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import './styles/main.scss'

gsap.registerPlugin(ScrollTrigger)

const IMAGES = [
  {
    url: 'flower-1.jpg',
    title: 'Flower 1'
  },
  {
    url: 'flower-2.jpg',
    title: 'Flower 2'
  },
  {
    url: 'flower-3.jpg',
    title: 'Flower 3'
  },
  {
    url: 'flower-4.jpg',
    title: 'Flower 4'
  }
]

const getImageUrl = (x: string) => {
  return new URL(`/src/assets/img/${x}`, import.meta.url).href
}

const App = () => {
  const diapoRef = useRef<HTMLElement>(null)
  const [sizeStyle, setSizeStyle] = useState({})

  const handleWindowResize = () => {
    const windowWidth = document.body.clientWidth
    const restraignedWidth = windowWidth - 128
    const aspectRatio = 25 / 14
    const maxHeight = restraignedWidth / aspectRatio
    setSizeStyle({
      width: restraignedWidth,
      maxWidth: restraignedWidth,
      height: maxHeight,
      maxHeight: maxHeight
    })
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.container').forEach((self, i, { length }) => {
        const element = self as HTMLElement
        const fixerElement = element.querySelector('.fixer')
        const gap = 100 / length
        const marginTop = Math.max(
          60,
          window.innerHeight / 2 - element.clientHeight / 2 - (gap * length) / 2
        )

        gsap.fromTo(
          fixerElement,
          { scale: 1 },
          {
            scale: 0.8 + (i / length) * 0.18,
            filter: 'blur(3px)',
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: `top ${marginTop + i * gap}`,
              end: 'bottom top',
              scrub: true
            },
            onStart: () => {
              gsap.set(fixerElement, {
                position: 'fixed',
                top: marginTop + i * gap
              })
            },
            onReverseComplete: () => {
              gsap.set(fixerElement, {
                position: 'initial',
                top: 0
              })
            }
          }
        )
      })
    })

    return () => ctx.revert()
  })

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    setTimeout(() => {
      handleWindowResize()
    }, 200)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <ReactLenis root>
      <Navbar />
      <main>
        <h1>Botanical art</h1>
        <section ref={diapoRef} className='diapo'>
          {IMAGES.map((x, i) => (
            <div key={i} className='container' style={{ ...sizeStyle }}>
              <div className='fixer' style={{ ...sizeStyle }}>
                <img src={getImageUrl(x.url)} alt={x.title} />
              </div>
            </div>
          ))}
        </section>
        <section style={{ paddingLeft: 60, opacity: 0 }}>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam
            maiores eaque at architecto sapiente! Ipsam dolorem dignissimos
            tempore vitae perferendis?
          </p>
          <p>
            Amet officiis labore, quos eligendi laboriosam facere praesentium
            quia corporis sed porro qui impedit neque quisquam fugiat aliquid
            tempora excepturi cupiditate est recusandae molestias quasi illum
            nam! Odio autem voluptate blanditiis tempora, doloremque labore
            impedit enim illum non dolorum, ut perferendis nulla!
          </p>
          <p>
            Facilis rerum culpa ex soluta sapiente beatae assumenda, magni
            voluptatibus quibusdam. Magnam incidunt quis in excepturi,
            voluptatum sint deleniti consectetur quaerat ex a officiis neque?
            Aliquid reprehenderit laborum consequatur quam repellendus, sequi
            veniam et unde natus provident. Iste illo tenetur quidem nobis
            laborum, illum molestiae quisquam, expedita fuga praesentium
            perferendis facilis obcaecati vero cupiditate saepe alias. Culpa,
            similique dolores numquam ipsum atque dolore autem aliquid veniam
            iure in, praesentium blanditiis magni fuga.
          </p>
        </section>
      </main>
    </ReactLenis>
  )
}

export default App

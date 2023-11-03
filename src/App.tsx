import { ReactLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import { FLOWERS } from './constants/data'
import './styles/main.scss'

gsap.registerPlugin(ScrollTrigger)

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
      const elements: HTMLElement[] = gsap.utils.toArray('.container')
      const length = elements.length
      const elementsProperties = elements.map((element, i) => {
        const fixerElement = element.querySelector('.fixer')
        const gap = 100 / length
        const marginTop = Math.max(
          60,
          window.innerHeight / 2 - element.clientHeight / 2 - (gap * length) / 2
        )
        const scaleTo = 0.8 + (i / length) * 0.18
        const endTransform =
          (length - 1 - i) * element.clientHeight - (length - 1 - i) * gap

        return {
          element,
          fixerElement,
          gap,
          marginTop,
          scaleTo,
          endTransform
        }
      })

      gsap.utils.toArray('.container').forEach((_, i, { length }) => {
        if (i < length - 1) {
          gsap.fromTo(
            elementsProperties[i].fixerElement,
            { scale: 1 },
            {
              scale: elementsProperties[i].scaleTo,
              filter: 'blur(3px)',
              ease: 'none',
              scrollTrigger: {
                trigger: elementsProperties[i].element,
                start: `top ${
                  elementsProperties[i].marginTop +
                  i * elementsProperties[i].gap
                }`,
                end: 'bottom top',
                scrub: true
              },
              onStart: () => {
                gsap.set(elementsProperties[i].fixerElement, {
                  position: 'fixed',
                  top:
                    elementsProperties[i].marginTop +
                    i * elementsProperties[i].gap
                })
              },
              onReverseComplete: () => {
                gsap.set(elementsProperties[i].fixerElement, {
                  position: 'initial',
                  top: 0
                })
              }
            }
          )
        }
      })

      ScrollTrigger.create({
        trigger: '.diapo',
        end: `bottom ${
          elementsProperties[0].element.clientHeight +
          elementsProperties[0].marginTop +
          elementsProperties[0].gap * (length - 1)
        }`,
        onLeave: () => {
          gsap.utils.toArray('.container').forEach((_, i) => {
            if (i < length - 1) {
              gsap.set(elementsProperties[i].fixerElement, {
                position: 'initial',
                top: 0,
                transform: `translateY(${elementsProperties[i].endTransform}px) scale(${elementsProperties[i].scaleTo})`
              })
            }
          })
        },
        onEnterBack: () => {
          gsap.utils.toArray('.container').forEach((_, i) => {
            if (i < length - 1) {
              gsap.set(elementsProperties[i].fixerElement, {
                position: 'fixed',
                top:
                  elementsProperties[i].marginTop +
                  i * elementsProperties[i].gap,
                transform: `translateY(0) scale(${elementsProperties[i].scaleTo})`
              })
            }
          })
        }
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
          {FLOWERS.map((flower, i) => (
            <div
              key={i}
              id={flower.href}
              className='container'
              style={{ ...sizeStyle }}
            >
              <div className='fixer' style={{ ...sizeStyle }}>
                <img src={getImageUrl(flower.url)} alt={flower.title} />
              </div>
            </div>
          ))}
        </section>
        <section style={{ paddingLeft: 60 }}>
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
          <p>Ipsam dolorem dignissimos tempore vitae perferendis?</p>
        </section>
      </main>
    </ReactLenis>
  )
}

export default App

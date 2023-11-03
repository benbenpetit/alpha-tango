import { ReactLenis } from '@studio-freight/react-lenis'
import Navbar from './components/Navbar'
import './styles/main.scss'

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
  return (
    <ReactLenis root>
      <Navbar />
      <main>
        <h1>Botanical art</h1>
        <section className='diapo'>
          {IMAGES.map((x, i) => (
            <img key={i} src={getImageUrl(x.url)} alt={x.title} />
          ))}
        </section>
      </main>
    </ReactLenis>
  )
}

export default App

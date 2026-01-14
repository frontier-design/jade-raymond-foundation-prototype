import { useState, useEffect } from 'react'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import Hero from './components/Hero.jsx'
import ContentSection from './components/ContentSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  const lightenColor = (color, amount) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.round(r + (255 - r) * amount)
    const newG = Math.round(g + (255 - g) * amount)
    const newB = Math.round(b + (255 - b) * amount)
    
    return `#${[newR, newG, newB].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')}`
  }

  const [cursorColor, setCursorColor] = useState('#049878')
  const [backgroundColor, setBackgroundColor] = useState(() => lightenColor('#049878', 0.95))
  const [isGridLoaded, setIsGridLoaded] = useState(false)
  const [isHeroLoaded, setIsHeroLoaded] = useState(false)
  const [isContentLeftLoaded, setIsContentLeftLoaded] = useState(false)
  const [isContentRightLoaded, setIsContentRightLoaded] = useState(false)
  const [isFooterLoaded, setIsFooterLoaded] = useState(false)

  useEffect(() => {
    const gridTimer = setTimeout(() => setIsGridLoaded(true), 200)
    const heroTimer = setTimeout(() => setIsHeroLoaded(true), 500)
    const contentLeftTimer = setTimeout(() => setIsContentLeftLoaded(true), 900)
    const contentRightTimer = setTimeout(() => setIsContentRightLoaded(true), 1200)
    const footerTimer = setTimeout(() => setIsFooterLoaded(true), 1400)

    return () => {
      clearTimeout(gridTimer)
      clearTimeout(heroTimer)
      clearTimeout(contentLeftTimer)
      clearTimeout(contentRightTimer)
      clearTimeout(footerTimer)
    }
  }, [])

  useEffect(() => {
    const interpolateColor = (color1, color2, factor) => {
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')
      
      const r1 = parseInt(hex1.substr(0, 2), 16)
      const g1 = parseInt(hex1.substr(2, 2), 16)
      const b1 = parseInt(hex1.substr(4, 2), 16)
      
      const r2 = parseInt(hex2.substr(0, 2), 16)
      const g2 = parseInt(hex2.substr(2, 2), 16)
      const b2 = parseInt(hex2.substr(4, 2), 16)
      
      const r = Math.round(r1 + (r2 - r1) * factor)
      const g = Math.round(g1 + (g2 - g1) * factor)
      const b = Math.round(b1 + (b2 - b1) * factor)
      
      return `#${[r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')}`
    }

    const lightenColor = (color, amount) => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      const newR = Math.round(r + (255 - r) * amount)
      const newG = Math.round(g + (255 - g) * amount)
      const newB = Math.round(b + (255 - b) * amount)
      
      return `#${[newR, newG, newB].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')}`
    }

    const leftColor = '#0ABE78'
    const middleColor = '#049878'
    const rightColor = '#005E40'
    
    let animationFrameId
    const startTime = Date.now()
    const animationDuration = 8000
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed % animationDuration) / animationDuration
      
      const cycle = (Math.sin(progress * Math.PI * 2) + 1) / 2
      
      let selectedColor
      
      if (cycle < 0.33) {
        const factor = cycle / 0.33
        selectedColor = interpolateColor(leftColor, middleColor, factor)
      } else if (cycle < 0.66) {
        const factor = (cycle - 0.33) / 0.33
        selectedColor = interpolateColor(middleColor, rightColor, factor)
      } else {
        const factor = (cycle - 0.66) / 0.34
        selectedColor = interpolateColor(rightColor, leftColor, factor)
      }
      
      setCursorColor(selectedColor)
      
      const bgColor = lightenColor(selectedColor, 0.95)
      setBackgroundColor(bgColor)
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${cursorColor}"/></svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    let link = document.querySelector("link[rel*='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    
    const previousUrl = link.href
    link.href = url
    
    return () => {
      if (previousUrl && previousUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrl)
      }
      URL.revokeObjectURL(url)
    }
  }, [cursorColor])

  return (
    <>
      <GlobalStyle cursorColor={cursorColor} backgroundColor={backgroundColor} />
      <GridOverlay isLoaded={isGridLoaded} delay={0.2} />
      <Hero isLoaded={isHeroLoaded} delay={0.5} />
      <ContentSection 
        isLeftLoaded={isContentLeftLoaded} 
        isRightLoaded={isContentRightLoaded}
        leftDelay={0.9}
        rightDelay={1.2}
      />
      <Footer isLoaded={isFooterLoaded} delay={1.4} />
    </>
  )
}

export default App

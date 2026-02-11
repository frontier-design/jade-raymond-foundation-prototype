import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { GRID } from '../grid/config.js'

const WORDS = ['Jade', 'Raymond', 'Foundation']

const ASCII_COLOR = '#cbcbcb'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Line = styled.div`
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 300;
  font-size: 55px;
  line-height: 1;
  letter-spacing: -0.05em;
  color: ${ASCII_COLOR};
  opacity: 0;
  white-space: pre;
  will-change: transform, opacity, color, font-weight, font-size;

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    font-size: 1.75rem;
  }
`

function LoadingScreen({ onComplete }) {
  const overlayRef = useRef(null)
  const lineRefs = useRef([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = ''
          document.body.style.overflow = ''
          setDone(true)
          onComplete?.()
        },
      })

      // ── Phase 1: Fade in the words, then hold ──
      masterTl.to(lineRefs.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      })
      masterTl.to({}, { duration: 0.6 })

      // ── Phase 2: Fly all lines to their exact Header positions at once ──
      masterTl.call(() => {
        masterTl.pause()

        const headerLines = document.querySelectorAll('[data-title-line]')
        if (headerLines.length < WORDS.length) {
          masterTl.resume()
          return
        }

        const targetFontSize = parseFloat(
          getComputedStyle(headerLines[0]).fontSize
        )

        // Snapshot all positions BEFORE changing any layout
        const measurements = WORDS.map((_, i) => {
          const el = lineRefs.current[i]
          const currentRect = el.getBoundingClientRect()
          const headerRect = headerLines[i].getBoundingClientRect()
          return { el, currentRect, headerRect }
        })

        // Convert all lines to fixed positioning at their current location
        measurements.forEach(({ el, currentRect }) => {
          el.style.position = 'fixed'
          el.style.left = `${currentRect.left}px`
          el.style.top = `${currentRect.top}px`
          el.style.margin = '0'
        })

        // Animate ALL lines simultaneously (no stagger)
        const moveTl = gsap.timeline({
          onComplete: () => masterTl.resume(),
        })

        measurements.forEach(({ el, headerRect }) => {
          moveTl.to(
            el,
            {
              left: headerRect.left,
              top: headerRect.top,
              fontSize: targetFontSize,
              fontWeight: 800,
              color: 'var(--color-heading)',
              duration: 0.8,
              ease: 'power3.inOut',
            },
            0 // all start at time 0 — move together
          )
        })
      })

      // ── Phase 3: Fade out the overlay ──
      masterTl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      })
    })

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      ctx.revert()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null

  return (
    <Overlay ref={overlayRef}>
      <TextContainer>
        {WORDS.map((word, i) => (
          <Line
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
          >
            {word}
          </Line>
        ))}
      </TextContainer>
    </Overlay>
  )
}

export default LoadingScreen

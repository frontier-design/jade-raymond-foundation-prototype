import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'

const Section = styled.section`
  padding: 4rem 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
  }
`

const StatusText = styled.p`
  margin: 0;
  margin-top: 5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 60px;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--color-heading);

  @media (max-width: ${GRID.BREAKPOINT}) {
    font-size: 1.5rem;
    margin-top: 0rem;
  }
`

const Word = styled.span`
  display: inline-block;
  white-space: pre;
  opacity: 0;
`

const STATUS_COPY =
  "The Jade Raymond Foundation is in its early stages of development. Information about programs, partnerships, and initiatives will be shared as they are formally launched. Full website coming Fall 2026."
const WORDS = STATUS_COPY.split(' ')

function Status() {
  const textRef = useRef(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return
        animatedRef.current = true
        const words = el.querySelectorAll('.status-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.28, stagger: 0.022, ease: 'power2.out' }
        )
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Section aria-labelledby="status-heading">
      <Grid>
        <GridCell $start={1} $span={3} $startMobile={1} $spanMobile={4}>
          <div className="section-header">
            <h2 id="status-heading" className="section-heading-type">● Status</h2>
          </div>
        </GridCell>
        <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
          <StatusText ref={textRef}>
            {WORDS.map((word, i) => (
              <Word key={i} className="status-word">
                {word}
                {i < WORDS.length - 1 ? ' ' : ''}
              </Word>
            ))}
          </StatusText>
        </GridCell>
      </Grid>
    </Section>
  )
}

export default Status

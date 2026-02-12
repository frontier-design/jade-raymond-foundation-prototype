import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'
import AsciiVideo from './AsciiVideo.jsx'
import shardsVideo from '../assets/videos/jade-video-compressed.mp4'

const Section = styled.section`
  position: relative;
  overflow: hidden;
  padding: 4rem 0;

  /* Vertical spacing between content rows */
  & > div > div:nth-child(n + 3) {
    margin-top: 10rem;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
    & > div > div:nth-child(n + 3) {
      margin-top: 2rem;
    }
  }
`

const WhiteGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #ffffff, transparent, #ffffff);
  pointer-events: none;
  z-index: 1;
`

const AsciiBackground = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(180deg);
  pointer-events: none;
  z-index: 0;
`

const Paragraph = styled.p`
  margin: 0;
  opacity: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 300;
  font-size: clamp(2.25rem, 2vw, 2.5rem);
  line-height: 1.25;
  color: var(--color-body);

  @media (max-width: ${GRID.BREAKPOINT}) {
    font-size: 1.25rem;
    font-weight: 350;
  }
`

const Strong = styled.strong`
  font-weight: 300;
  /* color: var(--color-strong-text); */
  color: var(--color-body);
  /* padding: 0.25rem 0.5rem; */
  background-color: #a1a1a146;
`

const PARAGRAPH_1 = (
  <>
    In an era of accelerated technological change and algorithmically mediated culture, human creativity remains{' '}
    <Strong>the essential catalyst for scientific discovery, cultural progress, and meaningful innovation.</Strong>
  </>
)

const PARAGRAPH_2 = (
  <>
    The Jade Raymond Foundation exists to ensure that emerging technologies{' '}
    <Strong>amplify rather than diminish our creative and imaginative capacities</Strong>
    . Through support for learning, exploration, and invention, the Foundation advances models that cultivate originality, critical thinking, and{' '}
    <Strong>the ability to imagine better futures.</Strong>
  </>
)

const PARAGRAPH_3 = (
  <>
    With a particular focus on young thinkers and emerging innovators,{' '}
    <Strong>we work to safeguard and elevate human creativity</Strong>
    {' '}as a vital force alongside technology in shaping conditions for a thriving society.
  </>
)

function About() {
  const paragraphRefs = useRef([])
  const animatedRef = useRef(new Set())

  useEffect(() => {
    const observers = paragraphRefs.current.map((el, i) => {
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || animatedRef.current.has(i)) return
          animatedRef.current.add(i)
          gsap.fromTo(
            el,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          )
        },
        { threshold: 0.75, rootMargin: '0px 0px -50px 0px' }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <Section aria-labelledby="about-heading">
      <WhiteGradientOverlay />
      <AsciiBackground>
        <AsciiVideo src={shardsVideo} width="100%" height="100%" />
      </AsciiBackground>
      <Grid style={{ position: 'relative', zIndex: 1 }}>
        <GridCell $start={1} $span={2} $startMobile={1} $spanMobile={4}>
          <div className="section-header">
            <h2 id="about-heading" className="section-heading-type">● About</h2>
          </div>
        </GridCell>
        <GridCell $start={4} $span={10} $startMobile={1} $spanMobile={4}>
          <Paragraph ref={(el) => (paragraphRefs.current[0] = el)}>{PARAGRAPH_1}</Paragraph>
        </GridCell>
        <GridCell $start={1} $span={9} $startMobile={1} $spanMobile={4}>
          <Paragraph ref={(el) => (paragraphRefs.current[1] = el)}>{PARAGRAPH_2}</Paragraph>
        </GridCell>
        <GridCell $start={6} $span={7} $startMobile={1} $spanMobile={4}>
          <Paragraph ref={(el) => (paragraphRefs.current[2] = el)}>{PARAGRAPH_3}</Paragraph>
        </GridCell>
      </Grid>
    </Section>
  )
}

export default About

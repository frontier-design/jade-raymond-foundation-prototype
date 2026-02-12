import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'
import AsciiVideo from './AsciiVideo.jsx'
import jadeVideo from '../assets/videos/jade-video-compressed.mp4'

const Section = styled.section`
  position: relative;
  overflow: hidden;
  padding: 7rem 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
    & > div > div:nth-child(n + 2) {
      margin-top: 1.5rem;
    }
  }
`

const WhiteGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* make the gradient go from white to transparent to white again */
  background: linear-gradient(to bottom, #ffffff, transparent, #ffffff);
  pointer-events: none;
  z-index: 1;
`

const AsciiBackground = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`


const Block = styled.div`
  opacity: 0;
`

const BursaryItem = styled.div`
  margin-bottom: ${(props) => props.$marginBottom ?? '5rem'};

  @media (max-width: ${GRID.BREAKPOINT}) {
    margin-bottom: 3rem;
  }
`

const BursaryTitle = styled.h3`
  margin-bottom: 1.5rem;
`

const Description = styled.p`
  margin: 0 0 1.25rem;
  max-width: 425px;
`

/* Button: black bg, white text, rounded – aligned with Nav active state */
const LearnMoreButton = styled.button`
  display: inline-block;
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 350;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--color-strong-text);
  background: var(--color-strong-bg);
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 8px 16px;
    font-size: 0.925rem;
  }
`

const BURSARIES = [
  {
    title: "St. George's\nSchool Bursary",
    description:
      "St. George's School Bursary, highlighting the school's emphasis on creative thinking and self-expression.",
    href: 'https://www.stgeorges.qc.ca/admissions/tuition-scholarships-bursaries/',
    $start: 4,
    $span: 6,
    marginBottom: '10rem',
  },
  {
    title: 'McGill Women in\nComputer Science',
    description:
      'McGill Women in Computer Science Scholarship, supporting women entering technical fields.',
    href: 'https://www.youtube.com/watch?v=OAaRIYWLyA4',
    $start: 1,
    $span: 7,
    marginBottom: '5rem',
  },
  {
    title: 'Selwyn House\nScholarship',
    description:
      "Selwyn House Scholarship, supporting boys' education in parallel with other youth-focused initiatives.",
    href: 'https://www.selwyn.ca/admissions/tuition-and-bursaries#:~:text=For%20new%20students%20entering%20Grades,assessed%20on%20an%20individual%20basis.',
    $start: 6,
    $span: 6,
    marginBottom: '0',
  },
]

function Bursaries() {
  const blockRefs = useRef([])
  const animatedRef = useRef(new Set())

  useEffect(() => {
    const observers = blockRefs.current.map((el, i) => {
      if (!el) return null
      const fromX = i === 1 ? 50 : -50
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || animatedRef.current.has(i)) return
          animatedRef.current.add(i)
          gsap.fromTo(
            el,
            { x: fromX, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          )
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <Section aria-labelledby="bursaries-heading">
      <WhiteGradientOverlay />
      <AsciiBackground>
        <AsciiVideo src={jadeVideo} width="100%" height="100%" />
      </AsciiBackground>
      <Grid style={{ position: 'relative', zIndex: 1 }}>
        <GridCell $start={1} $span={3} $startMobile={1} $spanMobile={4}>
          <div className="section-header">
            <h2 id="bursaries-heading" className="section-heading-type">● Bursaries</h2>
          </div>
        </GridCell>
        {BURSARIES.map((b, i) => (
          <GridCell
            key={b.title}
            $start={b.$start}
            $span={b.$span}
            $startMobile={1}
            $spanMobile={4}
          >
            <Block ref={(el) => (blockRefs.current[i] = el)}>
              <BursaryItem $marginBottom={b.marginBottom}>
                <BursaryTitle className="title-type" style={{ whiteSpace: 'pre-line' }}>
                  {b.title}
                </BursaryTitle>
                <Description className="body-type">{b.description}</Description>
                <LearnMoreButton
                  as="a"
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </LearnMoreButton>
              </BursaryItem>
            </Block>
          </GridCell>
        ))}
      </Grid>
    </Section>
  )
}

export default Bursaries

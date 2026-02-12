import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'

const Section = styled.section`
  padding: 7rem 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
    & > div > div:nth-child(n + 2) {
      margin-top: 1.5rem;
    }
  }
`


const ColumnHeading = styled.h3`
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 60px;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--color-heading);
  margin-bottom: 1.5rem;

  @media (max-width: 1310px) {
    font-size: 2.5rem;
    margin-bottom: 1.15rem;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    font-size: 1.5rem;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    & > div > div:not(:first-child) {
      margin-top: 1.5rem;
    }
  }
`

const Block = styled.div`
  opacity: 0;
`

const Description = styled.p`
  margin: 0;
`

const AREAS = [
  {
    title: 'Creativity & Imagination',
    description:
      'Advancing creative capacity as a foundational human skill across art, science, and technology.',
  },
  {
    title: 'Learning & Exploration',
    description:
      'Supporting models of education and inquiry that prioritize originality, critical thinking, and experimentation.',
  },
  {
    title: 'Emerging Innovators',
    description:
      'Developing young thinkers and builders whose ideas shape future cultural and scientific landscapes.',
  },
]

function FocusAreas() {
  const blockRefs = useRef([])
  const animatedRef = useRef(false)

  useEffect(() => {
    const section = blockRefs.current[0]?.closest('section')
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return
        animatedRef.current = true
        const blocks = blockRefs.current.filter(Boolean)
        gsap.fromTo(
          blocks,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power2.out',
          }
        )
      },
      { threshold: 0.75, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <Section aria-labelledby="focus-areas-heading">
      <Grid>
        <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
          <div className="section-header">
            <h2 id="focus-areas-heading" className="section-heading-type">● Focus Areas</h2>
          </div>
        </GridCell>
        {AREAS.map((area, i) => (
          <GridCell
            key={area.title}
            $start={i * 4 + 1}
            $span={4}
            $startMobile={1}
            $spanMobile={4}
          >
            <Block ref={(el) => (blockRefs.current[i] = el)}>
              <ColumnHeading>
                {area.title === 'Creativity & Imagination' ? (
                  <>
                    Creativity
                    <br />
                    & Imagination
                  </>
                ) : area.title === 'Learning & Exploration' ? (
                  <>
                    Learning
                    <br />
                    & Exploration
                  </>
                ) : area.title === 'Emerging Innovators' ? (
                  <>
                    Emerging
                    <br />
                    Innovators
                  </>
                ) : (
                  area.title
                )}
              </ColumnHeading>
              <Description className="body-type">{area.description}</Description>
            </Block>
          </GridCell>
        ))}
      </Grid>
    </Section>
  )
}

export default FocusAreas

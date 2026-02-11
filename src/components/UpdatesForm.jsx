import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'

const Block = styled.div`
  opacity: 0;
`

const Section = styled.section`
  padding: 7rem 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 3rem 0;
  }
`

const FormTitle = styled.h2`
  white-space: pre-line;

  @media (max-width: ${GRID.BREAKPOINT}) {
    white-space: normal;
    margin-bottom: 2rem;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  color: var(--color-body);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;

  &::placeholder {
    color: #a1a1a1;
    line-height: 1.5;
  }

  &:focus {
    outline: none;
    border-color: var(--color-heading);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  color: var(--color-body);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  appearance: none;
  resize: none;


  &::placeholder {
    color: #a1a1a1;
    line-height: 1.5;
  }

  &:focus {
    outline: none;
    border-color: var(--color-heading);
  }
`

const SubmitButton = styled.button`
  display: inline-block;
  align-self: flex-start;
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 350;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--color-strong-text);
  background: var(--color-strong-bg);
  border-radius: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 8px 16px;
    font-size: 0.925rem;
  }
`

function UpdatesForm() {
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
    <Section aria-labelledby="updates-form-heading">
      <Grid>
        <GridCell $start={1} $span={4} $startMobile={1} $spanMobile={4}>
          <Block ref={(el) => (blockRefs.current[0] = el)}>
            <FormTitle id="updates-form-heading" className="title-type">
              For
              <br />
              Updates
            </FormTitle>
          </Block>
        </GridCell>
        <GridCell $start={7} $span={6} $startMobile={1} $spanMobile={4}>
          <Block ref={(el) => (blockRefs.current[1] = el)}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Input
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  aria-label="Email address"
                  required
                />
                <Textarea
                  name="reason"
                  placeholder={'Reason for interest in\nthe Jade Raymond Foundation'}
                  aria-label="Reason for interest"
                  rows={4}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
              </FormGroup>
            </form>
          </Block>
        </GridCell>
      </Grid>
    </Section>
  )
}

export default UpdatesForm

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { Grid, GridCell, GRID } from '../grid'
import AsciiVideo from './AsciiVideo.jsx'

const HeaderWrapper = styled.header`
  box-sizing: border-box;
  position: relative;
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh; /* dynamic viewport height for mobile browsers */
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: ${GRID.BREAKPOINT}) {
    align-items: center;
  }
`

/* Positioned so its left edge aligns with grid column 6 and it bleeds off-screen to the right */
const AsciiBackground = styled.div`
  position: absolute;
  bottom: 15vh;
  left: calc(
    ${GRID.PADDING}px
    + (100vw / ${GRID.COLUMNS}) * 5
    + ${GRID.GAP}px
  );
  right: 0;
  height: 80vh;
  pointer-events: none;
  z-index: 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    inset: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
`

const TitleBlock = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / 4;
  display: grid;
  /* Always 12 columns so the staggered offsets stay the same on mobile */
  grid-template-columns: repeat(${GRID.COLUMNS}, 1fr);
  column-gap: ${GRID.GAP}px;
  align-content: start;
  margin-bottom: 2rem;
  margin-top: -10rem;

  @media (max-width: ${GRID.BREAKPOINT}) {
    column-gap: 4px;
    margin-top: 0;
    margin-bottom: 2rem;
  }
`

/* Title cell — same column placement as desktop; optional $spanMobile for more width on mobile */
const TitleCell = styled.div`
  box-sizing: border-box;
  min-width: 0;
  white-space: nowrap;
  grid-column: ${({ $start, $span }) => `${$start} / span ${$span}`};

  @media (max-width: ${GRID.BREAKPOINT}) {
    grid-column: ${({ $start, $span, $spanMobile }) =>
      `${$start} / span ${$spanMobile ?? $span}`};
  }
`

const BodyBlock = styled.div`
  display: contents;
`

/* Wider intro text between 840px and 780px to avoid cramped line breaks */
const IntroCell = styled(GridCell)`
  @media (max-width: 840px) and (min-width: 781px) {
    grid-column: 4 / span 5;
  }
`

const IntroWrap = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  @media (max-width: ${GRID.BREAKPOINT}) {
    /* Align body text with "Raymond" (column 4) in TitleBlock’s 12-col grid */
    padding-left: calc(3 * (100% / 12) + 4px);
  }
`

const IntroWord = styled.span`
  display: inline-block;
  white-space: pre;
`

const INTRO_TEXT =
  'A philanthropic foundation supporting human creativity in the age of accelerating technology.'
const INTRO_WORDS = INTRO_TEXT.split(' ')

function Header({ loadingComplete }) {
  const introRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (!loadingComplete || !introRef.current || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    const words = introRef.current.querySelectorAll('.intro-word')
    if (!words.length) return

    gsap.fromTo(
      words,
      {
        y: 14,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.28,
        stagger: 0.022,
        ease: 'power2.out',
      }
    )
  }, [loadingComplete])

  return (
    <HeaderWrapper>
      <AsciiBackground>
        <AsciiVideo width="100%" height="100%" />
      </AsciiBackground>
      <Grid style={{ position: 'relative', zIndex: 1 }}>
        <TitleBlock>
          <TitleCell $start={3} $span={5} className="title-type" data-title-line="0">
            Jade
          </TitleCell>
          <TitleCell $start={4} $span={5} $spanMobile={7} className="title-type" data-title-line="1">
            Raymond
          </TitleCell>
          <TitleCell $start={2} $span={8} className="title-type" data-title-line="2">
            Foundation
          </TitleCell>
        </TitleBlock>
        <BodyBlock>
          <IntroCell $start={4} $span={3} $startMobile={1} $spanMobile={4}>
            <IntroWrap $visible={loadingComplete}>
              <p ref={introRef} className="body-type">
                {INTRO_WORDS.map((word, i) => (
                  <IntroWord key={i} className="intro-word">
                    {word}{i < INTRO_WORDS.length - 1 ? ' ' : ''}
                  </IntroWord>
                ))}
              </p>
            </IntroWrap>
          </IntroCell>
        </BodyBlock>
      </Grid>
    </HeaderWrapper>
  )
}

export default Header

import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { GRID } from '../grid'

const NAV_ITEMS = ['About', 'Focus Areas', 'Bursaries', 'Status']

/* ── Wrapper: full width, flex center, starts below viewport, animates up when loading ends ── */
const NavWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  transform: translateY(80px);
  z-index: 1000;

  @media (max-width: ${GRID.BREAKPOINT}) {
    bottom: 16px;
  }
`

/* ── Outer bar ── */
const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 10px;
  background: rgba(240, 240, 240, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(20px);

  @media (max-width: ${GRID.BREAKPOINT}) {
    gap: 2px;
    padding: 5px;
  }
`

/* ── Each nav link (font matches .body-type) ── */
const NavItem = styled.button`
  position: relative;
  z-index: 1;
  appearance: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 10px 15px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 350;
  font-size: 0.925rem;
  line-height: 1.1;
  color: ${({ $active }) => ($active ? 'var(--color-strong-text)' : 'var(--color-body)')};
  border-radius: 8px;
  white-space: nowrap;
  transition: color 0.25s ease;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 8px 14px;
    font-size: 1rem;
  }
`

/* ── Sliding indicator ── */
const Indicator = styled.span`
  position: absolute;
  top: 6px;
  left: 0;
  height: calc(100% - 12px);
  background: var(--color-strong-bg);
  border-radius: 8px;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.25s ease;
  pointer-events: none;
  z-index: 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    top: 5px;
    height: calc(100% - 10px);
  }
`

function Nav({ loadingComplete }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0, visible: false })
  const itemRefs = useRef([])
  const barRef = useRef(null)
  const wrapperRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (!loadingComplete || !wrapperRef.current || hasAnimatedRef.current) return
    hasAnimatedRef.current = true
    gsap.fromTo(
      wrapperRef.current,
      { y: 80 },
      { y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [loadingComplete])

  const updateIndicator = useCallback((index) => {
    if (index == null) {
      setIndicatorStyle((prev) => ({ ...prev, visible: false }))
      return
    }
    const item = itemRefs.current[index]
    const bar = barRef.current
    if (!item || !bar) return

    const barRect = bar.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    setIndicatorStyle({
      width: itemRect.width,
      x: itemRect.left - barRect.left,
      visible: true,
    })
  }, [])

  useEffect(() => {
    const onResize = () => updateIndicator(hoveredIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [hoveredIndex, updateIndicator])

  return (
    <NavWrapper ref={wrapperRef}>
    <NavBar ref={barRef}>
      <Indicator
        style={{
          width: indicatorStyle.width,
          transform: `translateX(${indicatorStyle.x}px)`,
          opacity: indicatorStyle.visible ? 1 : 0,
        }}
      />
      {NAV_ITEMS.map((label, i) => (
        <NavItem
          key={label}
          ref={(el) => { itemRefs.current[i] = el }}
          $active={i === hoveredIndex}
          onMouseEnter={() => {
            setHoveredIndex(i)
            updateIndicator(i)
          }}
          onMouseLeave={() => {
            setHoveredIndex(null)
            updateIndicator(null)
          }}
        >
          {label}
        </NavItem>
      ))}
    </NavBar>
    </NavWrapper>
  )
}

export default Nav

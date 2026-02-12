import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { GRID } from '../grid'

const NAV_ITEMS = ['About', 'Focus Areas', 'Bursaries', 'Status']

const SECTION_IDS = {
  'About': 'about-heading',
  'Focus Areas': 'focus-areas-heading',
  'Bursaries': 'bursaries-heading',
  'Status': 'status-heading',
}

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
    width: calc(100% - 20px);
    margin: 0 auto;
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
    padding: 6px 8px;
    font-size: 0.8rem;
    border-radius: 4px;
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

const SECTION_IDS_LIST = NAV_ITEMS.map((label) => SECTION_IDS[label])
const UPDATES_HEADING_ID = 'updates-form-heading'

function Nav({ loadingComplete }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0, visible: false })
  const itemRefs = useRef([])
  const barRef = useRef(null)
  const wrapperRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  const effectiveIndex = hoveredIndex !== null ? hoveredIndex : activeIndex ?? null

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

  const scrollToSection = useCallback((label) => {
    const id = SECTION_IDS[label]
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    // Reference line: section containing this viewport Y is "active" (works both scroll directions)
    const refY = 0.3 * window.innerHeight

    const computeActive = () => {
      const tops = SECTION_IDS_LIST.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top : Infinity
      })
      const updatesEl = document.getElementById(UPDATES_HEADING_ID)
      const updatesTop = updatesEl ? updatesEl.getBoundingClientRect().top : Infinity

      if (tops[0] === Infinity) return

      if (refY < tops[0]) {
        setActiveIndex(null)
        return
      }
      if (refY >= updatesTop) {
        setActiveIndex(null)
        return
      }

      for (let i = 0; i < SECTION_IDS_LIST.length; i++) {
        const sectionBottom = i < SECTION_IDS_LIST.length - 1 ? tops[i + 1] : updatesTop
        if (refY >= tops[i] && refY < sectionBottom) {
          setActiveIndex(i)
          return
        }
      }
    }

    const observer = new IntersectionObserver(
      () => computeActive(),
      { rootMargin: '0px', threshold: 0 }
    )
    SECTION_IDS_LIST.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    const updatesEl = document.getElementById(UPDATES_HEADING_ID)
    if (updatesEl) observer.observe(updatesEl)

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        computeActive()
        ticking = false
      })
    }

    computeActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', computeActive)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeActive)
    }
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => updateIndicator(effectiveIndex))
    return () => cancelAnimationFrame(id)
  }, [effectiveIndex, updateIndicator])

  useEffect(() => {
    const onResize = () => updateIndicator(effectiveIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [effectiveIndex, updateIndicator])

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
          $active={i === effectiveIndex}
          onClick={() => scrollToSection(label)}
          onMouseEnter={() => {
            setHoveredIndex(i)
            updateIndicator(i)
          }}
          onMouseLeave={() => {
            setHoveredIndex(null)
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

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { GRID } from '../grid/config.js'

const GridContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`

const GridInner = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: min(${GRID.MAX_WIDTH}px, 100%);
  height: 100%;
  margin: 0 auto;
  display: ${props => props.$isVisible ? 'grid' : 'none'};
  grid-template-columns: repeat(${GRID.COLUMNS}, 1fr);
  gap: ${GRID.GAP}px;
  padding: 0 ${GRID.PADDING}px;
  overflow: hidden;

  @media (max-width: ${GRID.BREAKPOINT}) {
    grid-template-columns: repeat(${GRID.COLUMNS_MOBILE}, 1fr);
    padding: 0 ${GRID.PADDING_MOBILE}px;
    gap: ${GRID.GAP_MOBILE};
  }
`

const GridColumn = styled.div`
  box-sizing: border-box;
  min-width: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
`

function GridOverlay() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'g' || e.key === 'G') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <GridContainer>
      <GridInner $isVisible={isVisible}>
        {Array.from({ length: GRID.COLUMNS }).map((_, index) => (
          <GridColumn key={index} />
        ))}
      </GridInner>
    </GridContainer>
  )
}

export default GridOverlay

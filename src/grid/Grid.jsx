import styled from 'styled-components'
import { GRID } from './config.js'

/**
 * Grid container - uses the shared grid configuration
 * Creates a 12-column grid (4 on mobile) that matches the GridOverlay
 */
export const Grid = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(${GRID.COLUMNS}, 1fr);
  column-gap: ${GRID.GAP}px;
  row-gap: ${GRID.ROW_GAP};
  width: 100%;
  max-width: min(${GRID.MAX_WIDTH}px, 100%);
  margin: 0 auto;
  padding: 0 ${GRID.PADDING}px;
  overflow-wrap: break-word;

  @media (max-width: ${GRID.BREAKPOINT}) {
    grid-template-columns: repeat(${GRID.COLUMNS_MOBILE}, 1fr);
    padding: 0 ${GRID.PADDING_MOBILE}px;
    column-gap: ${GRID.GAP_MOBILE};
    row-gap: ${GRID.ROW_GAP_MOBILE};
  }
`

/**
 * GridCell - a grid child that can be positioned and sized
 * 
 * Props:
 *   start: column start (1-based), default 1
 *   span: number of columns to span, default full width
 *   end: column end (alternative to span)
 *   startMobile: column start on mobile (optional)
 *   spanMobile: span on mobile (optional, defaults to full width)
 * 
 * Examples:
 *   <GridCell start={1} span={8}>...</GridCell>   // columns 1-8
 *   <GridCell start={9} span={4}>...</GridCell>   // columns 9-12
 *   <GridCell start={1} end={9}>...</GridCell>    // columns 1-8 (end is exclusive)
 */
export const GridCell = styled.div`
  box-sizing: border-box;
  min-width: 0;
  grid-column: ${props => {
    const start = props.$start || 1
    if (props.$end) {
      return `${start} / ${props.$end}`
    }
    const span = props.$span || GRID.COLUMNS
    return `${start} / span ${span}`
  }};

  @media (max-width: ${GRID.BREAKPOINT}) {
    grid-column: ${props => {
      if (props.$startMobile || props.$spanMobile) {
        const start = props.$startMobile || 1
        const span = props.$spanMobile || GRID.COLUMNS_MOBILE
        return `${start} / span ${span}`
      }
      // Default to full width on mobile
      return '1 / -1'
    }};
  }
`

// Re-export config for convenience
export { GRID } from './config.js'

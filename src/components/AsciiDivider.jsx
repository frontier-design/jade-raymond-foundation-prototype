import styled from 'styled-components'
import { Grid, GridCell, GRID } from '../grid'

// Symbol pool — a random one is picked for each dot
const SYMBOLS = ['.']
const SQ_SIZE = 2  // dots per square side
const SQ_GAP = 1    // space chars between squares
const ROWS = 1      // how many square-rows tall

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}

function buildRow(squaresAcross) {
  const lines = []

  for (let sr = 0; sr < ROWS; sr++) {
    for (let line = 0; line < SQ_SIZE; line++) {
      let row = ''
      for (let sq = 0; sq < squaresAcross; sq++) {
        if (sq > 0) row += ' '.repeat(SQ_GAP)
        for (let d = 0; d < SQ_SIZE; d++) {
          row += d > 0 ? ' ' + randomSymbol() : randomSymbol()
        }
      }
      lines.push(row)
    }
    if (sr < ROWS - 1) {
      lines.push('')
    }
  }

  return lines.join('\n')
}

// Pre-generate once at module load (randomised each page load)
const pattern = buildRow(80)

const Wrapper = styled.div`
  padding: 2.5rem 0;
  overflow: hidden;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 1.5rem 0;
  }
`

const Pattern = styled.pre`
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  color: #a1a1a1;
  user-select: none;
  overflow: hidden;
`

function AsciiDivider({ className, style }) {
  return (
    <Wrapper className={className} style={style} aria-hidden="true">
      <Grid>
        <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
          <Pattern>{pattern}</Pattern>
        </GridCell>
      </Grid>
    </Wrapper>
  )
}

export default AsciiDivider

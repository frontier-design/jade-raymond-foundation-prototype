import styled from 'styled-components'
import { Grid, GridCell, GRID } from '../grid'

const FooterSection = styled.footer`
  padding: 3rem 0 2rem;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding: 2rem 0 1.5rem;
  }
`

const FooterText = styled.div`
  text-align: right;
  font-size: 0.9rem;
`

function Footer() {
  return (
    <FooterSection role="contentinfo">
      <Grid>
        <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
          <FooterText className="body-type">
            © Jade Raymond Foundation
            <br />
            Montréal, Canada
          </FooterText>
        </GridCell>
      </Grid>
    </FooterSection>
  )
}

export default Footer

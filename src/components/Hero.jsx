import styled from 'styled-components'

const HeroContainer = styled.section`
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 50px 0px 225px 50px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.6s ease-in-out;
  transition-delay: ${props => props.$delay}s;

  @media (max-width: 768px) {
    padding: 30px 20px 80px 20px;
    gap: 1rem;
  }
`

const HeroContent = styled.div`
  grid-column: 1 / 4;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
`

const Subtitle = styled.p``

function Hero(props) {
  return (
    <HeroContainer $isLoaded={props.isLoaded} $delay={props.delay}>
      <HeroContent>
        <Title>Jade Raymond Foundation</Title>
        <Subtitle>A philanthropic foundation supporting human creativity in the age of accelerating technology.</Subtitle>
      </HeroContent>
    </HeroContainer>
  )
}

export default Hero

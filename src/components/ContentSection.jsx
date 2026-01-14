import styled from 'styled-components'

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 0 50px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 30px;
  margin-bottom: 100px;


  @media (max-width: 768px) {
    padding: 0 20px;
    gap: 1rem;
  }

  @media (min-width: 1200px) {
    gap: 50px;
  }
`

const LeftColumn = styled.div`
  grid-column: 1 / 9;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.6s ease-in-out;
  transition-delay: ${props => props.$delay}s;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }

  p {
    font-size: 45px;
    line-height: 1.25;
    /* padding-bottom: 100px; */

    @media (max-width: 768px) {
      font-size: 30px;
      padding-bottom: 100px;
    }

    @media (min-width: 1500px) {
      font-size: 50px;
      word-spacing: -0.05rem;
    }
  }
`

const RightColumn = styled.div`
  grid-column: 9 / 13;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-self: end;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.6s ease-in-out;
  transition-delay: ${props => props.$delay}s;

  @media (min-width: 1200px) {
    /* padding-top: 25vh; */
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`

const Subsection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Subheading = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
`

const List = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ListItem = styled.li`
  font-size: 16px;
  line-height: 1.4;
`

const StyledLink = styled.a`
  color: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Input = styled.input`
  font-size: 16px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0;
  background: transparent;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

const Textarea = styled.textarea`
  font-size: 16px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0;
  background: transparent;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

function ContentSection(props) {
  return (
    <SectionContainer>
      <LeftColumn $isLoaded={props.isLeftLoaded} $delay={props.leftDelay}>
        <p>
          In an era of accelerated technological change and algorithmically mediated culture, human creativity remains the essential catalyst for scientific discovery, cultural progress, and meaningful innovation. The Jade Raymond Foundation exists to ensure that emerging technologies amplify rather than diminish our creative and imaginative capacities. Through support for learning, exploration, and invention, the Foundation advances models that cultivate originality, critical thinking, and the ability to imagine better futures. With a particular focus on young thinkers and emerging innovators, we work to safeguard and elevate human creativity as a vital force alongside technology in shaping conditions for a thriving society.
        </p>
      </LeftColumn>
      <RightColumn $isLoaded={props.isRightLoaded} $delay={props.rightDelay}>
        <Subsection>
          <Subheading>Focus Areas:</Subheading>
          <List>
            <ListItem>
              <strong>Creativity & Imagination</strong> Advancing creative capacity as a foundational human skill across art, science, and technology.
            </ListItem>
            <ListItem>
              <strong>Learning & Exploration</strong> Supporting models of education and inquiry that prioritize originality, critical thinking, and experimentation.
            </ListItem>
            <ListItem>
              <strong>Emerging Innovators</strong> Developing young thinkers and builders whose ideas shape future cultural and scientific landscapes.
            </ListItem>
          </List>
        </Subsection>

        <Subsection>
          <Subheading>Current Bursaries</Subheading>
          <List>
            <ListItem>
              St. George's School Bursary, highlighting the school's emphasis on creative thinking and self-expression. (<StyledLink href="#">Link</StyledLink>)
            </ListItem>
            <ListItem>
              McGill Women in Computer Science Scholarship, supporting women entering technical fields. (<StyledLink href="#">Video Link</StyledLink>)
            </ListItem>
            <ListItem>
              Selwyn House Scholarship, supporting boys' education in parallel with other youth-focused initiatives. (<StyledLink href="#">Link to financial aid page</StyledLink>)
            </ListItem>
          </List>
        </Subsection>

        <Subsection>
          <Subheading>Current Status</Subheading>
          <p>
            The Jade Raymond Foundation is in its early stages of development. Information about programs, partnerships, and initiatives will be shared as they are formally launched. Full webstie coming Fall 2026.
          </p>
        </Subsection>
      </RightColumn>
    </SectionContainer>
  )
}

export default ContentSection

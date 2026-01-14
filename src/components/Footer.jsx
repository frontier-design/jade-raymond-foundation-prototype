import { useState } from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 0 50px;
  padding-bottom: 2rem;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 30px;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.6s ease-in-out;
  transition-delay: ${props => props.$delay}s;

  @media (max-width: 768px) {
    padding: 0 20px;
    padding-bottom: 2rem;
    gap: 1rem;
  }
`

const FooterText = styled.div`
  grid-column: 5 / 13;
  text-align: right;
  font-size: 16px;
  line-height: 1.4;
  align-self: end;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    text-align: left;
  }
`

const Subsection = styled.div`
  grid-column: 1 / 5;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`

const Subheading = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
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
    border-color: #049878;
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
    border-color: #049878;
  }
`

const SubmitButton = styled.button`
  font-size: 16px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 0.5rem 1rem;
  border: 1px solid #049878;
  border-radius: 0;
  background: transparent;
  color: #049878;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background-color: #049878;
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Message = styled.p`
  font-size: 14px;
  margin: 0;
  color: #049878;
`

function Footer(props) {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '5894b008-7540-40f5-89b7-950718aa5112',
          email: email,
          reason: reason,
          subject: 'Jade Raymond Foundation - Update Request'
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage('Thank you! Your submission has been received.')
        setEmail('')
        setReason('')
      } else {
        setMessage('There was an error. Please try again.')
      }
    } catch {
      setMessage('There was an error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FooterContainer $isLoaded={props.isLoaded} $delay={props.delay}>
      <Subsection>
        <Subheading>For updates</Subheading>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input 
              type="email" 
              placeholder="Enter email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Textarea 
              placeholder="Reason for interest in the Jade Raymond Foundation" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </FormGroup>
          <SubmitButton 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </SubmitButton>
          {message && <Message>{message}</Message>}
        </Form>
      </Subsection>

      <FooterText>
        © Jade Raymond Foundation
        <br />
        Montréal, Canada
      </FooterText>
    </FooterContainer>
  )
}

export default Footer

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Header from './components/Header.jsx'
import About from './components/About.jsx'
import FocusAreas from './components/FocusAreas.jsx'
import Bursaries from './components/Bursaries.jsx'
import Status from './components/Status.jsx'
import UpdatesForm from './components/UpdatesForm.jsx'
import Footer from './components/Footer.jsx'
import AsciiVideo from './components/AsciiVideo.jsx'
// import AsciiDivider from './components/AsciiDivider.jsx'
import Nav from './components/Nav.jsx'
import { GRID } from './grid/config.js'

const Main = styled.main`
  padding-bottom: 100px;

  @media (max-width: ${GRID.BREAKPOINT}) {
    padding-bottom: 80px;
  }
`

const FooterAsciiWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20vh;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, #ffffffbc, transparent);
    pointer-events: none;
  }
`

function App() {
  const [loading, setLoading] = useState(true)

  // Start at top on every load/refresh and lock scroll until loading is done
  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <>
      <GlobalStyle $loading={loading} />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <GridOverlay />
      <Main>
        <Header loadingComplete={!loading} />
        <About />
        <FocusAreas />
        <Bursaries />
        <Status />
        <UpdatesForm />
        <Footer />
        <FooterAsciiWrapper>
          <AsciiVideo width="100%" height="100%" />
        </FooterAsciiWrapper>
      </Main>
      <Nav loadingComplete={!loading} />
    </>
  )
}

export default App

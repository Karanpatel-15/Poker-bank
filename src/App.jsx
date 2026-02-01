import PokerBank from './components/PokerBank'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <PokerBank />
    </ErrorBoundary>
  )
}

export default App


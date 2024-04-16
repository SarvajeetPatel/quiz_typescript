import Analysis from './components/Analysis'
import QuizForm from './components/QuizForm'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<QuizForm />} />
      <Route path='/analysis' element={<Analysis />} />
    </Routes>
  )
}

export default App
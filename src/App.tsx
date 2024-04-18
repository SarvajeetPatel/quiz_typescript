import AllResults from './components/AllResults'
import Analysis from './components/Analysis'
import QuizForm from './components/QuizForm'
import { Routes, Route } from 'react-router-dom'
import AddData from './helpers/AddData'

function App() {
  return (
    <Routes>
      <Route path='/' element={<QuizForm />} />
      <Route path='/analysis' element={<Analysis />} />
      <Route path='/allResults' element={<AllResults />} />
      <Route path='/add-dummy-data' element={<AddData />} />
    </Routes>
  )
}

export default App
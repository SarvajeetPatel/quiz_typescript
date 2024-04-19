import AllResults from './components/AllResults'
import Analysis from './components/Analysis'
import QuizForm from './components/QuizForm'
import { Routes, Route } from 'react-router-dom'
import AddData from './helpers/AddData'
import ResultDataTable from './components/ResultDataTable'

function App() {
  return (
    <Routes>
      <Route path='/' element={<QuizForm />} />
      <Route path='/analysis' element={<Analysis />} />
      <Route path='/allResults' element={<AllResults />} />
      <Route path='/newResults' element={<ResultDataTable />} />
      <Route path='/add-dummy-data' element={<AddData />} />
    </Routes>
  )
}

export default App
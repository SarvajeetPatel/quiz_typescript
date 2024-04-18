import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import quiz from './QuizQues';
import { useNavigate } from 'react-router-dom';
import PaginationCompo from './PaginationCompo';
import NoteContext from '../context/NoteContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 700,
    maxWidth: '80vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 4,
    overflowY: 'auto'
}

function AllResults() {
    const storedValue = JSON.parse(localStorage.getItem('all results')) || []
    const { page, rowsPerPage } = useContext(NoteContext)
    const [open, setOpen] = useState(false)
    const [userIndex, setUserIndex] = useState(0)
    const navigate = useNavigate()
    const handleOpen = (index) => {
        setOpen(true)
        setUserIndex(index)
    }

    const handleClick = () => {
        localStorage.removeItem('currentData')
        navigate('/')
    }
    return (
        <div className="resultsDiv">
            <div>
                <h2> Here's a list of stiudent's details with their Name and Date of Test! </h2>
                <h4> You can view individual test report by clicking on View Button! </h4>
                <table className="tableDiv">
                    <tr>
                        <th>Name</th>
                        <th>Test Date</th>
                        <th> </th>
                    </tr>
                    {storedValue.map((val, key) => {
                        return (key >= page * rowsPerPage && key < (page * rowsPerPage) + rowsPerPage) &&
                            (
                                <tr key={key}>
                                    <td>{val.name}</td>
                                    <td>{val.testDate}</td>
                                    <td>
                                        <div>
                                            <Button onClick={() => handleOpen(key)}> DETAILED RESULT </Button>
                                            <Modal
                                                open={open}
                                                onClose={() => setOpen(false)}
                                            >
                                                <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        {storedValue[userIndex].name}
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        {quiz.map((item, i) => (
                                                            storedValue[userIndex].answers.filter((quizQue) => i + 1 === Number(quizQue.que)).length > 0) ?
                                                            storedValue[userIndex].answers.filter((quizer) => Number(quizer.que) === i + 1).map((quizItem) =>
                                                                <div className='mainForm'>
                                                                    <h4>{i + 1} {item?.question} </h4>
                                                                    {item.options.map((opt) => (
                                                                        <>
                                                                            {(quizItem.ans === item.correctAnswer && 'A' === item.correctAnswer) ?
                                                                                <div className='correctAnswer'> {opt.A} </div> :
                                                                                (quizItem.ans === 'A' && quizItem.ans !== item.correctAnswer) ?
                                                                                    <div className='wrongAnswer' > {opt.A} </div> :
                                                                                    ('A' === item.correctAnswer && quizItem.ans !== item.correctAnswer) ?
                                                                                        <div className='correctAnswer' > {opt.A} </div> : <div> {opt.A} </div >
                                                                            }
                                                                            {(quizItem.ans === item.correctAnswer && 'B' === item.correctAnswer) ?
                                                                                <div className='correctAnswer' > {opt.B} </div> :
                                                                                ('B' === quizItem.ans && quizItem.ans !== item.correctAnswer) ?
                                                                                    <div className='wrongAnswer' > {opt.B} </div> :
                                                                                    ('B' === item.correctAnswer && quizItem.ans !== item.correctAnswer) ?
                                                                                        <div className='correctAnswer' > {opt.B} </div> : <div> {opt.B} </div >
                                                                            }
                                                                            {(quizItem.ans === item.correctAnswer && 'C' === item.correctAnswer) ?
                                                                                <div className='correctAnswer' > {opt.C} </div> :
                                                                                ('C' === quizItem.ans && quizItem.ans !== item.correctAnswer) ?
                                                                                    <div className='wrongAnswer' > {opt.C} </div> :
                                                                                    ('C' === item.correctAnswer && quizItem.ans !== item.correctAnswer) ?
                                                                                        <div className='correctAnswer' > {opt.C} </div> : <div> {opt.C} </div >
                                                                            }
                                                                            {(quizItem.ans === item.correctAnswer && 'D' === item.correctAnswer) ?
                                                                                <div className='correctAnswer' > {opt.D} </div> :
                                                                                ('D' === quizItem.ans && quizItem.ans !== item.correctAnswer) ?
                                                                                    <div className='wrongAnswer' > {opt.D} </div> :
                                                                                    ('D' === item.correctAnswer && quizItem.ans !== item.correctAnswer) ?
                                                                                        <div className='correctAnswer' > {opt.D} </div> : <div> {opt.D} </div >
                                                                            }
                                                                        </>
                                                                    ))}
                                                                </div >) :
                                                            <div className='mainForm' >
                                                                <h4>{i + 1} {item?.question} </h4>
                                                                {
                                                                    item.options.map((opt) =>
                                                                        <>
                                                                            <div className={item.correctAnswer === 'A' ? 'leftOut' : ''} > {opt.A} </div>
                                                                            < div className={item.correctAnswer === 'B' ? 'leftOut' : ''} > {opt.B} </div>
                                                                            < div className={item.correctAnswer === 'C' ? 'leftOut' : ''} > {opt.C} </div>
                                                                            < div className={item.correctAnswer === 'D' ? 'leftOut' : ''} > {opt.D} </div>
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                        </div>
                                    </td>
                                </tr>
                            )
                    })}
                </table>
                <br />
                <PaginationCompo />
                <br />
                <div className='switchButtons'>
                    <button className='button-86' onClick={() => handleClick()}> GIVE TEST </button>
                    <button className='button-86' onClick={() => navigate('/analysis')}> GO TO ANALYSIS </button>
                </div>
            </div>
        </div>
    );
}

export default AllResults;

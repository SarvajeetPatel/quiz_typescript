import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import quiz from './QuizQues';
import DummyData from '../helpers/DummyData';

const ResultDataTable = () => {
    const storedValue = JSON.parse(localStorage.getItem('all results')) || []
    const [pending, setPending] = useState(true)
    const [open, setOpen] = useState(false)
    const [userIndex, setUserIndex] = useState(0)
    const [rows, setRows] = useState([])
    const handleOpen = (index) => {
        setOpen(true)
        setUserIndex(index)
    }

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

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            reorder: true
        },
        {
            name: 'Date of Test',
            selector: row => row.testDate,
            sortable: true,
            reorder: true,
            right: true
        },
        {
            name: 'View',
            sortable: true,
            cell: row => (
                <div key={`variantlist2-${row.id}`}  >
                    <Button onClick={() => handleOpen(row.id)}> DETAILED RESULT </Button>
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
                </div>)
        }
    ]

    // const data = [
    //     {
    //         id: 1,
    //         title: 'Beetlejuice',
    //         year: '1988',
    //     },
    //     {
    //         id: 2,
    //         title: 'Ghostbusters',
    //         year: '1984',
    //     },
    //     {
    //         id: 3,
    //         title: 'Apple',
    //         year: '1981',
    //     },
    //     {
    //         id: 4,
    //         title: 'Banana',
    //         year: '1784',
    //     },
    //     {
    //         id: 5,
    //         title: 'Grapes',
    //         year: '1900',
    //     },
    //     {
    //         id: 6,
    //         title: 'Guava',
    //         year: '2003',
    //     },
    //     {
    //         id: 7,
    //         title: 'Orange',
    //         year: '2024',
    //     },
    //     {
    //         id: 8,
    //         title: 'Berries',
    //         year: '2009',
    //     },
    //     {
    //         id: 9,
    //         title: 'Kiwi',
    //         year: '2014',
    //     },
    //     {
    //         id: 10,
    //         title: 'Subway',
    //         year: '1994',
    //     },
    //     {
    //         id: 11,
    //         title: 'Beetroot',
    //         year: '1917',
    //     },
    //     {
    //         id: 12,
    //         title: 'Mango',
    //         year: '1600',
    //     },
    //     {
    //         id: 13,
    //         title: 'Strawberries',
    //         year: '1975',
    //     },
    //     {
    //         id: 14,
    //         title: 'Chiku',
    //         year: '1962',
    //     },
    //     {
    //         id: 15,
    //         title: 'wine',
    //         year: '1912',
    //     },
    //     {
    //         id: 16,
    //         title: 'tree',
    //         year: '1884',
    //     },
    //     {
    //         id: 17,
    //         title: 'vampire',
    //         year: '2018',
    //     },
    //     {
    //         id: 18,
    //         title: 'shake',
    //         year: '1906',
    //     },
    //     {
    //         id: 19,
    //         title: 'dinosaur',
    //         year: '1945',
    //     },
    //     {
    //         id: 20,
    //         title: 'doll',
    //         year: '1999',
    //     },
    //     {
    //         id: 21,
    //         title: 'book',
    //         year: '1978',
    //     },
    //     {
    //         id: 22,
    //         title: 'goat',
    //         year: '1934',
    //     },
    // ]

    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: "ALL"
    }

    const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }`;

    const Spinner = styled.div`
	margin: 16px;
	animation: ${rotate360} 1s linear infinite;
	transform: translateZ(0);
	border-top: 2px solid grey;
	border-right: 2px solid grey;
	border-bottom: 2px solid grey;
	border-left: 4px solid black;
	background: transparent;
	width: 80px;
	height: 80px;
	border-radius: 50%`;

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Spinner />
        </div>
    )

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(DummyData);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <DataTable
            title="Results"
            columns={columns}
            data={rows}
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ inkDisabled: true }}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            sortIcon={<ArrowDownward />}
            progressPending={pending}
            progressComponent={<CustomLoader />}
        />
    )
}

export default ResultDataTable;
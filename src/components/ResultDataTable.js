import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { useCallback, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import quiz from './QuizQues';
import differenceBy from 'lodash/differenceBy'

const ResultDataTable = () => {
    const storedValue = JSON.parse(localStorage.getItem('all results')) || []
    const [open, setOpen] = useState(false)
    const [userIndex, setUserIndex] = useState(0)
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(storedValue);

    const handleOpen = (index) => {
        const tempIndex = storedValue.findIndex(item => item.name === index)
        setOpen(true)
        setUserIndex(tempIndex)
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
                <div key={`variantlist2-${row.idx}`}  >
                    <Button onClick={() => handleOpen(row.name)}> DETAILED RESULT </Button>
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

    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: "ALL"
    }

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const contextActions = useMemo(() => {
        const handleDelete = () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared)
                setData(differenceBy(data, selectedRows, 'name'));
            }
        };
        return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon> Delete </Button>;
    }, [data, selectedRows, toggleCleared])

    return (
        <DataTable
            title="Results"
            columns={columns}
            data={data}
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ inkDisabled: true }}
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            sortIcon={<ArrowDownward />}
        />
    )
}

export default ResultDataTable;
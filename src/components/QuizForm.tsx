import { useEffect, useState } from 'react'
import { Typography, Button, Box, ButtonProps } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import QuizQues from '../components/QuizQues'
import { styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import Result from '../components/Result'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

type formikValues = {
    name?: string,
    step?: number,
    answers?: [],
    validUser?: boolean,
    score?: number,
    testDate?: string
}

export default function QuizForm(props: formikValues) {
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState(QuizQues.length * 30);
    // eslint-disable-next-line
    const [mins, setMins] = useState(0);
    // eslint-disable-next-line
    const [seconds, setSeconds] = useState(0);
    const [timePerPage, setTimerPerPage] = useState(30)

    const { values, handleChange, setFieldValue } = useFormik({
        initialValues: {
            name: props.name || '',
            step: props.step || 0,
            answers: props.answers || [],
            validUser: props.validUser || false,
            score: props.score || 0,
            testDate: props.testDate || new Date()
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    useEffect(() => {
        const storedData: any = Cookies.get('currentData');
        if (storedData) {
            const parsedData = JSON.parse(storedData)
            setFieldValue('validUser', parsedData.validUser || false)
            setFieldValue('step', parsedData.step || 0)
            setFieldValue('score', parsedData.score || 0)
            setFieldValue('name', parsedData.name || '')
            setFieldValue('answers', parsedData.answers || [])
            setFieldValue('testDate', parsedData.testDate || new Date())
            setTimeLeft(parseInt(parsedData.time, 10))
            setTimerPerPage(parseInt(parsedData.timePerPage, 10))
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(intervalId);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft])

    useEffect(() => {
        const newInterval = setInterval(() => {
            setTimerPerPage(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(newInterval);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(newInterval);
    }, [timePerPage])

    useEffect(() => {
        if (values.validUser) {
            if (timeLeft > 60) {
                setMins(Math.floor(timeLeft / 60));
                setSeconds(timeLeft % 60);
            } else {
                setMins(0);
                setSeconds(timeLeft);
            }
            if (timeLeft === 0) {
                setFieldValue('step', QuizQues.length)
            }
            const tempData: any = { name: values.name, testDate: values.testDate.toLocaleString().split(',', 1)[0], score: values.score, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft.toString(), answers: values.answers }
            Cookies.set('currentData', JSON.stringify(tempData))
        }
        // eslint-disable-next-line
    }, [timeLeft])

    useEffect(() => {
        if (values.validUser) {
            if (timePerPage === 0 && values.step <= QuizQues.length - 1) {
                handleNext()
                setTimerPerPage(30)
            } else if (values.step === QuizQues.length) {
                setTimerPerPage(0)
            }
            const tempData: any = { name: values.name, testDate: values.testDate.toLocaleString().split(',', 1)[0], score: values.score, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft.toString(), answers: values.answers }
            Cookies.set('currentData', JSON.stringify(tempData))
        }
        // eslint-disable-next-line
    }, [timePerPage])

    const handleNext = () => {
        const tempData: any = { name: values.name, testDate: values.testDate.toLocaleString().split(',', 1)[0], score: values.score, timePerPage: timePerPage, validUser: values.validUser, step: values.step + 1, time: timeLeft, answers: values.answers }
        Cookies.set('currentData', JSON.stringify(tempData))

        if (values.step < QuizQues.length - 1) {
            setTimerPerPage(30)
            setFieldValue('step', values.step + 1)
        } else if ((values.step + 1) === QuizQues.length) {
            const existingData = localStorage.getItem('all results')
            const tempArr = existingData ? JSON.parse(existingData) : []
            tempArr.push(tempData)
            localStorage.setItem('all results', JSON.stringify(tempArr))
            setFieldValue('step', values.step + 1)
            setMins(0)
            setSeconds(0)
            setTimeLeft(0)
            setTimerPerPage(0)
        }
    };

    const handleReset = () => {
        Cookies.remove('currentData')
        setFieldValue('name', '')
        setFieldValue('answers', [])
        setFieldValue('step', 0)
        setFieldValue('score', 0)
        setFieldValue('validUser', false)
    }

    const handleChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedAnswers: any = [...values.answers];
        const index = updatedAnswers.findIndex((ans: any) => ans.que === name);
        if (index !== -1) {
            updatedAnswers[index].ans = value;
        } else {
            updatedAnswers.push({ que: name, ans: value });
        }
        const tempData: any = { name: values.name, testDate: values.testDate.toLocaleString().split(',', 1)[0], score: values.score, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft, answers: updatedAnswers }
        Cookies.set('currentData', JSON.stringify(tempData));
        setFieldValue('answers', updatedAnswers)
    };

    const handleTabs = (i: number) => {
        if (i > values.step) {
            setFieldValue('step', i)
            setTimerPerPage(30)
        } else if (values.step === QuizQues.length) {
            alert('You cannot go to previous page after submitting the test!')
        } else {
            alert('Questions Skipped!')
        }
    }

    const handleName = () => {
        const storedName = localStorage.getItem('all results')
        if (storedName) {
            const parsedValue = JSON.parse(storedName)
            if (parsedValue.filter((item: any) => item.name === values.name).length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "USER HAS ALREADY APPEARED THE EXAM!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User registered successfully!",
                    showConfirmButton: false,
                    timer: 800
                })
                setFieldValue('validUser', true)
                setFieldValue('step', 0)
                setTimerPerPage(31)
                setTimeLeft(QuizQues.length * 30)
            }
        }
    }

    const handleAnalysis = () => {
        navigate('/analysis')
    }

    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
        color: theme.palette.getContrastText(blueGrey[50]),
        backgroundColor: blueGrey[50],
        '&:hover': {
            backgroundColor: blueGrey[700],
        },
    }));

    return (
        <Box sx={{ width: '100%' }}>
            <form>
                {
                    values.validUser || values.step > 0 ?
                        <>
                            <div className="background-image">
                                {
                                    values.step === QuizQues.length ? (
                                        <>
                                            <div className='transparent-div'>
                                                <Typography sx={{ mt: 2, mb: 1 }}>
                                                    <Result />
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
                                                    <div className='spacebuttons'>
                                                        <ColorButton onClick={handleAnalysis}> Go to Analysis </ColorButton>
                                                        <ColorButton onClick={handleReset}>Reset</ColorButton>
                                                    </div>
                                                </Box>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='transparent-new-div'>
                                                <h2> Welcome {values.name}! </h2>
                                                {/* <h3> TOTAL TEST TIME {(mins > 9) ? mins : `0${mins}`} : {(seconds > 9) ? (seconds !== 60 && seconds) : `0${seconds}`} ! </h3> */}
                                                <h3> TIME TO SOLVE THE QUE : {(timePerPage > 9) ? (timePerPage) : `0${timePerPage}`} seconds </h3>
                                                <div className='stepsLabel'>
                                                    {QuizQues.map((ques, index) => (
                                                        < div className='labelButtons'>
                                                            <button type='button' className={values.step === index ? `button-27` : 'regularButton'} onClick={() => handleTabs(index)}> {index + 1} </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                {QuizQues.map((ques, index) => (
                                                    index === values.step &&
                                                    <div className='mainForm' key={index}> {ques.question}
                                                        <div className='quest'>
                                                            {ques.options.map((queOption, i) => (
                                                                <div key={i} className='superDiv'>
                                                                    <br />
                                                                    {queOption.A !== undefined &&
                                                                        <label>
                                                                            <input type='radio' name={`${index + 1}`} value='A' onChange={(e) => handleChoice(e)} defaultChecked={values?.answers?.filter((item: any) => ((Number(item?.que) === index + 1) && (item?.ans === 'A'))).length > 0} />
                                                                            {queOption?.A} </label>
                                                                    }
                                                                    {queOption.B !== undefined &&
                                                                        <label>
                                                                            <input type='radio' name={`${index + 1}`} value='B' onChange={(e) => handleChoice(e)} defaultChecked={values?.answers?.filter((item: any) => ((Number(item?.que) === index + 1) && (item?.ans === 'B'))).length > 0} />
                                                                            {queOption?.B} </label>}
                                                                    {queOption.C !== undefined &&
                                                                        <label>
                                                                            <input type='radio' name={`${index + 1}`} value='C' onChange={(e) => handleChoice(e)} defaultChecked={values?.answers?.filter((item: any) => ((Number(item?.que) === index + 1) && (item?.ans === 'C'))).length > 0} />
                                                                            {queOption?.C} </label>}
                                                                    {queOption.D !== undefined &&
                                                                        <label>
                                                                            <input type='radio' name={`${index + 1}`} value='D' onChange={(e) => handleChoice(e)} defaultChecked={values?.answers?.filter((item: any) => ((Number(item?.que) === index + 1) && (item?.ans === 'D'))).length > 0} />
                                                                            {queOption?.D} </label>
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <br />
                                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                    <ColorButton size="medium" variant="outlined" endIcon={<SendIcon />} onClick={handleNext} disabled={values.answers.filter((check: any) => Number(check.que) === Number(values.step + 1)).length === 0}>
                                                        {values.step === QuizQues.length - 1 ? 'FINISH' : 'NEXT'}
                                                    </ColorButton>
                                                </Box>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </>
                        :
                        <div className='background-image'>
                            <div className='transparent-div'>
                                <label className='transparent-input'> ENTER YOUR USERNAME :</label>
                                <input type='text' className='transparent-field' name='name' value={values.name} onChange={handleChange} />
                                <br /><br />
                                <button className='button-86' type='button' onClick={() => { handleName() }}> NEXT </button>
                            </div>
                        </div>
                }
            </form>
        </Box >
    );
}
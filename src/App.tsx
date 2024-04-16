import { useEffect, useState } from 'react'
import { Typography, Button, Box } from '@mui/material'
import QuizQues from './components/QuizQues'
import { KeyboardArrowRight } from '@mui/icons-material'
import Result from './components/Result'
import { useFormik } from 'formik'

type formikValues = {
  name?: string,
  step?: number,
  answers?: [],
  validUser?: boolean,
}

export default function App(props: formikValues) {
  const [timeLeft, setTimeLeft] = useState(QuizQues.length * 30);
  const [mins, setMins] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timePerPage, setTimerPerPage] = useState(30)

  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      name: props.name || '',
      step: props.step || 0,
      answers: props.answers || [],
      validUser: props.validUser || false
    },
    onSubmit: (values) => {
      console.log(values)
    }
  })

  useEffect(() => {
    const storedData = localStorage.getItem('currentData');
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setFieldValue('validUser', parsedData.validUser || false)
      setFieldValue('step', parsedData.step || 0)
      setFieldValue('name', parsedData.name || '')
      setFieldValue('answers', parsedData.answers || [])
      setTimeLeft(parseInt(parsedData.time, 10))
      setTimerPerPage(parseInt(parsedData.timePerPage, 10))
    }
    // eslint-disable-next-line
  }, []);

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
  }, [timeLeft]);

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
      const tempData = { name: values.name, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft.toString(), answers: values.answers }
      localStorage.setItem('currentData', JSON.stringify(tempData))
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  useEffect(() => {
    if (values.validUser) {
      if (timePerPage === 0 && values.step <= QuizQues.length - 1) {
        // setFieldValue('step', values.step + 1)
        handleNext()
        setTimerPerPage(30)
      } else if (values.step === QuizQues.length) {
        setTimerPerPage(0)
      }
      const tempData = { name: values.name, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft.toString(), answers: values.answers }
      localStorage.setItem('currentData', JSON.stringify(tempData))
    }
    // eslint-disable-next-line
  }, [timePerPage])

  const handleNext = () => {
    const tempData = { name: values.name, timePerPage: timePerPage, validUser: values.validUser, step: values.step + 1, time: timeLeft, answers: values.answers }
    localStorage.setItem('currentData', JSON.stringify(tempData))

    if (values.step < QuizQues.length - 1) {
      setTimerPerPage(30)
      setFieldValue('step', values.step + 1)
    } else if ((values.step + 1) === QuizQues.length) {
      const existingData = localStorage.getItem('all results')
      if (existingData) {
        const tempArr = JSON.parse(existingData) || []
        tempArr.push(tempData)
        localStorage.setItem('all results', JSON.stringify(tempArr))
      } else {
        const tempArr = []
        tempArr.push(tempData)
        localStorage.setItem('all results', JSON.stringify(tempArr))
      }
      setFieldValue('step', values.step + 1)
      setMins(0)
      setSeconds(0)
      setTimeLeft(0)
      setTimerPerPage(0)
    }
  };
  
  const handleReset = () => {
    localStorage.removeItem('currentData')
    setFieldValue('name', '')
    setFieldValue('answers', [])
    setFieldValue('step', 0)
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
    localStorage.setItem('currentData', JSON.stringify({ name: values.name, timePerPage: timePerPage, validUser: values.validUser, step: values.step, time: timeLeft, answers: updatedAnswers }));
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
        alert('USER ALREADY APPEARED THE EXAM!')
      } else {
        setFieldValue('validUser', true)
        setFieldValue('step', 0)
        setTimerPerPage(30)
        setTimeLeft(QuizQues.length * 30)
      }
    } else {
      setFieldValue('validUser', true)
      setFieldValue('step', 0)
      setTimerPerPage(30)
      setTimeLeft(QuizQues.length * 30)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <form>
        {
          values.validUser || values.step > 0 ?
            <>
              <h3> Welcome {values.name}! </h3>
              <h3> TOTAL TEST TIME {(mins > 9) ? mins : `0${mins}`} : {(seconds > 9) ? (seconds !== 60 && seconds) : `0${seconds}`} ! </h3>
              <h3> TIME TO SOLVE THE QUE : {(timePerPage > 9) ? (timePerPage) : `0${timePerPage}`} seconds </h3>
              <div className='stepsLabel'>
                {QuizQues.map((ques, index) => (
                  < div >
                    <button type='button' className={values.step === index ? `activePage` : 'regularButton'} onClick={() => handleTabs(index)}> {index + 1} </button>
                  </div>
                ))}
              </div>
              {
                values.step === QuizQues.length ? (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      <Result />
                    </Typography>
                  </>
                ) : (
                  <>
                    {QuizQues.map((ques, index) => (
                      index === values.step &&
                      <div className='mainForm' key={index}> {ques.question}
                        {ques.options.map((queOption, i) => (
                          <div key={i}>
                            <>
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
                            </>
                          </div>
                        ))}
                      </div>
                    ))}
                    <br />
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {values.step + 1}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button size="small" onClick={handleNext} disabled={values.answers.filter((check: any) => Number(check.que) === Number(values.step + 1)).length === 0}>
                        {values.step === QuizQues.length - 1 ? 'FINISH' : 'NEXT'}
                        <KeyboardArrowRight />
                      </Button>
                    </Box>
                  </>
                )
              }
            </>
            :
            <div className='mainDiv'>
              <label className='labelName'> ENTER YOUR USERNAME :</label>
              <br /><br /><input type='text' className='inputField' name='name' value={values.name} onChange={handleChange} />
              <br /><br />
              <button className='button-86' type='button' onClick={() => { handleName() }}> NEXT </button>
            </div>
        }
      </form>
    </Box >
  );
}
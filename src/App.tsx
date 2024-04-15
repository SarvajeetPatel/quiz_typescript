import { useEffect, useState } from 'react'
import { Typography, Button, Box, useTheme, MobileStepper } from '@mui/material'
import QuizQues from './components/QuizQues'
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import Result from './components/Result'
import { useFormik } from 'formik'

type formikValues = {
  name?: string,
  step?: number,
  answers?: [],
  validUser?: boolean
}

export default function App(props: formikValues) {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(QuizQues.length * 30);
  const [mins, setMins] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const { values, handleChange, handleSubmit } = useFormik({
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
      const parsedData = JSON.parse(storedData);
      values.step = parsedData.step || 0;
      values.answers = parsedData.answers || [];
      setTimeLeft(parseInt(parsedData.time, 10));
    }
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
    if (timeLeft > 60) {
      setMins(Math.floor(timeLeft / 60));
      setSeconds(timeLeft % 60);
    } else {
      setMins(0);
      setSeconds(timeLeft);
    }
    if (timeLeft === 0) {
      values.step = QuizQues.length;
    }
    const tempData = {
      name: values.name,
      step: values.step,
      time: timeLeft.toString(),
      answers: values.answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData));
  }, [timeLeft]);

  const handleNext = () => {
    const tempData = {
      name: values.name,
      step: values.step + 1,
      time: timeLeft,
      answers: values.answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData))

    if (values.step < QuizQues.length - 1) {
      values.step = values.step + 1
    } else if ((values.step + 1) === QuizQues.length) {
      values.step = values.step + 1
      setMins(0)
      setSeconds(0)
      setTimeLeft(0)
    }
  };

  const handleBack = () => {
    const tempData = {
      name: values.name,
      step: values.step - 1,
      time: timeLeft,
      answers: values.answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData))
    values.step = values.step - 1;
  };

  const handleReset = () => {
    localStorage.removeItem('currentData')
    values.name = ''
    values.answers = []
    values.step = 0
    values.validUser = false
    setTimeLeft(QuizQues.length * 30)
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
    localStorage.setItem('currentData', JSON.stringify({ name: values.name, step: values.step, time: timeLeft, answers: updatedAnswers }));
    values.answers = updatedAnswers;
  };

  const handleTabs = (i: number) => {
    if (values.step !== QuizQues.length) {
      const tempData = {
        name: values.name,
        step: values.step,
        time: timeLeft,
        answers: values.answers
      }
      localStorage.setItem('currentData', JSON.stringify(tempData))
      values.step = i
    } else {
      alert('Test ended! You cannot go back, but can restart it!')
    }
  }

  const handlePage = () => {
    console.log(values)
    values.step = 0
    values.validUser = (true)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <form>
        {
          values.validUser ?
            <>
              <h3> Welcome {values.name}! </h3>
              <h3> TIME LEFT IS {(mins > 9) ? mins : `0${mins}`} : {(seconds > 9) ? (seconds !== 60 && seconds) : `0${seconds}`} ! </h3>
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
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      <Result />
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    {QuizQues.map((ques, index) => (
                      index === values.step &&
                      <div className='mainForm' key={index}> {ques.question}
                        {ques.options.map((queOption) => (
                          <>
                            <br /><label>
                              <input type='radio' name={`${index + 1}`} value={queOption} onChange={(e) => handleChoice(e)} defaultChecked={values.answers?.filter((item: any) => (item?.ans === queOption)).length > 0} />
                              {queOption} </label></>
                        ))}
                      </div>
                    ))}
                    <br />
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {values.step + 1}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <MobileStepper
                        variant="progress" steps={QuizQues.length} position="static" activeStep={values.step} sx={{ maxWidth: 400, flexGrow: 1 }}
                        nextButton={
                          <Button size="small" onClick={handleNext} disabled={values.answers.filter((check: any) => Number(check.que) === Number(values.step + 1)).length === 0}>
                            {values.step === QuizQues.length - 1 ? 'FINISH' : 'NEXT'}
                            {theme.direction === 'rtl' ? (
                              <KeyboardArrowLeft />
                            ) : (
                              <KeyboardArrowRight />
                            )}
                          </Button>
                        }
                        backButton={
                          <Button size="small" onClick={handleBack} disabled={values.step === 0}>
                            {theme.direction === 'rtl' ? (
                              <KeyboardArrowRight />
                            ) : (
                              <KeyboardArrowLeft />
                            )}
                            BACK
                          </Button>
                        }
                      />
                    </Box>
                  </>
                )
              }
            </>
            :
            <div>
              <label> ENTER YOUR USERNAME :
                <input type='text' name='name' value={values.name} onChange={handleChange} />
              </label>
              <button type='button' onClick={() => handlePage()}> NEXT </button>
            </div>
        }
      </form>
    </Box >
  );
}
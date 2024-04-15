import { useEffect, useState } from 'react'
import { Typography, Button, Box, useTheme, MobileStepper } from '@mui/material'
import QuizQues from './components/QuizQues'
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import Result from './components/Result'

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const theme = useTheme();
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QuizQues.length * 30);
  const [mins, setMins] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('currentData');
    const storedTime = localStorage.getItem('time');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setActiveStep(parsedData.step || 0);
      setAnswers(parsedData.answers || []);
    }
    if (storedTime) {
      setTimeLeft(parseInt(storedTime, 10));
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
  }, []);

  useEffect(() => {
    if (timeLeft > 60) {
      setMins(Math.floor(timeLeft / 60));
      setSeconds(timeLeft % 60);
    } else {
      setMins(0);
      setSeconds(timeLeft);
    }
    if (timeLeft === 0) {
      setActiveStep(QuizQues.length);
    }
    localStorage.setItem('time', timeLeft.toString());
  }, [timeLeft]);

  const isStepOptional = (step: number) => {
    return step < QuizQues.length;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    const tempData = {
      'step': activeStep + 1,
      'answers': answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData))

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    if (activeStep < QuizQues.length - 1) {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
    } else if ((activeStep + 1) === QuizQues.length) {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
      setMins(0)
      setSeconds(0)
      setTimeLeft(0)
    }
    setSkipped(newSkipped)
  };

  const handleBack = () => {
    const tempData = {
      'step': activeStep - 1,
      'answers': answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData))
    setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    const tempData = {
      'step': activeStep + 1,
      'answers': answers
    }
    localStorage.setItem('currentData', JSON.stringify(tempData))

    setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    localStorage.removeItem('currentData')
    localStorage.removeItem('time')
    setAnswers([])
    setActiveStep(0)
    setTimeLeft(QuizQues.length * 30)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prevAnswers => {
      const updatedAnswers: any = [...prevAnswers];
      const index = updatedAnswers.findIndex((ans: any) => ans.que === name);
      if (index !== -1) {
        updatedAnswers[index].ans = value;
      } else {
        updatedAnswers.push({ que: name, ans: value });
      }
      localStorage.setItem('currentData', JSON.stringify({ step: activeStep, answers: updatedAnswers }));
      return updatedAnswers;
    });
  };

  const handleTabs = (i: number) => {
    if (activeStep !== QuizQues.length) {
      const userInput = {
        'step': i,
        'answers': answers
      }
      localStorage.setItem('current data', JSON.stringify(userInput))
      setActiveStep(i)
    } else {
      alert('Test ended! You cannot go back, but can restart it!')
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <h3> TIME LEFT IS {(mins > 9) ? mins : `0${mins}`} : {(seconds > 9) ? (seconds !== 60 && seconds) : `0${seconds}`} ! </h3>
      <div className='stepsLabel'>
        {QuizQues.map((ques, index) => (
          < div >
            <button onClick={() => handleTabs(index)}> {index + 1} </button>
          </div>
        ))}
      </div>
      {
        activeStep === QuizQues.length ? (
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
            <form>
              {QuizQues.map((ques, index) => (
                index === activeStep &&
                <div className='mainForm' key={index}> {ques.question}
                  {ques.options.map((queOption) => (
                    <>
                      <br /><label>
                        <input type='radio' name={`${index + 1}`} value={queOption} onChange={(e) => handleChange(e)} defaultChecked={answers?.filter((item: any) => (item?.ans === queOption)).length > 0} />
                        {queOption} </label></>
                  ))}
                </div>
              ))}
              <br />
              <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }} disabled={activeStep >= QuizQues.length - 1}>
                    Skip
                  </Button>
                )}
                <MobileStepper
                  variant="progress" steps={QuizQues.length} position="static" activeStep={activeStep} sx={{ maxWidth: 400, flexGrow: 1 }}
                  nextButton={
                    <Button size="small" onClick={handleNext}>
                      {activeStep === QuizQues.length - 1 ? 'FINISH' : 'NEXT'}
                      {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
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
            </form>
          </>
        )
      }
    </Box >
  );
}
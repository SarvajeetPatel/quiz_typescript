import { useEffect, useState } from 'react'
import { Typography, Button, Box, useTheme, MobileStepper } from '@mui/material'
import QuizQues from './components/QuizQues'
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import Result from './components/Result';

export default function App() {
  const steps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const theme = useTheme();
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(QuizQues.length * 30)
  const [mins, setMins] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 60) {
      setMins(Math.floor(timeLeft / 60))
      setSeconds(timeLeft % 60)
    } else {
      setSeconds(timeLeft)
    }
    if (timeLeft === 0) {
      setActiveStep(9)
      handleNext()
    }
    // eslint-disable-next-line
  }, [timeLeft])

  useEffect(() => {
    const storedValue: any = localStorage.getItem('answers')
    const currStep: any = localStorage.getItem('step');
    setAnswers(storedValue ? JSON.parse(storedValue) : [])
    setActiveStep(Number(currStep) ? Number(currStep) : 0)
  }, [])

  const isStepOptional = (step: number) => {
    return step < steps.length;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    localStorage.setItem('step', JSON.stringify(activeStep + 1))
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    localStorage.setItem('step', JSON.stringify(activeStep - 1))
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('step', JSON.stringify(activeStep + 1))
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    localStorage.removeItem('step')
    localStorage.removeItem('answers')
    setAnswers([]);
    setActiveStep(0);
  }

  const handleChange = (e: any) => {
    const tempArr: any = answers;
    if (tempArr.filter((item: any) => (Number(item.que) === (activeStep + 1))).length > 0) {
      tempArr.filter((item: any) => (Number(item.que) === (activeStep + 1)))[0].ans = e.target.value
    } else {
      tempArr.push({ 'que': e.target.name, 'ans': e.target.value })
    }
    localStorage.setItem('answers', JSON.stringify(tempArr))
    localStorage.setItem('step', JSON.stringify(activeStep))
    setAnswers(tempArr)
  }

  const handleTabs = (i: number) => {
    if (activeStep !== 10) {
      setActiveStep(i)
    } else {
      alert('Test ended! You cannot go back, but can restart it!')
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <h3> TIME LEFT IS {(mins > 9) ? mins : `0${mins}`} : {(seconds > 9) ? seconds : `0${seconds}`} ! </h3>
      <div className='stepsLabel'>
        {QuizQues.map((ques, index) => (
          < div >
            <button onClick={() => handleTabs(index)}> {index + 1} </button>
          </div>
        ))}
      </div>
      {
        activeStep === steps.length ? (
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
                <div key={index}> {ques.question}
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
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                <MobileStepper
                  variant="progress" steps={10} position="static" activeStep={activeStep} sx={{ maxWidth: 400, flexGrow: 1 }}
                  nextButton={
                    <Button size="small" onClick={handleNext}>
                      {activeStep === 9 ? 'FINISH' : 'NEXT'}
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
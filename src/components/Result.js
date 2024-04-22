import { useEffect } from 'react'
import QuizQues from './QuizQues'
import Cookies from 'js-cookie'

function Result() {
    var userInputs = [], score = 0, minsLeft = 0, secLeft = 0
    const existingData = localStorage.getItem('all results') || []
    useEffect(() => {
        if (existingData) {
            const parsedValue = JSON.parse(existingData)
            var tempValue = parsedValue
            tempValue[tempValue.length - 1].score = score
            localStorage.setItem('all results', JSON.stringify(tempValue))
        }
        // eslint-disable-next-line
    }, [score])

    const storedValue = Cookies.get('currentData')
    if (storedValue !== null) {
        const parsedData = JSON.parse(storedValue)
        userInputs = parsedData?.answers || []
    }
    if (existingData) {
        const parsedValue = JSON.parse(existingData)
        var tempArr = parsedValue[parsedValue.length - 1]
        const timeLeft = tempArr.time
        minsLeft = Math.floor(timeLeft / 60)
        secLeft = timeLeft % 60
    }
    userInputs.map((quizItem) => (
        QuizQues.filter((item, index) => (
            ((index + 1) === Number(quizItem.que)) ?
                ((item.correctAnswer === quizItem.ans) ? score += 1 : score) : score
        ))
    ))

    return (
        <>
            <article>
                <h1> YOUR TEST DETAILS : </h1>
                <dl>
                    <div>
                        <dt> <u> TIME </u> </dt>
                        <dd>The time left for the test is '0{minsLeft}:{secLeft > 9 ? secLeft : `0${secLeft}`}'</dd>
                    </div>
                    <div>
                        <dt> <u> ATTEMPTED </u> </dt>
                        <dd>Number of questions you've attempted are : {userInputs?.length} / {QuizQues.length}</dd>
                    </div>
                    <div>
                        <dt> <u> SKIPPED </u> </dt>
                        <dd>You've skipped {QuizQues.length - userInputs?.length} questions</dd>
                    </div>
                    <div>
                        <dt> <u> INCORRECT </u> </dt>
                        <dd>Number of incorrectly answered questions are : {userInputs?.length - score}</dd>
                    </div>
                    <div>
                        <dt> <u> OVERALL RESULT </u> </dt>
                        <dd>Your calculated Overall Result is {score} MARKS</dd>
                    </div>
                </dl>
            </article>
            <div className='question-div'>
                <div className='ques-heading'> <u> LIST OF QUESTIONS : </u> </div >
                {
                    QuizQues.map((item, index) =>
                        (userInputs.filter((quizy) => Number(quizy.que) === index + 1).length > 0) ?
                            userInputs.filter((quizer) => Number(quizer.que) === index + 1).map((quizItem) =>
                                <div className='mainResult'>
                                    <h4>{index + 1} {item?.question} </h4>
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
                            <div className='mainResult' >
                                <h4>{index + 1} {item?.question} </h4>
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
                    )
                }
            </div>
        </>
    )
}

export default Result
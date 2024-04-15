import QuizQues from './QuizQues'

function Result() {
    var userInputs = [];
    const storedValue = localStorage.getItem('currentData')
    if (storedValue !== null) {
        const parsedData = JSON.parse(storedValue)
        userInputs = parsedData?.answers || []
    }
    var score = 0;
    userInputs.map((quizItem) => (
        QuizQues.filter((item, index) => (
            ((index + 1) === Number(quizItem.que)) ?
                ((item.correctAnswer === quizItem.ans) ? score += 1 : score) : score
        ))
    ))
    console.log(userInputs.map((quizItem) => (
        QuizQues.filter((item, index) => (
            ((index + 1) === Number(quizItem.que) &&
                { item }
            ))))), "user")
    return (
        <>
            <h2> NO. OF QUESTIONS ATTEMPTED : {userInputs?.length} / {QuizQues.length} </h2>
            <h3> QUES SKIPPED : {QuizQues.length - userInputs?.length} </h3>
            <h3> <u> YOUR OVERALL RESULT IS : {score} MARKS </u> </h3>
            <h3> INCORRECTLY ANSWERED ARE : {userInputs?.length - score} </h3>

            {userInputs.map((quizItem, i) => (
                QuizQues.filter((notItem, index) => (
                    ((index + 1) === Number(quizItem?.que)))).map((item) =>
                        <div className='mainForm'>
                            <h4>{i + 1} {item?.question} </h4>
                            {item.options.map((opt) =>
                                <>
                                    {(quizItem.ans === item.correctAnswer && opt === item.correctAnswer) ?
                                        <div className='correctAnswer'> {opt} </div> :
                                        (opt === quizItem.ans && quizItem.ans !== item.correctAnswer) ?
                                            <div className='wrongAnswer'> {opt} </div> :
                                            (opt === item.correctAnswer && quizItem.ans !== item.correctAnswer) ?
                                                <div className='correctAnswer'> {opt} </div> : <div> {opt} </div>
                                    }
                                </>
                            )}
                        </div>)
            ))
            }
        </>
    )
}

export default Result
import QuizQues from './QuizQues'

function Result() {
    const storedValue = localStorage.getItem('currentData')
    if (storedValue) {
        const parsedData = JSON.parse(storedValue)
        var userInputs = parsedData.answers || []
    }
    console.log(userInputs)
    var score = 0;
    userInputs.map((quizItem) => (
        QuizQues.filter((item, index) => (
            ((index + 1) === Number(quizItem.que)) ?
                ((item.correctAnswer === quizItem.ans) ? score += 1 : score) : score
        ))
    ))

    return (
        <>
            <h2> NO. OF QUESTIONS ATTEMPTED : {userInputs.length}/10 </h2>
            <h3> YOUR OVERALL RESULT IS : {score} MARKS </h3>
            <h3> No. OF INCORRECT ARE : {userInputs.length - score} </h3>
        </>
    )
}

export default Result
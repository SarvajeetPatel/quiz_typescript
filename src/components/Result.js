import QuizQues from './QuizQues'

function Result() {
    const storedValue = localStorage.getItem('answers')
    const values = storedValue ? JSON.parse(storedValue) : []
    var score = 0;
    values.map((quizItem) => (
        QuizQues.filter((item, index) => (
            ((index + 1) === Number(quizItem.que)) ?
                ((item.correctAnswer === quizItem.ans) ? score += 1 : score) : score
        ))
    ))

    return (
        <>
            <h2> NO. OF QUESTIONS ATTEMPTED : {values.length}/10 </h2>
            <h3> YOUR OVERALL RESULT IS : {score} MARKS </h3>
            <h3> No. OF INCORRECT ARE : {values.length - score} </h3>
        </>
    )
}

export default Result
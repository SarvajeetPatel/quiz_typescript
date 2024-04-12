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
    console.log(score, values)

    return (
        <div> {score} </div>
    )
}

export default Result
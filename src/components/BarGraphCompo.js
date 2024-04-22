import { BarChart } from '@mui/x-charts'
import QuizQues from '../components/QuizQues'
import { useEffect, useState } from 'react';

export default function BarGraphCompo() {
    const chartSetting = {
        yAxis: [{ label: 'count of students', }],
        width: 500,
        height: 300,
    }
    const valueFormatter = (value) => `${value}`;
    const [statistics, setStatistics] = useState([])

    useEffect(() => {
        const storedValue = JSON.parse(localStorage.getItem('all results')) || []
        var newStat = []
        QuizQues.map((quizItem, index) => {
            var wrongCount = 0, correctCount = 0;
            storedValue.map((item) => (
                item.answers.filter((userInput) => Number(userInput.que) === index + 1 && (userInput.ans === quizItem.correctAnswer ? correctCount++ : wrongCount++))
            ))
            newStat.push({ 'index': index + 1, 'correct': correctCount, 'wrong': wrongCount })
            return true
        })
        setStatistics(newStat)
    }, [])

    return (
        <div className='data-table'>
            <BarChart
                dataset={statistics}
                xAxis={[{ scaleType: 'band', dataKey: 'index', label: 'question numbers' }]}
                series={[
                    { dataKey: 'correct', label: 'no of students who answered Correctly', valueFormatter, color: '#00C49F' },
                    { dataKey: 'wrong', label: 'no of students who answered ', valueFormatter, color: '#ad4e5e' },
                ]}
                margin={{ top: 80 }}
                {...chartSetting}
            />
        </div>
    );
}
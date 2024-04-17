import { BarChart } from '@mui/x-charts'
import QuizQues from '../components/QuizQues'
import { useEffect, useState } from 'react';

export default function LineGraph() {
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
    console.log(statistics)
    return (
        <BarChart
            dataset={statistics}
            xAxis={[{ scaleType: 'band', dataKey: 'index', label: 'question numbers' }]}
            series={[
                { dataKey: 'correct', label: 'Correctly answered', valueFormatter, color:'#00C49F' },
                { dataKey: 'wrong', label: 'InCorrectly answered', valueFormatter , color:'#ad4e5e'},
            ]}
            {...chartSetting}
        />
    );
}
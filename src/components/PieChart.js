import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import QuizQues from '../components/QuizQues'

export default function BasicPie() {
    const [finalData, setFinalData] = useState([])

    useEffect(() => {
        const storedValue = JSON.parse(localStorage.getItem('all results')) || []
        var tempData = []
        var upto30 = 0, upto45 = 0, upto60 = 0, upto75 = 0, upto100 = 0
        storedValue.map((userData) => {
            const percent = (userData.score / QuizQues.length) * 100
            if (percent >= 0 && percent <= 30) {
                upto30++;
            } else if (percent > 30 && percent <= 45) {
                upto45++;
            } else if (percent > 45 && percent <= 60) {
                upto60++;
            } else if (percent > 60 && percent <= 75) {
                upto75++;
            } else {
                upto100++;
            }
            return true;
        })
        tempData.push({ 'id': 0, value: upto100, label: 'b/w 75 & 100' })
        tempData.push({ 'id': 1, value: upto75, label: 'b/w 60 & 75' })
        tempData.push({ 'id': 2, value: upto60, label: 'b/w 45 & 60' })
        tempData.push({ 'id': 3, value: upto45, label: 'b/w 30 & 42' })
        tempData.push({ 'id': 4, value: upto30, label: 'b/w 0 & 30' })
        setFinalData(tempData)
    }, [])

    return (
        <div className='data-table'>
            <PieChart
                series={[
                    {
                        data: finalData
                    },
                ]}
                width={400}
                height={200}
                margin={{ left: -50 }}
            />
        </div>
    );
}
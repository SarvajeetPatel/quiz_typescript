import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';

export default function BasicLineChart() {
    const [userChoice, setUserChoice] = useState('Monthly')
    const [dataToDisplay, setDataToDisplay] = useState([])
    const [axisNumbers, setAxisNumbers] = useState([])
    const storedValue = JSON.parse(localStorage.getItem('all results')) || []

    useEffect(() => {
        var statistics = [], lineStatistics = [];
        if (userChoice === 'Monthly') {
            const sortedList = storedValue.sort((a, b) => new Date(a.testDate.split('/')[2], a.testDate.split('/')[1], a.testDate.split('/')[0]) > new Date(b.testDate.split('/')[2], b.testDate.split('/')[1], b.testDate.split('/')[0]))
            sortedList.map((userData) => {
                const dates = userData.testDate.split('/')
                var givenDate = dates[0], givenMonth = dates[1], givenYear = dates[2], count = 0, currMonth = new Date().getMonth(), currYear = new Date().getFullYear()
                // eslint-disable-next-line
                if ((givenYear == currYear) && ((givenMonth - 1) === currMonth)) {
                    // eslint-disable-next-line
                    const checkExists = statistics?.filter(item => item == givenDate)
                    if (checkExists.length > 0) {
                        count = lineStatistics[lineStatistics.length - 1] + 1
                        lineStatistics[lineStatistics.length - 1] = count
                    } else {
                        count++
                        statistics.push(Number(givenDate))
                        lineStatistics.push(count)
                    }
                }
                return 0;
            })
            if (!statistics.includes(1)) {
                statistics.unshift(1)
                lineStatistics.unshift(0)
            }
            if (!statistics.includes(30)) {
                statistics.push(30)
                lineStatistics.push(0)
            }
            setDataToDisplay(statistics)
            setAxisNumbers(lineStatistics)
        } else if (userChoice === 'Today') {
            var tempArr = [], count = 0
            // eslint-disable-next-line
            storedValue.map((userData) => {
                // eslint-disable-next-line
                if (userData.testDate == new Date().toLocaleDateString()) {
                    if (tempArr.length > 0) {
                        count = tempArr[0] + 1
                        tempArr.splice(0, 1, count)
                    } else {
                        count++
                        tempArr.push(count)
                    }
                }
            })
            setAxisNumbers([tempArr[0]])
            setDataToDisplay([Number(new Date().toLocaleDateString().split('/', 1)[0])])
        } else if (userChoice === 'Weekly') {
            var curr = new Date();
            var toMonth = curr.getMonth()
            var toYear = curr.getFullYear()
            var first = curr.getDate() - curr.getDay();
            var last = first + 6;
            var updateData = [0, 0, 0, 0, 0, 0, 0], counter = 0;
            storedValue.map((userData) => {
                const tempDate = userData.testDate.split('/')
                const givenDate = tempDate[0]
                const givenMonth = tempDate[1]
                const givenYear = tempDate[2]
                // eslint-disable-next-line
                if ((givenDate >= first) && (givenDate <= last) && ((givenMonth - 1) == toMonth) && (givenYear == toYear)) {
                    const date = new Date(givenYear, givenMonth - 1, givenDate)
                    counter = updateData[date.getDay()] + 1
                    updateData.splice(date.getDay(), 1, counter)
                }
                return true
            })
            setAxisNumbers(updateData)
            setDataToDisplay(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        } else {
            var tests = [], yearList = [];
            storedValue.map((userData) => {
                const thisYear = userData.testDate.split('/')[2]
                if (yearList.includes(thisYear)) {
                    const yearIndex = yearList.indexOf(thisYear)
                    const tempCount = tests[yearIndex] + 1
                    tests[yearIndex] = tempCount
                } else {
                    yearList.push(thisYear)
                    tests.push(1)
                }
                return true
            })
            tests.push(0)
            yearList.push((Number(yearList[yearList.length - 1]) + 1).toString())
            tests.splice(0, 0, 0)
            yearList.splice(0, 0, (Number(yearList[0]) - 1).toString())
            setAxisNumbers(tests)
            setDataToDisplay(yearList)
        }
        // eslint-disable-next-line
    }, [userChoice])

    return (
        <>
            <div className='data-table'>
                <LineChart
                    xAxis={[{ scaleType: 'point', data: dataToDisplay, label: ((userChoice === 'Monthly' && 'dates') || (userChoice === 'Weekly' && 'days')) }]}
                    series={[
                        {
                            data: axisNumbers,
                        },
                    ]}
                    width={500}
                    height={300}
                />
            </div>
            <h4> You can select time period of your choice! </h4>
            <select style={{ width: '80px' }} defaultValue={userChoice} onChange={(e) => setUserChoice(e.target.value)}>
                <option value='Monthly' > Monthly </option>
                <option value='Weekly' > Weekly </option>
                <option value='Today' > Today </option>
                <option value='Yearly' > Yearly </option>
            </select>
        </>
    );
}
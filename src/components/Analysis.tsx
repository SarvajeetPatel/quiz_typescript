import { useNavigate } from "react-router-dom"
import BarGraphCompo from "./BarGraphCompo"
import PieChart from "./PieChart"
import LineGraph from "./LineGraph"

function Analysis() {
    var parsedData: any = [], navigate = useNavigate();
    const existingData: any = localStorage.getItem('all results') || []
    if (existingData) {
        parsedData = JSON.parse(existingData)
        parsedData.sort((a: any, b: any) => b.score - a.score)
    }

    const handleClick = () => {
        navigate('/')
        localStorage.removeItem('currentData')
    }

    const handleAllResults = () => {
        navigate('/allResults')
    }

    return (
        <>
            <div className="currView">
                <div>
                    <div className='topList'>
                        <h3><u> List of Top - 5 Students </u></h3>
                        {parsedData?.map((item: any, index: number) => (
                            index < 5 &&
                            <div className="innerDiv">
                                <div> <b> {index + 1}. Name : {item.name} </b></div>
                                <div> Date of Test : {(item?.testDate)} </div>
                                <div> Score : {item.score} </div> <br /> <br />
                            </div>
                        ))}
                        <br /><br />
                        <div className="switchButtons">
                            <button className="button-86" onClick={handleClick}> GIVE TEST </button>
                            <button className="button-86" onClick={handleAllResults}> VIEW ALL RESULTS </button>
                        </div>
                    </div>
                    <div className="graphsPos">
                        <h3> The below line graph shows students who appeared in the test! </h3>
                        <LineGraph />
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '5px' }}>
                        <button className="button-86" onClick={() => navigate('/add-dummy-data')}> ADD DUMMY DATA </button>
                    </div>
                    <div className='graphsPos'>
                        <div> <h3> The below bar graph shows the count of </h3>
                            <h3> students as per their answers per question! </h3></div>
                        <BarGraphCompo />
                    </div>
                    <div className='graphsPos'>
                        <h3> The below pie chart shows students score percentage! </h3>
                        <PieChart />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Analysis
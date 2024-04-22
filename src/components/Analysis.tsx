import { useNavigate } from "react-router-dom"
import BarGraphCompo from "./BarGraphCompo"
import PieChart from "./PieChart"
import LineGraph from "./LineGraph"
import Cookies from "js-cookie";

function Analysis() {
    var parsedData: any = [], navigate = useNavigate();
    const existingData: any = localStorage.getItem('all results') || []
    if (existingData) {
        parsedData = JSON.parse(existingData)
        parsedData.sort((a: any, b: any) => b.score - a.score)
    }

    const handleClick = () => {
        navigate('/')
        Cookies.remove('currentData')
    }

    const handleAllResults = () => {
        navigate('/view-all-results')
    }

    return (
        <>
            <div>
                <div className="analysis-heading">
                    <h2> Analysis of the tests given by the students so far! </h2> </div>
                <div className="currView">
                    <div className="leaderboard">
                        <div className='leaderboard__title'>
                            List of Top - 5 Students </div>
                        <main className="leaderboard__profiles">
                            {parsedData?.map((item: any, index: number) => (
                                index < 5 &&
                                <article className="leaderboard__profile">
                                    <img src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1713657600&semt=ais"
                                        className="leaderboard__picture" alt="close" />
                                    <span className="leaderboard__name"> <b> {index + 1}. {item.name.split(' ')[0]} </b></span>
                                    <span className="leaderboard__value"> {(item?.testDate)}</span>
                                    <span className="leaderboard__value"> {item.score} </span>
                                    {/* <br /> */}
                                    {/* <br /> */}
                                </article>
                            ))}
                        </main>
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
                <div className="currView">
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
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '5px' }}>
                    <button className="button-86" onClick={() => navigate('/add-dummy-data')}> ADD DUMMY DATA </button>
                </div>
            </div>
        </>
    )
}

export default Analysis
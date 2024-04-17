import { useNavigate } from "react-router-dom"
import LineGraph from "./LineGraph";
import PieChart from "./PieChart";

function Analysis() {
    var parsedData = [], navigate = useNavigate();
    const existingData: any = localStorage.getItem('all results') || []
    if (existingData) {
        parsedData = JSON.parse(existingData)
        parsedData.sort((a: any, b: any) => b.score - a.score)
    }

    const handleClick = () => {
        navigate('/')
        localStorage.removeItem('currentData')
    }

    return (
        <>
            <div className="currView">
                <div>
                    <div><h3> TOP - 5 Students </h3></div>
                    <div> <button onClick={handleClick}> GIVE TEST! </button> </div>
                    {parsedData?.map((item: any, index: number) => (
                        index < 5 &&
                        <div className="innerDiv">
                            <div> {index + 1} Name : {item.name} </div>
                            <div> Score : {item.score} </div> <br /> <br />
                        </div>
                    ))}
                </div>
                <div>
                    <LineGraph />
                    <PieChart />
                </div>
            </div>
        </>
    )
}

export default Analysis
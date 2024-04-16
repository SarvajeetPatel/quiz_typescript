import { useNavigate } from "react-router-dom"

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
            <div>
                <div><h3> TOP - 5 Students </h3></div>
                <div> <button onClick={handleClick}> GIVE TEST! </button> </div>
            </div>
            {parsedData?.map((item: any, index: number) => (
                index < 5 &&
                <>
                    <div> {index + 1} Name : {item.name} </div>
                    <div> Score : {item.score} </div> <br />
                </>
            ))}
        </>
    )
}

export default Analysis
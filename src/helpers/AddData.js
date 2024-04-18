import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DummyData from "./DummyData"

function AddData() {
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.setItem('all results', JSON.stringify(DummyData))
    }, [])

    return (
        <>
            Data Added Successfully!
            <button className="button-86" onClick={() => navigate('/analysis')}> GO TO ANALYSIS </button>
        </>
    )
}

export default AddData
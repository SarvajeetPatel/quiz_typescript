import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const storedValue = JSON.parse(localStorage.getItem('all results')) || []

    return (
        <NoteContext.Provider value={{ page, setPage, rowsPerPage, setRowsPerPage, storedValue }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState  
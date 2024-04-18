import TablePagination from '@mui/material/TablePagination';
import { useContext } from 'react';
import NoteContext from '../context/NoteContext';

export default function PaginationCompo() {
    const { page, setPage, rowsPerPage, setRowsPerPage, storedValue } = useContext(NoteContext)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TablePagination
            component="div"
            count={storedValue.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
}
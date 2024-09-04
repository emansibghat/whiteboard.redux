
import { useDispatch, useSelector } from 'react-redux';
import { setTool } from '../redux/actions/drawingActions';
import { Button, Box } from '@mui/material';

const Toolbar = () => {
    const dispatch = useDispatch();
    const currentTool = useSelector(state => state.drawing.currentTool);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
                variant={currentTool === 'pen' ? 'contained' : 'outlined'}
                onClick={() => dispatch(setTool('pen'))}
                sx={{ mr: 2 }}
            >
                Pen
            </Button>
            <Button
                variant={currentTool === 'eraser' ? 'contained' : 'outlined'}
                onClick={() => dispatch(setTool('eraser'))}
                sx={{ mr: 2 }}
            >
                Eraser
            </Button>
            
            <Button
                variant={currentTool === 'rectangle' ? 'contained' : 'outlined'}
                onClick={() => dispatch(setTool('rectangle'))}
                sx={{ mr: 2 }}
            >
                Rectangle
            </Button>
            <Button
                variant={currentTool === 'circle' ? 'contained' : 'outlined'}
                onClick={() => dispatch(setTool('circle'))}
            >
                Circle
            </Button>
        </Box>
    );
};

export default Toolbar;

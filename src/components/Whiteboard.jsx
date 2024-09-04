import  { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLine, setColor, undo, redo } from '../redux/actions/drawingActions';
import { Box, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


const smoothPoints = (points) => {
    const result = [];
    if (points.length < 2) return points;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        result.push(p0);
        const midPoint = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        result.push(midPoint);
    }
    result.push(points[points.length - 1]);
    return result;
};

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const lines = useSelector(state => state.drawing.lines);
    const currentTool = useSelector(state => state.drawing.currentTool);
    const currentColor = useSelector(state => state.drawing.currentColor);

    const [drawing, setDrawing] = useState(false);
    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            ctx.beginPath();
            if (line.tool === 'pen' || line.tool === 'eraser') {
                ctx.strokeStyle = line.tool === 'eraser' ? '#fff' : line.color || '#000'; 
                ctx.lineWidth = line.tool === 'eraser' ? 30 : 15; 
                const smoothedPoints = smoothPoints(line.points);
                ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
                smoothedPoints.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            } else if (line.tool === 'rectangle') {
                const { x, y, width, height } = line;
                ctx.strokeRect(x, y, width, height);
            } else if (line.tool === 'circle') {
                const { x, y, radius } = line;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }, [lines]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setDrawing(true);
        setStartX(offsetX);
        setStartY(offsetY);

        if (currentTool === 'pen' || currentTool === 'eraser') {
            dispatch(addLine({
                tool: currentTool,
                points: [{ x: offsetX, y: offsetY }],
                color: currentTool === 'eraser' ? '#fff' : currentColor 
            }));
        }
    };

    const draw = ({ nativeEvent }) => {
        if (!drawing) return;
        const { offsetX, offsetY } = nativeEvent;
        if (currentTool === 'pen' || currentTool === 'eraser') {
            dispatch(addLine({
                tool: currentTool,
                points: [{ x: offsetX, y: offsetY }],
                color: currentTool === 'eraser' ? '#fff' : currentColor 
            }));
        } else if (currentTool === 'rectangle') {
            dispatch(addLine({
                tool: currentTool,
                x: Math.min(startX, offsetX),
                y: Math.min(startY, offsetY),
                width: Math.abs(startX - offsetX),
                height: Math.abs(startY - offsetY),
            }));
        } else if (currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY - startY, 2));
            dispatch(addLine({
                tool: currentTool,
                x: startX,
                y: startY,
                radius,
            }));
        }
    };

    const stopDrawing = () => {
        setDrawing(false);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Color</InputLabel>
                    <Select
                        value={currentColor}
                        onChange={(e) => dispatch(setColor(e.target.value))}
                        label="Color"
                    >
                        <MenuItem value="#000">Black</MenuItem>
                        <MenuItem value="#ff0000">Red</MenuItem>
                        <MenuItem value="#00ff00">Green</MenuItem>
                        <MenuItem value="#0000ff">Blue</MenuItem>
                        <MenuItem value="#ffff00">Yellow</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box
                sx={{
                    border: '1px solid #ccc',
                    backgroundColor: 'white', 
                    width: '800px',
                    height: '600px',
                    mb: 2,
                    position: 'relative',
                }}
            >
                <canvas
                    ref={canvasRef}
                    width="800"
                    height="600"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    style={{ backgroundColor: 'transparent' }} 
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={saveSignature}
                sx={{ mr: 1 }}
            >
                Save Signature
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => dispatch(undo())}
                sx={{ mr: 1 }}
            >
                Undo
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => dispatch(redo())}
            >
                Redo
            </Button>
        </Box>
    );
};

export default Whiteboard;

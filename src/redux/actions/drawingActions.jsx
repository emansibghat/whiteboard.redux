export const addLine = (line) => ({
    type: 'ADD_LINE',
    payload: line,
});

export const setTool = (tool) => ({
    type: 'SET_TOOL',
    payload: tool,
});

export const setColor = (color) => ({
    type: 'SET_COLOR',
    payload: color,
});

export const undo = () => ({
    type: 'UNDO',
});

export const redo = () => ({
    type: 'REDO',
});

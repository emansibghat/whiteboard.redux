const initialState = {
    lines: [],
    currentTool: 'pen',
    currentColor: '#000',
    history: {
        past: [],
        future: [],
    },
};

const drawingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_LINE': {
            const newLines = [...state.lines, action.payload];
            return {
                ...state,
                lines: newLines,
                history: {
                    past: [...state.history.past, state.lines],
                    future: [],
                },
            };
        }
        case 'SET_TOOL':
            return {
                ...state,
                currentTool: action.payload,
            };
        case 'SET_COLOR':
            return {
                ...state,
                currentColor: action.payload,
            };
        case 'UNDO': {
            const [last, ...past] = state.history.past;
            if (!last) return state;
            return {
                ...state,
                lines: last,
                history: {
                    past,
                    future: [state.lines, ...state.history.future],
                },
            };
        }
        case 'REDO': {
            const [next, ...future] = state.history.future;
            if (!next) return state;
            return {
                ...state,
                lines: next,
                history: {
                    past: [...state.history.past, state.lines],
                    future,
                },
            };
        }
        default:
            return state;
    }
};

export default drawingReducer;

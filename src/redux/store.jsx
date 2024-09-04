import { createStore, combineReducers } from 'redux';
import drawingReducer from './reducers/drawingReducer';

const rootReducer = combineReducers({
    drawing: drawingReducer,
});

const store = createStore(rootReducer);

export default store;

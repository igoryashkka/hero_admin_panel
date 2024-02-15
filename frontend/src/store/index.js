import { legacy_createStore as createStore , combineReducers, compose, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

// const enhancer = (createStore) => (...args) => {
//     const store = createStore(...args);

//     const oldDispatch = store.dispatch;
//     store.dispatch = (action) => {
//         if (typeof action === 'string') {
//             return oldDispatch({
//                 type: action
//             })
//         }
//         return oldDispatch(action)
//     }
//     return store;
// }


const stringMiddleware = () => (next) => (action) => {
        if (typeof action === 'string') {
            return next({
                type: action
            })
        }
        return next(action)
}

const store = createStore(
                    combineReducers({heroes, filters}),
                    compose(
                       applyMiddleware(thunk,stringMiddleware),
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    )

                    );

export default store;

import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import counterReducer from '../slice/counter'
import User from "../slice/User"


const reducer = combineReducers({
  counter:counterReducer,
  user:User,
})

const store = configureStore({
  reducer,    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export default store;
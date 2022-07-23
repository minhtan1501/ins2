import { createSlice } from "@reduxjs/toolkit";

const notifySlice =  createSlice({
    name:"notify",
    initialState:{
        loading: false,
        type: '',
        msg: '',
    },
    reducers:{
        changeLoading(state,action) {
            state.loading = action.payload
        },
        clearNotify(state) {
            state.type = '';
            state.msg = ''
        },
        setNotify(state,action) {
            state.type = action.payload.type;
            state.msg = action.payload.msg
        }
    }
})

export default notifySlice;
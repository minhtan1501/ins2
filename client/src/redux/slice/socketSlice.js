const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const socketSlice = createSlice({
    name: "socket",
    initialState: {
     info:{}
    },
    reducers:{
        updateSocket(state, action){
            state.info = action.payload;
        }
    },
    extraReducers:{
    
    }
  });
  
  export default socketSlice;
  
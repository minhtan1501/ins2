let timeOutId;

const debounce = (fn , time) =>{
    return (...args) =>{
        if(timeOutId) clearTimeout(timeOutId);
        timeOutId = setTimeout(() =>{
            fn.apply(null, args);
        },time)
    }
}

export default debounce;
import { useDispatch, useSelector } from "react-redux";
import notifySlice from "../redux/slice/notifySlide";

export default function useNotify() {
  const { loading, type, msg } = useSelector((state) => state.notify);
  const dispatch = useDispatch();
  const setLoading = (state) => {
    dispatch(notifySlice.actions.changeLoading(state));
  };

  const setNotify = (type, msg) => {
    dispatch(notifySlice.actions.setNotify({ type, msg }));
  };

  const clearNotify = () => {
    dispatch(notifySlice.actions.clearNotify());
  };
  return { loading, type, msg, setLoading, setNotify, clearNotify };
}

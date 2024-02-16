import { useDispatch as useDispatchRedux, useSelector as useSelectorRedux } from 'react-redux';

import { Dispatch, RootState } from './store';

export const useDispatch = useDispatchRedux.withTypes<Dispatch>();

export const useSelector = useSelectorRedux.withTypes<RootState>()
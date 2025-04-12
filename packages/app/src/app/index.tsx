
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '../store';

import { router } from './router';

const App = () => (
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>     
);

export default App;

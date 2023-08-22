import {Route, Routes} from 'react-router-dom';

import MainPage from '../pages/MainPage';
import EditorPage from '../pages/EditorPage';

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/editor' element={<EditorPage />} />
        </Routes>        
    );
}

export default App;

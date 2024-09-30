import { BrowserRouter , Route , Routes} from 'react-router-dom'
import Register from './components/user/Register';
import Landing from './components/user/Landing';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route  path="/" element={<Landing />} />
        <Route path='/register' element={<Register />} />
       </Routes>
      </BrowserRouter>
    </div>
  );
}
//test
export default App;

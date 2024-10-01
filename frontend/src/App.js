import { BrowserRouter , Route , Routes} from 'react-router-dom'
import Register from './components/user/Register';
import Landing from './components/user/Landing';
import Home from './components/user/Home';
import Login from './components/admin/Login';
import Admin from './components/admin/Admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route  path="/" element={<Landing />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/admin/login' element={<Login/>} />
        <Route path='/admin' element={<Admin />} />
       </Routes>
      </BrowserRouter>
    </div>
  );
}
//test
export default App;

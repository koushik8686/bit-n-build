import { BrowserRouter , Route , Routes} from 'react-router-dom'
import Register from './components/user/Register';
import Landing from './components/user/Landing';
import Home from './components/user/Home';
import AdminLogin from './components/admin/Login';
import Admin from './components/admin/Admin';
import Login from './components/user/Login';
import Progress from './components/admin/Progress'
import Temp from './components/admin/Temp';
import AdAnalyticsDashboard from './components/admin/AdAnalytics';
//helo
function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route  path="/" element={<Landing />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/temp' element={<Temp />} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/ad/analytics/:id' element={<AdAnalyticsDashboard />} />
        <Route path='/progress/:startup' element={<Progress/>} />
       </Routes>
      </BrowserRouter>
    </div>
  );
}
//test
export default App;

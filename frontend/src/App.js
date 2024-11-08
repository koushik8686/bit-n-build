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
import ReviewerRegister from './components/reviewer/Register';
import ReviewerLogin from './components/reviewer/Login';
import ReviewerPage from './components/admin/ReviewerPage'
import NotFound from './components/NotFound';
import ReviewerDashboard from './components/reviewer/Homr';
import GrantsSelectReviewers from './components/admin/GrantsSelectReviewers'
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
        <Route path='/selectreviewers/:id' element={<ReviewerPage />} />
        <Route path='/grants/selectreviewers/:id' element={<GrantsSelectReviewers />} />
        <Route path='/ad/analytics/:id' element={<AdAnalyticsDashboard />} />
        <Route path='/progress/:startup' element={<Progress/>} />
        <Route path='/reviewer/register' element={<ReviewerRegister />} />
        <Route path='/reviewer/login' element={<ReviewerLogin />} />
        <Route path='/reviewer' element={<ReviewerDashboard />} />
        <Route path='*' element={<NotFound/>} />
       </Routes>
      </BrowserRouter>
    </div>
  );
}
//test
export default App;

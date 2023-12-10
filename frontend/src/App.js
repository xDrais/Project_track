import { lazy,Suspense  } from 'react';
import Login from './page/Login'
import {BrowserRouter as Router,Route,Routes,useNavigate} from 'react-router-dom';
import Register from './page/Register/register';
import Dashboard from './page/Dashboard';
import Navbarr from './Components/Navbar/navbar';
import Loader from './Components/Loader';
import Home from './page/Home/home';
import  { useEffect, useState } from "react";
import UpdateUser from './page/Modifyaccount/updateUser'
import { useDispatch , useSelector , } from "react-redux";
import axios from "axios";


import ReactGA from 'react-ga';



ReactGA.initialize('G-Y1V026ZHPY');


const ForgetPassword =lazy(() => import('./page/ForgetPassword'));
const ResetPassword = lazy(()=>import('./page/ResetPassword'))
const Profile = lazy(()=>import('./page/Profile'))

function App() {
  const userLogin = useSelector(state => state.userLogin)
    const {userInfo} =userLogin
    const isAdmin = localStorage.getItem('adminRole') === 'true';

  const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = `http://localhost:5000/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
      console.log(data.user)
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
    console.log(getUser())
	}, []);
useEffect(()=>
{
  ReactGA.pageview(window.location.pathname + window.location.search);
})

  return (

    <Suspense fallback={<Loader />}>
    <Router>
    {isAdmin ? (
    <Routes> 
    <Route path="/login" element={<> <Navbarr /> <Login/> </>} />
    <Route path="/register" element={<> <Navbarr /> <Register/> </>} />     
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/forget-password" element={<><Navbarr /> <ForgetPassword/> </>} />
    <Route path="/reset-password" element={<><Navbarr /><ResetPassword/> </>} />
    <Route path="/profile" element={<><Navbarr /> <Profile/> </>} />
    <Route path="/" element={<> <Home/> </>} />
    <Route path="/verify-email/:emailToken" element={<><Navbarr /><Login/> </>} />
    <Route path="/productdetail/:id">
  <Navbarr />

</Route>
    



    </Routes>
    
      
      ):(<Routes>
        <Route path="/login" element={<> <Navbarr /> <Login/></>} />
    <Route path="/register" element={<> <Navbarr /><Register/> </>} />     
    <Route path="/forget-password" element={ <> <Navbarr /><ForgetPassword/> </> } />
    <Route path="/reset-password" element={<> <Navbarr /> <ResetPassword/></>} />
    <Route path="/profile" element={<> <Navbarr /> <Profile/> </>} />
    <Route path="/" element={<><Home/></>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/userupdate" element={<> <Navbarr /> <UpdateUser /> </> } /> 

    <Route path="/verify-email/:emailToken" element={<><Navbarr /> <Login/> </>} />


        </Routes>)}
    </Router>
    
    </Suspense>

    
  );
}

export default App;

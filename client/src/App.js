// React & Material UI
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Redux store
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setProfile, setCompany } from './appSlice';

// Components
import TopBar from './components/TopBar';
import Gdpr from './components/Gdpr';

// Pages
import Landing from './pages/Landing';
import Privacy from './pages/info/Privacy';
import Terms from './pages/info/Terms';
import Beta from './pages/info/Beta';
import RenterInfo from './pages/info/Renter';
import RenteeInfo from './pages/info/Rentee';
import Application from './pages/application/Application'
import Apartment from './pages/apartments/Apartment';
import ApartmentsSearch from './pages/apartments/Search';
import LoginForm from './pages/LoginForm';
import Profile from './pages/Profile';
import Applications from './pages/company/Applications';
import CompanyApplication from './pages/company/Application';
import Company from './pages/company/Profile';
import Member from './pages/company/Member';
import NewApartment from './pages/company/Apartment';
import Apartments from './pages/company/Apartments';
import RegisterForm from './pages/registeration/RegisterForm';
import ActivationForm from './pages/registeration/ActivationForm';
import RecoveryRequestForm from './pages/recovery/RequestForm';
import RecoveryPasswordForm from './pages/recovery/PasswordForm';
import PaymentCancel from './pages/company/payment/Cancel';
import PaymentSuccess from './pages/company/payment/Success';
import IdRequest from './pages/application/IdRequest';


// Theme selection
import appTheme from './themes/AppTheme';

/**
 * Represents the root component of the application.
 * @function App
 * @returns {JSX.Element} The JSX element representing the App component.
 */
function App() {
  let dispatch = useDispatch();
  document.title = useSelector((state) => state.app.name);
  let token = useSelector((state) => state.app.token);
  let profile = useSelector((state) => state.app.profile);
  let company = useSelector((state) => state.app.company);

  /**
   * The effect hook for updating the token in the Redux store from local storage.
   * @function
   * @name useEffect
   * @param {Function} effect - The effect function to be executed.
   * @param {Array} deps - The dependencies array to control the effect's execution.
   * @returns {void}
   */
  useEffect(() => {
    let tmpToken = localStorage.getItem("token");
    if(tmpToken) {
      dispatch(setToken(tmpToken))
    } else {
      dispatch(setToken(undefined))
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // Don't know yet how to handle dispatch with useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  /**
   * The effect hook for fetching and updating the user profile and company information.
   * @function
   * @name useEffect
   * @param {Function} effect - The effect function to be executed.
   * @param {Array} deps - The dependencies array to control the effect's execution.
   * @returns {void}
   */
  useEffect(() => {
    const getProfile = async (token) => {
      let response = await fetch("/api/profiles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
      });
      let body = await response.json();
      if(!body.message) {
        dispatch(setProfile({
          ...profile,
          ...body,
          new: false,
        }));
      }
    }
    const getCompany = async(token) => {
      let response = await fetch("/api/companies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
      });
      let companies = await response.json();
      if (!companies.message) {
        console.log(companies);
        for (const companyArray of companies) {
          if (Array.isArray(companyArray) && companyArray.length > 0) {
            for (const company of companyArray) {
              if (company['_id'] !== undefined) { 
                dispatch(setCompany({
                  ...company,
                  new: false,
                }));
              }
            }
          }
        }
      }
    }
    if(token !== false) {
      localStorage.setItem("token", token);
      getProfile(token);
      getCompany(token);
    }
    // Don't know yet how to handle dispatch with useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Renders the main application layout with different routes.
   * @returns {JSX.Element} The JSX element representing the application layout.
   */
  return (
      <div className="App">
        <ThemeProvider theme={appTheme}>
            <TopBar />
            <Routes>
              <Route path="/" element={<Landing/>} />
              <Route path="/info/beta" element={<Beta/>} />
              <Route path="/info/renter" element={<RenterInfo/>} />
              <Route path="/info/rentee" element={<RenteeInfo/>} />
              <Route path="/info/privacy" element={<Privacy/>} />
              <Route path="/info/terms" element={<Terms/>} />
              <Route path="/application/:id" element={<Application/>} />
              <Route path="/application/id-request/:validation" element={<IdRequest />} />
              <Route path="/apartments/:id" element={<Apartment/>} />
              <Route path="/apartments/search" element={<ApartmentsSearch/>} />
              <Route path="/company" element={<Company/>} />
              <Route path="/company/applications/:id" element={<Applications/>} />
              <Route path="/company/application/:id" element={<CompanyApplication/>} />
              <Route path="/company/member" element={<Member/>} />
              <Route path="/company/apartments" element={<Apartments/>} />
              <Route path="/company/apartment" element={<NewApartment/>} />
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/register/" element={<RegisterForm/>} />
              <Route path="/register/:code" element={<RegisterForm/>} />
              <Route path="/register/activation" element={<ActivationForm/>} />
              <Route path="/recovery" element={<RecoveryRequestForm/>} />
              <Route path="/recovery/password" element={<RecoveryPasswordForm/>} />
              <Route path="/stripe-payment-failure" element={<PaymentCancel/>} />
              <Route path="/stripe-payment-success" element={<PaymentSuccess/>} />
            </Routes>
            <Gdpr />
        </ThemeProvider>
      </div>
  );
}

export default App;

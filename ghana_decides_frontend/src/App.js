import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Notification from './pages/Notification';
import SideNav from './components/SideNavigator';
import Search from './pages/Search';
import LatestResult from './pages/latest_results/LatestResult';
import LatestResultList from './pages/latest_results/LatestResultList';
import MapView from './pages/map/MapView';
import MapViewDetails from './pages/map/MapViewDetails';
import ChangesRegion from './pages/changes/ChangesRegion';
import ChangesRegionList from './pages/changes/ChangesRegionList';
import Top20Constituency from './pages/top_twenty/Top20Constituency';
import Top20ConstituencyList from './pages/top_twenty/Top20ConstituencyList';
import ElectionSummary from './pages/election_summary/ElectionSummary';
import ElectionSummaryChart from './pages/election_summary/ElectionSummaryChart';
import FinalResults from './pages/election_summary/FinalResults';
import LatestResultRegional from './pages/latest_results/LatestResultReginal';
import RegionDetails from './pages/latest_results/RegionDetails';
import PageNotFound from './pages/changes/PageNotFound';
import ListAllRegions from './data_admin/ListAllRegions';
import LoginPage from './pages/auth/Login';
import LoginDataAdmin from './data_admin/auth/Login/LoginDataAdmin';
import RegisterPage from './pages/auth/register';
import RegisterDataAdmin from './data_admin/auth/Register/RegisterDataAdmin';
import RegisterDataAdminPassword from './data_admin/auth/Register/RegisterDataAdminPassword';
import RegisterDataAdminIDCard from './data_admin/auth/Register/RegisterDataAdminIDCard';
import RegisterDataAdminVerify from './data_admin/auth/Register/RegisterDataAdminVerify';
import RegisterDataAdminResendVerify from './data_admin/auth/Register/RegisterDataAdminResendVerify';
import RegisterDataAdminSuccessful from './data_admin/auth/Register/RegisterDataAdminSuccessful';
import LoginPresenter from './presenter/auth/Login/LoginPresenter';
import ListAllRegionsSoc from './data_admin/Region/ListAllRegionsSoc';
import RegisterPresenter from './presenter/auth/Register/RegisterPresenter';
import RegisterPresenterIDCard from './presenter/auth/Register/RegisterPresenterIDCard';
import RegisterPresenterPassword from './presenter/auth/Register/RegisterPresenterPassword';
import RegisterPresenterResendVerify from './presenter/auth/Register/RegisterPresenterResendVerify';
import RegisterPresenterVerify from './presenter/auth/Register/RegisterPresenterVerify';
import RegisterPresenterSuccessful from './presenter/auth/Register/RegisterPresenterSuccessful';
import DataAdminDashboard from './data_admin/Dashboard/DataAdminDashboard';
import ListAllConstituenciesSoc from './data_admin/Constituency/ListAllConstituencySoc';
import ListAllElectoralAreaSoc from './data_admin/ElectoralArea/ListAllElectoralAreasSoc';
import ListAllPollingStationsSoc from './data_admin/PollingStation/ListAllPollingStationsSoc';
import ListAllPartiesSoc from './data_admin/Party/ListAllPartiesSoc';
import ListAllPresidentialCandidatesSoc from './data_admin/Candidate/ListAllPresidentailCandidatesSoc';
import ListAllParliamentaryCandidatesSoc from './data_admin/Candidate/ListAllParliamentaryCandidatesSoc';
import ListAllElectionsSoc from './data_admin/Elections/ListAllElectionsSoc';
import ElectionDetails from './data_admin/Elections/ElectionDetails';
import Election2024 from './data_admin/Elections/Election2024';
import PresenterDashboard from './presenter/dashboard/PresenterDashboard';
import Settings from './pages/Settings/Settings';

const App = () => {


  return (
    <Router>
      <div>
        <Routes>
          
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />


        <Route path="/login-data-admin" element={<LoginDataAdmin />} />
        <Route path="/login-presenter" element={<LoginPresenter />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/register-data-admin" element={<RegisterDataAdmin />} />
        <Route path="/register-data-admin-idcard" element={<RegisterDataAdminIDCard />} />
        <Route path="/register-data-admin-password" element={<RegisterDataAdminPassword />} />
        <Route path="/register-data-admin-Verify" element={<RegisterDataAdminVerify />} />
        <Route path="/register-data-admin-resend-Verify" element={<RegisterDataAdminResendVerify />} />
        <Route path="/register-data-admin-successful" element={<RegisterDataAdminSuccessful />} />


        <Route path="/register-presenter" element={<RegisterPresenter />} />
        <Route path="/register-presenter-idcard" element={<RegisterPresenterIDCard />} />
        <Route path="/register-presenter-password" element={<RegisterPresenterPassword />} />
        <Route path="/register-presenter-Verify" element={<RegisterPresenterVerify />} />
        <Route path="/register-presenter-resend-Verify" element={<RegisterPresenterResendVerify />} />
        <Route path="/register-presenter-successful" element={<RegisterPresenterSuccessful />} />



        <Route path="/data-admin-dashboard" element={<DataAdminDashboard />} />
        <Route path="/list-all-regions" element={<ListAllRegionsSoc />} />
        <Route path="/list-all-constituencies" element={<ListAllConstituenciesSoc />} />
        <Route path="/list-all-electoral-areas" element={<ListAllElectoralAreaSoc />} />
        <Route path="/list-all-polling-stations" element={<ListAllPollingStationsSoc />} />

        <Route path="/list-all-parties" element={<ListAllPartiesSoc />} />

        <Route path="/list-all-presidential-candidates" element={<ListAllPresidentialCandidatesSoc />} />
        <Route path="/list-all-parliamentary-candidates" element={<ListAllParliamentaryCandidatesSoc />} />

        <Route path="/list-all-elections" element={<ListAllElectionsSoc />} />
        <Route path="/election-details/:election_id" element={<ElectionDetails />} />

        <Route path="/election-2024" element={<Election2024 />} />



        <Route path="/presenter-dashboard" element={<PresenterDashboard />} />





          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/latest-results" element={<LatestResult />} />
          <Route path="/region-details/:region_id" element={<RegionDetails />} />

          <Route path="/latest-results-list" element={<LatestResultList />} />
          <Route path="/latest-results-regional" element={<LatestResultRegional />} />

          <Route path="/map-view" element={<MapView />} />
          <Route path="/map-view-details" element={<MapViewDetails />} />

          <Route path="/changes-region" element={<ChangesRegion />} />
          <Route path="/changes-region-list" element={<ChangesRegionList />} />


          <Route path="/top-20-constituencies" element={<Top20Constituency />} />
          <Route path="/top-20-constituencies-list" element={<Top20ConstituencyList />} />

          <Route path="/election-summary" element={<ElectionSummary />} />

          <Route path="/election-summary-chart" element={<ElectionSummaryChart />} />

          <Route path="/final-result" element={<FinalResults />} />


          <Route path="/400" element={<PageNotFound />} />


          {/* DATA ADMIN PAGES*/}

          <Route path="/all-regions" element={<ListAllRegions />} />



          

        </Routes>
      </div>
    </Router>
  );
};

export default App;


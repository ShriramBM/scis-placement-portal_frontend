import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/student/Register'
import './App.css'
import StudentDashboard from './pages/student/StudentDashboard'
import StreamDashboard from './pages/stream/StreamDashboard.tsx'
import Layout from './components/Layout'
import StudentProfile from './pages/student/StudentProfile'
import MyApplications from './pages/student/MyApplications'
import Applicants from './pages/stream/Applicants'
import Students from './pages/stream/Students'
import StreamLayout from './pages/stream/StreamLayout'
import CoordinatorLayout from './pages/pc/CoordinatorLayout'
import ApplicationsReview from './pages/pc/ApplicationsReview'
import StudentManagement from './pages/pc/StudentManagment'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
  path="/student"
  element={
    <Layout>
      <StudentDashboard />
    </Layout>
  }
/>

<Route
  path="/student/profile"
  element={
    <Layout>
      <StudentProfile />
    </Layout>
  }
/>
 
<Route
  path="/student/applications"
  element={
    <Layout>
      <MyApplications />
    </Layout>
  }
/>
    <Route path="/stream" element={<StreamLayout />}>
     <Route index element={<StreamDashboard />} />
    <Route path="applicants" element={<Applicants />} />
    <Route path="students" element={<Students />} />
    </Route>

<Route path="/coordinator" element={<CoordinatorLayout />}>
  <Route index element={<ApplicationsReview />} />
  <Route path="management" element={<StudentManagement />} />
</Route> 

    </Routes>
  )
}

export default App

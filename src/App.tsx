import { Routes, Route } from 'react-router-dom';
import CoursePage from './CoursePage';
import AllCoursesPage from './LandingPage'; // your dummy page

function App() {
  return (
    
      <Routes>
        {/* Home route — shows the CoursePage */}
        <Route path="/" element={<CoursePage />} />

        {/* All Courses route — shows the dummy AllCoursesPage */}
        <Route path="/all-courses" element={<AllCoursesPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    
  );
}

export default App;

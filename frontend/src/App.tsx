import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import QuestionPage from './pages/QuestionPage';
import DailyQuestion from './pages/DailyQuestion';
import Areas from './pages/Areas';
import Performance from './pages/Performance';
import Achievements from './pages/Achievements';
import Missions from './pages/Missions';
import Simulados from './pages/Simulados';
import Profile from './pages/Profile';
import Codex from './pages/Codex';
import Reviews from './pages/Reviews';
import Coach from './pages/Coach';
import LibraryPage from './pages/Library';
import LibraryTopicPage from './pages/LibraryTopicPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="questions" element={<Questions />} />
          <Route path="questions/:id" element={<QuestionPage />} />
          <Route path="daily" element={<DailyQuestion />} />
          <Route path="areas" element={<Areas />} />
          <Route path="performance" element={<Performance />} />
          <Route path="missions" element={<Missions />} />
          <Route path="simulados" element={<Simulados />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
          <Route path="codex" element={<Codex />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="coach" element={<Coach />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="library/:id" element={<LibraryTopicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

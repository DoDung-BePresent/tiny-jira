/**
 * Node modules
 */
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**
 * Layouts
 */
import { MainLayout } from '@/layouts/MainLayout';

/**
 * Pages
 */
import { BoardPage } from '@/pages/board/BoardPage';
import { ProjectSettingsPage } from '@/pages/project-settings/ProjectSettingsPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/project/board" replace />} />
          <Route
            path="project"
            element={<Navigate to="/project/board" replace />}
          />
          <Route path="project">
            <Route path="board" element={<BoardPage />} />
            <Route path="board/issue/:issueId" element={<BoardPage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

import { Link, Route, Routes } from 'react-router';
import { ArchiveButton } from './components/ArchiveButton';
import { BuildStatusBanner } from './components/BuildStatusBanner';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true" />
            Principia
          </Link>
          <div className="topbar-actions">
            <ArchiveButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <BuildStatusBanner />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

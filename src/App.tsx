import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { LearningPathsView } from './views/LearningPathsView';
import { CoursesView } from './views/CoursesView';
import { LessonsView } from './views/LessonsView';
import { CyberLabsView } from './views/CyberLabsView';
import { CtfArenaView } from './views/CtfArenaView';
import { MissionsView } from './views/MissionsView';
import { RedTeamView } from './views/RedTeamView';
import { BlueTeamView } from './views/BlueTeamView';
import { SiemDashboardView } from './views/SiemDashboardView';
import { IdsLearningView } from './views/IdsLearningView';
import { NetworkAnalyzerView } from './views/NetworkAnalyzerView';
import { PacketAnalyzerView } from './views/PacketAnalyzerView';
import { DigitalForensicsView } from './views/DigitalForensicsView';
import { ThreatIntelView } from './views/ThreatIntelView';
import { ProgressTrackingView } from './views/ProgressTrackingView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AboutView } from './views/AboutView';
import { HelpDocsView } from './views/HelpDocsView';

function CyberNexusApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedModuleNum, setSelectedModuleNum] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('mod1-les1');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (modNum: number) => {
    setSelectedModuleNum(modNum);
    setSelectedLessonId(`mod${modNum}-les1`);
    setCurrentView('lessons');
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onSelectLesson={(id) => { setSelectedLessonId(id); handleNavigate('lessons'); }} />;
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'paths':
        return <LearningPathsView onNavigate={handleNavigate} />;
      case 'courses':
        return <CoursesView onSelectModule={handleSelectModule} onNavigate={handleNavigate} />;
      case 'lessons':
        return <LessonsView initialLessonId={selectedLessonId} onNavigate={handleNavigate} />;
      case 'labs':
        return <CyberLabsView />;
      case 'ctf':
        return <CtfArenaView />;
      case 'missions':
        return <MissionsView />;
      case 'redteam':
        return <RedTeamView onNavigate={handleNavigate} />;
      case 'blueteam':
        return <BlueTeamView onNavigate={handleNavigate} />;
      case 'siem':
        return <SiemDashboardView />;
      case 'ids':
        return <IdsLearningView />;
      case 'network':
        return <NetworkAnalyzerView />;
      case 'packet':
        return <PacketAnalyzerView />;
      case 'forensics':
        return <DigitalForensicsView />;
      case 'threatintel':
        return <ThreatIntelView />;
      case 'progress':
        return <ProgressTrackingView />;
      case 'achievements':
        return <AchievementsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'help':
        return <HelpDocsView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <CyberNexusApp />
      </ProgressProvider>
    </ThemeProvider>
  );
}

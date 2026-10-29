import React, { useState } from 'react';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/Layout';
import HomeView from './views/Home';
import DashboardView from './views/Dashboard';
import PomodoroView from './views/Pomodoro';
import HabitsView from './views/Habits';
import ChatView from './views/Chat';

const AppContent = () => {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView setView={setView} />;
      case 'dashboard':
        return <DashboardView setView={setView} />;
      case 'pomodoro':
        return <PomodoroView />;
      case 'habits':
        return <HabitsView />;
      case 'chat':
        return <ChatView />;
      default:
        return <HomeView setView={setView} />;
    }
  };

  return (
    <Layout view={view} setView={setView}>
      {renderView()}
    </Layout>
  );
};

const App = () => {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout.tsx';
import PlayerLayout from './layouts/PlayerLayout.tsx';
import GridViewPage from './pages/GridViewPage.tsx';
import ListViewPage from './pages/ListViewPage.tsx';
import Search from './pages/Search.tsx';
import Player from './pages/Player.tsx';
import SettingPage from './pages/SettingPage.tsx';
import { VersionProvider } from './contexts/VersionContext.tsx';
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import HomePage from './pages/HomePage.tsx';
import Radio from './pages/Radio.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout type="home" scrollbar={true} paddingX={false} paddingB={true} />}>
        <Route element={<PlayerLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            type="curation"
            title="채널 명"
            scrollbar={true}
            paddingX={true}
            paddingB={true}
          />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="episodes/channel/:id" element={<ListViewPage type="channel" />} />
          <Route path="episodes/timeslot/:id" element={<ListViewPage type="timeslot" />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            type="curation"
            title="큐레이션 명"
            scrollbar={true}
            paddingX={false}
            paddingB={true}
          />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="curation/:id" element={<GridViewPage />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout type="search" title="검색" scrollbar={true} paddingX={true} paddingB={true} />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="search" element={<Search />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            type="curation"
            title="지금 재생 중"
            scrollbar={false}
            paddingX={false}
            paddingB={false}
            isPlayer={true}
          />
        }
      >
        <Route path="/player/:id" element={<Player />} />
      </Route>

      <Route
        element={
          <Layout type="setting" title="설정" scrollbar={false} paddingX={false} paddingB={false} />
        }
      >
        <Route path="setting" element={<SettingPage />} />
      </Route>

      <Route element={<Layout type="radio" scrollbar={true} paddingX={false} paddingB={true} />}>
        <Route element={<PlayerLayout />}>
          <Route path="radio" element={<Radio />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <VersionProvider>
        <PlayerProvider>
          <AppRoutes />
        </PlayerProvider>
      </VersionProvider>
    </BrowserRouter>
  );
}

export default App;

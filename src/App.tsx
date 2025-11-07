import { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext.tsx';
import { useVersion, VersionProvider } from './contexts/VersionContext.tsx';
import Layout from './layouts/Layout.tsx';
import PlayerLayout from './layouts/PlayerLayout.tsx';
import CategoryAndRadioPage from './pages/CategoryAndRadioPage.tsx';
import GridViewPage from './pages/GridViewPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ListViewPage from './pages/ListViewPage.tsx';
import Player from './pages/Player.tsx';
import Radio from './pages/Radio.tsx';
import RecentPage from './pages/RecentPage.tsx';
import Search from './pages/Search.tsx';
import SettingPage from './pages/SettingPage.tsx';

function AppRoutes() {
  const location = useLocation();
  const { isRadioVersion, isLiveVersion } = useVersion();
  const { resetPlayer } = usePlayer();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    resetPlayer();
  }, [isRadioVersion, isLiveVersion, resetPlayer]);

  useEffect(() => {
    toast.dismiss();
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        element={<Layout defaultType="home" scrollbar={true} paddingX={false} paddingB={true} />}
      >
        <Route element={<PlayerLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Route>

      <Route
        element={<Layout defaultType="curation" scrollbar={true} paddingX={true} paddingB={true} />}
      >
        <Route element={<PlayerLayout />}>
          <Route path="episodes/channel/:id" element={<ListViewPage type="channel" />} />
          <Route path="episodes/timeslot/:id" element={<ListViewPage type="timeslot" />} />
          <Route path="episodes/series/:id" element={<ListViewPage type="series" />} />
          <Route path="episodes/podcasts/:id" element={<ListViewPage type="podcast" />} />
        </Route>
      </Route>

      <Route element={<Layout scrollbar={true} paddingX={false} paddingB={true} />}>
        <Route element={<PlayerLayout />}>
          <Route path="curation/:id" element={<GridViewPage />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            defaultType="search"
            defaultTitle="검색"
            scrollbar={true}
            paddingX={true}
            paddingB={true}
          />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="search" element={<Search />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            defaultType="curation"
            defaultTitle="지금 재생 중"
            scrollbar={false}
            paddingX={false}
            paddingB={false}
            isPlayer={true}
          />
        }
      >
        <Route path="/player/:id" element={<Player />} />
        <Route path="/player/podcasts/:id" element={<Player />} />
      </Route>

      <Route
        element={
          <Layout
            defaultType="setting"
            defaultTitle="설정"
            scrollbar={false}
            paddingX={false}
            paddingB={false}
          />
        }
      >
        <Route path="setting" element={<SettingPage />} />
      </Route>

      <Route
        element={<Layout defaultType="radio" scrollbar={true} paddingX={false} paddingB={true} />}
      >
        <Route element={<PlayerLayout />}>
          <Route path="radio" element={<Radio />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            defaultType={isRadioVersion ? 'radio' : 'home'}
            scrollbar={true}
            paddingX={false}
            paddingB={true}
          />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="category-radio" element={<CategoryAndRadioPage />} />
        </Route>
      </Route>

      <Route
        element={<Layout defaultType="home" scrollbar={true} paddingX={false} paddingB={true} />}
      >
        <Route element={<PlayerLayout />}>
          <Route path="/episodes/recent" element={<RecentPage />} />
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

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
import Player from './pages/Player.tsx';
import Radio from './pages/Radio.tsx';
import RecentPage from './pages/RecentPage.tsx';
import Search from './pages/Search.tsx';
import SettingPage from './pages/SettingPage.tsx';
import PopularChannelPage from './pages/PopularChannelPage.tsx';
// import LikedChannelViewPage from './pages/LikedChannelViewPage.tsx';
// import LikedChannelPage from './pages/LikedChannelPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSaveProgressOnNavigate } from './hooks/useSaveProgressOnNavigate.tsx';
import PicklePickTemplate from './pages/PicklePickTemplate.tsx';
import SettingFunction from './pages/SettingFunction.tsx';
import SettingDemo from './pages/SettingDemo.tsx';
import Preference from './pages/Preference.tsx';
import { OEMProvider } from './contexts/OEMContext.tsx';
import { PreferenceProvider } from './contexts/PreferenceContext.tsx';
import { ZoomProvider } from './contexts/ZoomContext.tsx';
import ChannelDetailViewPage from './pages/ChannelDetailViewPage.tsx';
import AIPick from './pages/AIPick.tsx';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10분 동안 캐시 데이터 재사용
      gcTime: 1000 * 60 * 20, // 20분 동안 메모리에 유지
      retry: 1, // 실패 시 1번 재시도
    },
  },
});

function AppRoutes() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRadioVersion, isLiveVersion } = useVersion();
  const { resetPlayer } = usePlayer();

  const isFirstRender = useRef(true);

  useSaveProgressOnNavigate();

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
          <Route path="episodes/:type/:id" element={<PicklePickTemplate />} />
        </Route>
      </Route>

      {/*}
      <Route element={<Layout scrollbar={true} paddingX={true} paddingB={true} />}>
        <Route element={<PlayerLayout />}>
          <Route path="liked-channels" element={<LikedChannelPage />} />
        </Route>
      </Route>
      */}

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
        <Route path="/player/:id/live" element={<Player />} />
        <Route path="/player/podcasts/:id" element={<Player />} />
      </Route>

      <Route
        element={<Layout defaultType="curation" scrollbar={true} paddingX={true} paddingB={true} />}
      >
        <Route element={<PlayerLayout />}>
          <Route path="/channel-detail/:id" element={<ChannelDetailViewPage />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            defaultType="setting"
            defaultTitle={t('header.setting')}
            scrollbar={false}
            paddingX={false}
            paddingB={false}
          />
        }
      >
        <Route path="setting" element={<SettingPage />} />
        <Route path="setting/function" element={<SettingFunction />} />
        <Route path="setting/demo" element={<SettingDemo />} />
        <Route path="setting/preference" element={<Preference />} />
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
          <Route path="/ai-pick" element={<AIPick />} />
          <Route path="/popular" element={<PopularChannelPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ZoomProvider>
          <VersionProvider>
            <OEMProvider>
              <PreferenceProvider>
                <PlayerProvider>
                  <AppRoutes />
                </PlayerProvider>
              </PreferenceProvider>
            </OEMProvider>
          </VersionProvider>
        </ZoomProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

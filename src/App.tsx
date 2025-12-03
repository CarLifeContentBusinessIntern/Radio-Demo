import { lazy, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext.tsx';
import { useVersion, VersionProvider } from './contexts/VersionContext.tsx';
import Layout from './layouts/Layout.tsx';
import PlayerLayout from './layouts/PlayerLayout.tsx';

const CategoryAndRadioPage = lazy(() => import('./pages/CategoryAndRadioPage.tsx'));
const RecentPage = lazy(() => import('./pages/RecentPage.tsx'));
const AIPick = lazy(() => import('./pages/AIPick.tsx'));
const Search = lazy(() => import('./pages/Search.tsx'));
const SettingPage = lazy(() => import('./pages/SettingPage.tsx'));
const SettingFunction = lazy(() => import('./pages/SettingFunction.tsx'));
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const GridViewPage = lazy(() => import('./pages/GridViewPage.tsx'));
const Player = lazy(() => import('./pages/Player.tsx'));
const Radio = lazy(() => import('./pages/Radio.tsx'));
const PopularChannelPage = lazy(() => import('./pages/PopularChannelPage.tsx'));
const PicklePickTemplate = lazy(() => import('./pages/PicklePickTemplate.tsx'));
const SettingDemo = lazy(() => import('./pages/SettingDemo.tsx'));
const Preference = lazy(() => import('./pages/Preference.tsx'));
const ChannelDetailViewPage = lazy(() => import('./pages/ChannelDetailViewPage.tsx'));
const ListViewPage = lazy(() => import('./pages/ListViewPage.tsx'));
const PickleLivePage = lazy(() => import('./pages/PickleLivePage.tsx'));
const VoiceSearch = lazy(() => import('./pages/VoiceSearch.tsx'));
const AudioDramaPage = lazy(() => import('./pages/AudioDramaPage.tsx'));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSaveProgressOnNavigate } from './hooks/useSaveProgressOnNavigate.tsx';
import { OEMProvider } from './contexts/OEMContext.tsx';
import { PreferenceProvider } from './contexts/PreferenceContext.tsx';
import { ZoomProvider } from './contexts/ZoomContext.tsx';
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

  useEffect(() => {
    const highPriorityTimer = setTimeout(() => {
      import('./pages/Player.tsx');
      import('./pages/Radio.tsx');
      import('./pages/RecentPage.tsx');
      import('./pages/AIPick.tsx');

      const img1 = new Image();
      img1.src = new URL('./assets/ai_pick_banner_background.png', import.meta.url).href;
      const img2 = new Image();
      img2.src = new URL('./assets/ai_pick_banner_icon.png', import.meta.url).href;
      const img3 = new Image();
      img3.src = new URL('./assets/ai_pick_banner_background_after.png', import.meta.url).href;
      const img4 = new Image();
      img4.src = new URL('./assets/ai_pick_banner_dailymix_after.png', import.meta.url).href;
    }, 2000);

    const mediumPriorityTimer = setTimeout(() => {
      import('./pages/Search.tsx');
      import('./pages/ChannelDetailViewPage.tsx');
    }, 4000);

    return () => {
      clearTimeout(highPriorityTimer);
      clearTimeout(mediumPriorityTimer);
    };
  }, []);

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
        element={
          <Layout defaultType="curation" scrollbar={true} paddingX={false} paddingB={true} />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="episodes/:type/:id" element={<ListViewPage />} />
          <Route path="episodes/:type/:id/rectangle" element={<PicklePickTemplate />} />
        </Route>
      </Route>

      <Route element={<Layout scrollbar={false} paddingX={false} paddingB={false} />}>
        <Route path="player/live" element={<PickleLivePage />} />
        <Route path="ai-pick/voice-search" element={<VoiceSearch />} />
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
      <Route element={<Layout scrollbar={true} paddingX={false} paddingB={true} />}>
        <Route element={<PlayerLayout />}>
          <Route path="/audio-drama" element={<AudioDramaPage />} />
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

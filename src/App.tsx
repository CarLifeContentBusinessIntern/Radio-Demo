import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import PlayerLayout from "./layouts/PlayerLayout.tsx";
import GridViewPage from "./pages/GridViewPage.tsx";
import Home from "./pages/Home.tsx";
import ListViewPage from "./pages/ListViewPage.tsx";
import Search from "./pages/Search.tsx";
import Player from "./pages/Player.tsx";
import SettingPage from "./pages/SettingPage.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <Layout
            type="home"
            scrollbar={true}
            paddingX={false}
            paddingB={true}
          />
        }
      >
        <Route element={<PlayerLayout />}>
          <Route path="/" element={<Home />} />
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
          <Route path="channels/detail" element={<ListViewPage />} />
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
          <Route path="curation" element={<GridViewPage />} />
        </Route>
      </Route>

      <Route
        element={
          <Layout
            type="curation"
            title="검색"
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
            type="curation"
            title="지금 재생 중"
            scrollbar={false}
            paddingX={false}
            paddingB={false}
          />
        }
      >
        {" "}
        <Route path="/player/:id" element={<Player />} />
      </Route>

      <Route
        element={
          <Layout
            type="curation"
            title="설정"
            scrollbar={false}
            paddingX={false}
            paddingB={false}
          />
        }
      >
        <Route path="setting" element={<SettingPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout.tsx";
import PlayerLayout from "./layouts/PlayerLayout.tsx";
import GridViewPage from "./pages/GridViewPage.tsx";
import Home from "./pages/Home.tsx";
import ListViewPage from "./pages/ListViewPage.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout type="home" />}>
        <Route element={<PlayerLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      <Route element={<Layout type="curation" title="채널 명" />}>
        <Route element={<PlayerLayout />}>
          <Route path="/channels/detail" element={<ListViewPage />} />
        </Route>
      </Route>

      <Route element={<Layout type="curation" title="큐레이션 명" />}>
        <Route element={<PlayerLayout />}>
          <Route path="curation" element={<GridViewPage />} />
        </Route>
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

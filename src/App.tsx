import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Home from "./pages/Home.tsx";
import ListViewPage from "./pages/ListViewPage.tsx";
import PlayerLayout from "./layouts/PlayerLayout.tsx";
import Layout from "./layouts/Layout.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout type="home" />}>
        <Route path="/" element={<Home />} />

        <Route element={<PlayerLayout />}>
          <Route path="/channels/detail" element={<ListViewPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

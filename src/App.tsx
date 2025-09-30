import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Home from "./pages/Home.tsx";
import ListViewPage from "./pages/ListViewPage.tsx";
import PlayerLayout from "./layouts/PlayerLayout.tsx";
import ScrollbarLayout from "./layouts/ScrollbarLayout.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ScrollbarLayout />}>
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

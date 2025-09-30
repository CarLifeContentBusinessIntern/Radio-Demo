import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Home from "./pages/Home.tsx";
import Layout from "./components/Layout.tsx";
import GridViewPage from "./pages/GridViewPage.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout type="home"><Home /></Layout>} />
      <Route path="/curation" element={<Layout type="curation" title="큐레이션 명"><GridViewPage /></Layout>} />
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

import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/home"));
const Project = lazy(() => import("./pages/project"));
const NotFound = lazy(() => import("./pages/not-found"));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div>Loading resources...</div>
          </div>
        }
      >
        <Routes>
          <Route index element={<Home />} />
          <Route path="projects/:project" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

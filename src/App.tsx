import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Grammar from "./pages/Grammar";
import Lesson from "./pages/Lesson";
import Vocab from "./pages/Vocab";
import PlacementTest from "./pages/PlacementTest";
import PlacementIntro from "./pages/PlacementIntro";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import ProgressPage from "./pages/ProgressPage";
import Saved from "./pages/Saved";
import Admin from "./pages/Admin";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/grammar" element={<Grammar />} />
                <Route path="/lesson/:slug" element={<Lesson />} />
                <Route path="/vocab" element={<Vocab />} />
                <Route path="/test" element={<PlacementTest />} />
                <Route path="/placement-test" element={<PlacementIntro />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/saved" element={<Saved />} />

                <Route path="/admin" element={<Admin />} />
                <Route path="/legal/:kind" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

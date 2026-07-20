import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingProvider } from "@/lib/loading-context";

import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";
import { WriterPanel } from "./pages/WriterPanel";
import NotFound from "./pages/NotFound";
import YouTube from "./pages/Videos";  // Updated import name
import Ask from "./pages/Ask";
import Questions from "./pages/Questions";
import QuestionDetail from "@/pages/QuestionDetail";
import VideoDetail from './pages/VideoDetail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/videos" element={<YouTube />} />  {/* Updated route component */}
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/writer-panel" element={<WriterPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LoadingProvider>
  </QueryClientProvider>
);

export default App;

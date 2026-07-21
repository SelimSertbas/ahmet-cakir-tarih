import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingProvider } from "@/lib/loading-context";
import { Loading } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RequireAuth from "@/components/RequireAuth";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Articles = lazy(() => import("./pages/Articles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Login = lazy(() => import("./pages/Login"));
const WriterPanel = lazy(() => import("./pages/WriterPanel").then((m) => ({ default: m.WriterPanel })));
const NotFound = lazy(() => import("./pages/NotFound"));
const Videos = lazy(() => import("./pages/Videos"));
const Ask = lazy(() => import("./pages/Ask"));
const Questions = lazy(() => import("./pages/Questions"));
const QuestionDetail = lazy(() => import("./pages/QuestionDetail"));
const VideoDetail = lazy(() => import("./pages/VideoDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/videos/:id" element={<VideoDetail />} />
                  <Route path="/ask" element={<Ask />} />
                  <Route path="/questions" element={<Questions />} />
                  <Route path="/questions/:id" element={<QuestionDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/writer-panel"
                    element={
                      <RequireAuth>
                        <WriterPanel />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;

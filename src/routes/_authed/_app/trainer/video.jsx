import { createFileRoute } from "@tanstack/react-router";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import VideoAnalyzer from "@/components/trainer/VideoAnalyzer";

export const Route = createFileRoute("/_authed/_app/trainer/video")({
  head: () => ({ meta: [{ title: "Video form analysis — VITALIQ AI" }] }),
  component: VideoAnalysisPage,
});

function VideoAnalysisPage() {
  return (
    <div className="space-y-4">
      <SubPageHeader subtitle="AI personal trainer" title="Video form analysis" />
      <VideoAnalyzer />
    </div>
  );
}
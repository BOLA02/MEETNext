// app/dashboard/meetings/page.tsx
import MeetingBar from "@/components/meeting/MeetingBar"
import MeetingSection from "@/components/meeting/MeetingsSection"

export default function MeetingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <MeetingBar />
      <MeetingSection />
    </div>
  )
}

import { Header } from "@/components/Header";
import { TutorWidget } from "@/components/tutor/TutorWidget";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <TutorWidget />
    </>
  );
}

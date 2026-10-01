import StudyHeader from "./StudyHeader";

const StudyLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <StudyHeader />
    <main>{children}</main>
  </div>
);

export default StudyLayout;
import SubjectHeader from "./SubjectHeader";

const SubjectLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <SubjectHeader />
    <main>{children}</main>
  </div>
);

export default SubjectLayout;

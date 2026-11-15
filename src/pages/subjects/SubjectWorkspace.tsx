import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getSubject } from "@/content/subjects/registry";
import { SubjectProvider } from "@/components/subject/SubjectContext";
import SubjectLayout from "@/components/subject/SubjectLayout";
import { Button } from "@/components/ui/button";
import SubjectPracticePage from "./SubjectPracticePage";
import SubjectChapterPage from "./SubjectChapterPage";
import SubjectIndexPage from "./SubjectIndexPage";
import SubjectProgressPage from "./SubjectProgressPage";
import SubjectPlanchePage from "./SubjectPlanchePage";
import SubjectFormulairePage from "./SubjectFormulairePage";
import SubjectAssignmentsPage from "./SubjectAssignmentsPage";
import SubjectResourcesPage from "./SubjectResourcesPage";
import SubjectBonusPage from "./SubjectBonusPage";
import SubjectExercisePage from "./SubjectExercisePage";
import SubjectKhollesPage from "./SubjectKhollesPage";
import SubjectKholleSimPage from "./SubjectKholleSimPage";

const SubjectWorkspace = () => {
  const { slug = "" } = useParams();
  const subject = getSubject(slug);

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Foro Agora</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-foreground">Classe introuvable</h1>
        <p className="mt-2 text-sm text-muted-foreground">Cet espace d'exercices n'existe pas encore.</p>
        <Button asChild className="mt-6">
          <Link to="/classes"><ArrowLeft className="h-4 w-4" /> Voir toutes les classes</Link>
        </Button>
      </div>
    );
  }

  return (
    <SubjectProvider subject={subject}>
      <SubjectLayout>
        <Routes>
          <Route index element={<SubjectPracticePage />} />
          <Route path="chapitre/:chapterId" element={<SubjectChapterPage />} />
          <Route path="chapitre/:chapterId/:tab" element={<SubjectChapterPage />} />
          <Route path="index" element={<SubjectIndexPage />} />
          <Route path="progression" element={<SubjectProgressPage />} />
          <Route path="planche" element={<SubjectPlanchePage />} />
          <Route path="formulaire" element={<SubjectFormulairePage />} />
          <Route path="devoirs" element={<SubjectAssignmentsPage />} />
          <Route path="devoirs/:dmId" element={<SubjectAssignmentsPage />} />
          <Route path="ressources" element={<SubjectResourcesPage />} />
          <Route path="ressources/bonus" element={<SubjectBonusPage />} />
          <Route path="ressources/bonus/:sheetId" element={<SubjectBonusPage />} />
          <Route path="exo/:uid" element={<SubjectExercisePage />} />
          {subject.features.kholles && <Route path="kholles" element={<SubjectKhollesPage />} />}
          {subject.features.kholleSimulator && <Route path="simulateur" element={<SubjectKholleSimPage />} />}
          <Route path="*" element={<Navigate to={`/classes/${subject.slug}`} replace />} />
        </Routes>
      </SubjectLayout>
    </SubjectProvider>
  );
};

export default SubjectWorkspace;

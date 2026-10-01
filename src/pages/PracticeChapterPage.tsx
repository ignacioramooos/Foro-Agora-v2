import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getChapter } from "@/content/math";
import MathText from "@/components/math/MathText";

const PracticeChapterPage = () => {
  const { id = "" } = useParams();
  const chapter = getChapter(id);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link to="/practica" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver a la práctica
        </Link>

        {!chapter ? (
          <p className="text-muted-foreground">Capítulo no encontrado.</p>
        ) : (
          <>
            <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Capítulo {chapter.number}</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-1">{chapter.title}</h1>
            <p className="mt-3 text-muted-foreground">{chapter.summary}</p>

            {chapter.notes?.length ? (
              <div className="mt-8 space-y-4">
                {chapter.notes.map((n, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <MathText text={n} className="text-foreground" />
                  </div>
                ))}
              </div>
            ) : null}

            {chapter.pdfUrl && (
              <div className="mt-8">
                <a href={chapter.pdfUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-heading font-semibold text-primary-foreground">
                  <FileText className="h-4 w-4" /> Abrir documento de la clase
                </a>
                <iframe src={chapter.pdfUrl} title={chapter.title} className="mt-4 w-full h-[75vh] rounded-2xl border border-border hidden sm:block" />
              </div>
            )}

            <p className="mt-10 text-sm text-muted-foreground">{chapter.exercises.length} ejercicios en este capítulo.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PracticeChapterPage;

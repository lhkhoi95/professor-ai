"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfessor } from "@/lib/actions";

export default function ProfessorReviewDialog({
  professorData,
  isOpen,
  onOpenChange,
}) {
  const summary = professorData.analysis.summary;
  const pros = professorData.analysis.pros;
  const cons = professorData.analysis.cons;
  const { replace, prefetch } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveProfessor(professorData);
      onOpenChange(false);
      prefetch("/bookmarks");
      replace(`/bookmarks?added=true`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <div className="flex items-center">
        <DialogContent className="scrollbar h-[95%] max-w-3xl overflow-auto text-sm leading-relaxed">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold">
              {professorData.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              Here is the summary of the professor
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {detailBlock("Department", professorData.department)}
            {detailBlock("School", professorData.school)}
            {detailBlock(
              "Difficulty Level",
              professorData.difficultyLevel + " / 5"
            )}
            {detailBlock("Would Take Again", professorData.wouldTakeAgain)}
          </div>
          {analysisBlock(
            summary,
            pros,
            cons,
            professorData.analysis.recommendation
          )}
          <DialogFooter className="flex flex-row items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}

function detailBlock(title, content) {
  return (
    <div className="flex flex-row flex-wrap justify-between">
      <p className="text-right font-bold">{title}:</p>
      <p>{content || "N/A"}</p>
    </div>
  );
}

export function analysisBlock(summary, pros, cons, recommendation) {
  return (
    <div className="prose my-4 text-sm">
      <p>{summary}</p>

      {pros.length > 0 && (
        <h1 className="my-1 font-bold text-green-600">Pros:</h1>
      )}
      <ul className="list-disc pl-6">
        {pros.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {cons.length > 0 && (
        <h1 className="my-1 font-bold text-red-600">Cons:</h1>
      )}
      <ul className="list-disc pl-6">
        {cons.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      {recommendation && (
        <>
          <h1 className="my-1 font-bold text-orange-600">Recommendation:</h1>
          <p>{recommendation}</p>
        </>
      )}
    </div>
  );
}

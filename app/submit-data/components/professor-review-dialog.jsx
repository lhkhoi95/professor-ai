import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfessorReviewDialog({
  professorData,
  isOpen,
  onOpenChange,
}) {
  const summary = professorData.analysis.summary;
  const pros = professorData.analysis.pros;
  const cons = professorData.analysis.cons;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen max-w-3xl overflow-auto md:h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">
            Professor Review
          </DialogTitle>
          <DialogDescription className="text-center">
            Here is the summary of the professor
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {detailBlock("Name", professorData.name)}
          {detailBlock("Department", professorData.department)}
          {detailBlock("School", professorData.school)}
          {detailBlock("Difficulty Level", professorData.difficultyLevel)}
          {detailBlock("Would Take Again", professorData.wouldTakeAgain)}
        </div>
        {analysisBlock(summary, pros, cons)}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got It!</Button>
        </DialogFooter>
      </DialogContent>
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

function analysisBlock(summary, pros, cons) {
  return (
    <div className="prose my-4">
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
    </div>
  );
}

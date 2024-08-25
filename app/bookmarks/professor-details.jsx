import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Building2, Repeat, School, Scroll, Star } from "lucide-react";
import { analysisBlock } from "../submit-data/components/professor-review-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function ProfessorDetails({ professor, children }) {
  console.log(professor);
  const pros = convertToArray(professor.pros);
  const cons = convertToArray(professor.cons);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full rounded-sm p-2 text-left text-sm hover:bg-slate-700">
          {children}
        </button>
      </SheetTrigger>
      <SheetContent className="h-full w-full">
        <div className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{professor.name}</SheetTitle>
            <SheetDescription className="flex items-center">
              <School className="mr-2 h-4 w-4" />
              {professor.school}
            </SheetDescription>
            <SheetDescription className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              {professor.department}
            </SheetDescription>
            <SheetDescription className="flex items-center">
              <Star className="mr-2 h-4 w-4" />
              {professor.difficulty_level}
            </SheetDescription>
            <SheetDescription className="flex items-center">
              <Repeat className="mr-2 h-4 w-4" />
              {professor.would_take_again}
            </SheetDescription>
          </SheetHeader>
          <div className="scrollbar overflow-auto rounded-md">
            {analysisBlock(
              professor.summary,
              pros,
              cons,
              professor.recommendation
            )}
          </div>
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button>Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function convertToArray(str) {
  // Remove the outer curly braces
  str = str.replace(/^\{|\}$/g, "");

  // Split the string by commas, but not those within quotes
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  const items = str.split(regex);

  // Remove surrounding quotes from each item and trim whitespace
  return items.map((item) => item.replace(/^"|"$/g, "").trim());
}

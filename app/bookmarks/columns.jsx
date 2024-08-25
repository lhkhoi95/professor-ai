"use client";
import { MoreHorizontal } from "lucide-react";
import { deleteProfessor } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AlertDeleteDialog from "../components/delete-alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown } from "lucide-react";
import ProfessorDetails from "./professor-details";

export const columns = [
  {
    accessorKey: "school",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          School
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "difficulty_level",
    header: "Difficulty Level",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const professor = row.original;
      const [isDeleting, setIsDeleting] = useState(false);
      const { toast } = useToast();

      async function handleDelete() {
        setIsDeleting(true);
        await deleteProfessor(professor.id);
        setIsDeleting(false);
        toast({
          title: "Professor deleted",
          description: `Professor ${professor.name} has been deleted from your bookmarks`,
          variant: "destructive",
        });
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <ProfessorDetails professor={professor}>
              View Details
            </ProfessorDetails>
            <AlertDeleteDialog onDelete={handleDelete} isDeleting={isDeleting}>
              Delete
            </AlertDeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

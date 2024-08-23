"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import useHttp from "@/hooks/useHttp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProfessorReviewDialog from "./professor-review-dialog";

const FormSchema = z.object({
  link: z.string().refine(
    (value) => {
      const match = value.match(
        /^https:\/\/www\.ratemyprofessors\.com\/professor\/(\d+)/
      );
      return match && match[1];
    },
    {
      message:
        "The link must be a valid RateMyProfessor link in the format https://www.ratemyprofessors.com/professor/<id>",
    }
  ),
});

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function FormCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: "",
    },
  });

  const {
    isLoading,
    error,
    data: summaryData,
    sendRequest,
  } = useHttp("/api/check-professor", requestConfig);

  const onSubmit = (data) => {
    // console.log(data);
    sendRequest(data);
  };

  useEffect(() => {
    if (summaryData) {
      // console.log(summaryData);
      setIsDialogOpen(true);
    }
  }, [summaryData]);

  return (
    <>
      {summaryData && (
        <ProfessorReviewDialog
          professorData={summaryData}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 w-full space-y-6 rounded-xl bg-[#2f2f2f] p-6 md:w-1/3"
        >
          <h1 className="text-center text-2xl font-bold">
            Link to the professor
          </h1>
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={form.formState.errors.link ? "text-red-500" : ""}
                >
                  Professor Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.ratemyprofessors.com/professor/<professor_id>"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Link to the professor on{" "}
                  <a
                    target="_blank"
                    className="underline hover:text-yellow-500"
                    href="https://www.ratemyprofessors.com/"
                  >
                    RateMyProfessor
                  </a>{" "}
                  website.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500">{error.message}</p>}
          <div className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Checking... </span>
                </>
              ) : (
                "Get Review"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

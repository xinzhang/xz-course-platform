"use client";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema";
import { actionToast } from "@/hooks/use-toast";
import { sectionSchema } from "../schemas/sectionSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createSectionAction, updateSectionAction } from "../actions/sections";
import { z } from "zod";

export default function SectionForm({
  section,
  courseId,
  onSuccess,
}: {
  section?: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  };
  courseId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: section?.name ?? "",
      status: "public",
    },
  });

  async function onSubmit(values: z.infer<typeof sectionSchema>) {
    const action =
      section == null
        ? createSectionAction.bind(null, courseId)
        : updateSectionAction.bind(null, section.id);
    const data = await action(values);
    actionToast({ actionData: data });
    if (!data.error) onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6 @container'
      >
        <div className='grid grid-cols-1 @lg:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseSectionStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='self-end'>
          <Button disabled={form.formState.isSubmitting} type='submit'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

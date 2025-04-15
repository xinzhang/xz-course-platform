"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import { actionToast } from "@/hooks/use-toast";
import { lessonSchema } from "../schemas/lessonSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createLessonAction, updateLessonAction } from "../actions/lessons";
import { z } from "zod";
import { YouTubeVideoPlayer } from "./YouTubeVideoPlayer";

export default function LessonForm({
  sections,  
  lesson,
  defaultSectionId,
  onSuccess,
}: {
  sections: {
    id: string
    name: string
  }[];
  lesson?: {
    id: string;
    name: string;
    description?: string | null;
    youtubeVideoId: string;
    status: LessonStatus;
    sectionId: string
  };
  defaultSectionId?: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      description: lesson?.description ?? "",
      youtubeVideoId: lesson?.youtubeVideoId ?? "",
      status: lesson?.status ?? "private",
      sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof lessonSchema>) {
    const action =
      lesson == null
        ? createLessonAction
        : updateLessonAction.bind(null, lesson.id);
    const data = await action(values);
    actionToast({ actionData: data });
    if (!data.error) onSuccess?.();
  }
  const videoId = form.watch("youtubeVideoId")

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
            name="youtubeVideoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  YouTube Video Id
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
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
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
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    {lessonStatuses.map((status) => (
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
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className="min-h-20 resize-none" {...field} value={field.value ?? ""} />
                </FormControl>
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
        {videoId && (
          <div className="aspect-video">
            <YouTubeVideoPlayer videoId={videoId} />
          </div>
        )}
      </form>
    </Form>
  );
}

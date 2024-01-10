"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatePasswordSchema } from "@/schemas";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createPassword } from "@/actions/create-password";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const CreatePasswordForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreatePasswordSchema>>({
    resolver: zodResolver(CreatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreatePasswordSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      createPassword(values).then((data) => {
        setError(data.error);
        if (data.success) {
          setSucces(data.success);
          router.push("/login");
        }
      });
    });
  };

  return (
    <>
      <CardWrapper
        headerLabel="Create account password"
        backButtonLabel="Already have an account?"
        backButtonHref="/login"
        // showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        placeholder="******"
                      />
                    </FormControl>
                    {/* <FormDescription>Description</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        placeholder="******"
                      />
                    </FormControl>
                    {/* <FormDescription>Description</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending} className="w-full">
              Create password
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};
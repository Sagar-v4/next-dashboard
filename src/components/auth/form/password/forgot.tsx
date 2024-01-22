"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ForgotPasswordSchema } from "@/schemas/auth";
import { FormError } from "@/components/auth/form-error";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/auth/form-success";
import { forgotPassword } from "@/actions/auth/password/forgot";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      id: user ? user.id : "",
      email: undefined,
      sms: undefined,
      whatsapp: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    setError("");
    setSucces("");

    startTransition(async () => {
      const origin = window.location.origin;
      await forgotPassword(origin, values)
        .then((data: any) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSucces(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Forgot Password</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={isPending}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Email</FormLabel>
                    <FormDescription>
                      Get forgot password link on your email
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={true || isPending}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>SMS</FormLabel>
                    <FormDescription>
                      Get forgot password link on your sms
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={true || isPending}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Whatsapp</FormLabel>
                    <FormDescription>
                      Get forgot password link on your whatsapp
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

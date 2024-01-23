"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileSecurity } from "@/config/site";
import { ChangePasswordSchema } from "@/schemas/auth";
import { FormError } from "@/components/auth/form-error";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/auth/form-success";
import { changePassword } from "@/actions/auth/password/change";

export const ChangePasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      id: user ? user.id : "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      await changePassword(values)
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
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Change Password</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        placeholder="******"
                      />
                    </FormControl>
                    <Button
                      asChild
                      size="sm"
                      variant="link"
                      className="p-0 font-normal"
                    >
                      <Link href={profileSecurity.forgot.href}>
                        Forgot current password?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        disabled={isPending}
                        placeholder="******"
                      />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending}>
            Change password
          </Button>
        </form>
      </Form>
    </>
  );
};

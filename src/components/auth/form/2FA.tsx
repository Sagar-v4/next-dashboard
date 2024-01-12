"use client";

import * as z from "zod";
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
  FormDescription,
} from "@/components/ui/form";
import { authLinks } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TwoFactorAuthSchema } from "@/schemas";
import { twoFactorAuth } from "@/actions/auth/2fa";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useRouter, useSearchParams } from "next/navigation";

export const TwoFactorAuthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const uuid: string | null = searchParams.get("id");
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TwoFactorAuthSchema>>({
    resolver: zodResolver(TwoFactorAuthSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof TwoFactorAuthSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      twoFactorAuth(uuid, values).then((data) => {
        setError(data.error);
        if (data.success) {
          setSucces(data.success);
          router.push("/");
        }
      });
    });
  };

  return (
    <>
      <CardWrapper
        headerLabel="Two Factor Authentication"
        backButtonLabel="Back to Login"
        backButtonHref={authLinks.login.href}
        // showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={6}
                        disabled={isPending}
                        placeholder="123456"
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
              Confirm
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

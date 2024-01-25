"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authLinks } from "@/config/site";
import { login } from "@/actions/auth/login";
import { LoginSchema } from "@/schemas/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [show2FA, setShow2FA] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      await login(values)
        .then((data: any | undefined) => {
          if (data?.error) {
            // form.reset();
            setError(data.error);
            if (show2FA && data.error === "Invalid credentials!") {
              // setShow2FA(false);
            } else {
              setError(data.error);
            }
          }
          if (data?.success) {
            // form.reset();
            setSucces(data.success);
          }
          if (data?.twoFactor) {
            setShow2FA(true);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    });
  };

  return (
    <>
      <CardWrapper
        headerLabel={show2FA ? "Two Factor Authentication" : "Welcome back"}
        backButtonLabel={show2FA ? "Back to Login" : "Don't have an account?"}
        backButtonHref={show2FA ? "" : authLinks.register.href}
        showSocial={false && !show2FA}
        onClickBackButton={() => {
          if (show2FA) {
            setError("");
            setSucces("");
            setShow2FA(false);
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {!show2FA && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={isPending}
                            placeholder="john.doe@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <Button
                          asChild
                          size="sm"
                          variant="link"
                          className="p-0 font-normal"
                        >
                          <Link href={authLinks.reset.href}>
                            Forgot password?
                          </Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {show2FA && (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending} className="w-full">
              {show2FA ? "Confirm" : "Login"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

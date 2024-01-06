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
import { sendMail } from "@/lib/mail";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const sendRegistrationMail = async (
    values: z.infer<typeof RegisterSchema>
  ): Promise<boolean> => {
    return await sendMail({
      to: values.email,
      name: `${values.firstName} ${values.lastName}`,
      subject: "New Registration Verification",
      body: `Hello ${values.firstName} ${values.lastName}`,
    });
  };

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      register(values).then(async (data) => {
        setError(data.error);
        if (data.success) {
          const isMailSent: boolean = await sendRegistrationMail(values);
          if (isMailSent) {
            setSucces(data.success);
          }
        }
      });
    });
  };

  return (
    <>
      <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/login"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                    {/* <FormDescription>Description</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        disabled={isPending}
                        placeholder="john"
                      />
                    </FormControl>
                    {/* <FormDescription>Description</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        disabled={isPending}
                        placeholder="doe"
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
              Create new account
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

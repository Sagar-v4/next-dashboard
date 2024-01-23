"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TwoFactorToggleSchema } from "@/schemas/auth";
import { FormError } from "@/components/auth/form-error";
import { useCurrentUser } from "@/hooks/use-current-user";
import { twoFactorToggle } from "@/actions/auth/2fa-toggle";
import { FormSuccess } from "@/components/auth/form-success";

export function TwoFactorToggleSwitch() {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [twoFAValue, setTwoFAValue] = useState<Date | undefined>();

  const get2FADate = async (id: string) => {
    const res = await fetch(
      `http://localhost:3000/api/v1/profile/security/2fa?id=${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    return data.date;
  };

  useEffect(() => {
    (async () => {
      const date = await get2FADate(user ? user.id : "");
      form.setValue("toggle", date ? true : false);
      setTwoFAValue(date ? new Date(date) : undefined);
    })();
  }, [user]);

  const form = useForm<z.infer<typeof TwoFactorToggleSchema>>({
    resolver: zodResolver(TwoFactorToggleSchema),
    defaultValues: {
      id: user ? user.id : "",
      toggle: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof TwoFactorToggleSchema>) => {
    setError("");
    setSucces("");

    startTransition(async () => {
      await twoFactorToggle(values)
        .then((data: any) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSucces(data.success);
            setTwoFAValue(data.date);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">
            Two Factor Authentication
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="toggle"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5 ">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      {twoFAValue
                        ? `Activated on: ${twoFAValue}`
                        : "Currently disabled"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
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

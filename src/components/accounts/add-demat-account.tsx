"use client";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { brokers } from "@/lib/model/broker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

export function AddDematAccount({
  form,
  isPending,
  onSubmit,
  error,
  success,
}: any) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex w-full items-center space-x-2">
            <FormField
              control={form.control}
              name="broker"
              render={({ field }) => (
                <FormItem className="flex min-w-44 items-center space-x-2">
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Broker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.name}>
                          <div className="flex gap-2">{broker.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
                      placeholder="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex  items-center space-x-2">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="Code"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              Add
            </Button>
          </div>
          {/**
           * // TODO: show toast or sonar insted of {error, success} messages on the page, it makes bad UX
           */}
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      </form>
    </Form>
  );
}

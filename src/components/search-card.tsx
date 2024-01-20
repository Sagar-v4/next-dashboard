"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRef, useState, useTransition } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { authLinks } from "@/config/site";
import { Input } from "@/components/ui/input";
// import { register } from "@/actions/auth/register";
// import { CardWrapper } from "@/components/auth/card-wrapper";

export const SearchCardForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  let searchQuery = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    setError("");
    setSucces("");

    startTransition(async () => {
      const origin =
        typeof window !== undefined && window.location.origin
          ? window.location.origin
          : "";
      // await register(origin, values).then((data) => {
      //   setError(data.error);
      //   setSucces(data.success);
      // });
    });
  };

  return (
    <>
      <div className="mb-4">
        <Input
          type="text"
          ref={searchQuery}
          disabled={isPending}
          onChange={(e) => {
            // setSearchQuer.target.value);arget.value);
          }}
          placeholder="Search..."
        />
      </div>
    </>
  );
};

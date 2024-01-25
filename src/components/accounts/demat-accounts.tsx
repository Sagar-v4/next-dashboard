"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import { AddDematAccount } from "./add-demat-account";
import { useCurrentUser } from "@/hooks/use-current-user";
import { TableDematAccount } from "./table-demat-account";
import { NewDematAccountSchema } from "@/schemas/accounts";
import { addDematAccount } from "@/actions/account/add-demat";
import { deleteDematAccount } from "@/actions/account/table-demat";

export function DematAccounts() {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSucces] = useState<string | undefined>();
  const [dematAccounts, setDematAccounts] = useState<any[] | undefined>();

  const form = useForm<z.infer<typeof NewDematAccountSchema>>({
    resolver: zodResolver(NewDematAccountSchema),
    defaultValues: {
      id: user ? user.id : "",
      name: "",
      code: "",
      broker: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewDematAccountSchema>) => {
    setError("");
    setSucces("");

    // TODO: show toast or sonar insted of {error, success} messages on the page, it makes bad UX
    startTransition(async () => {
      await addDematAccount(values)
        .then((data: any) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            form.reset();
            setSucces(data.success);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setTimeout(() => {
            setError("");
            setSucces("");
          }, 5000);
        });
    });
  };

  const onDeleteBroker = (brokerId: string) => {
    setError("");
    setSucces("");

    // TODO: show toast or sonar insted of {error, success} messages on the page, it makes bad UX
    startTransition(async () => {
      await deleteDematAccount(user ? user.id : "", brokerId)
        .then((data: any) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSucces(data.success);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setTimeout(() => {
            setError("");
            setSucces("");
          }, 5000);
        });
    });
  };

  const getDematAccountData = async (id: string) => {
    const res = await fetch(
      `http://localhost:3000/api/v1/profile/accounts/demat?id=${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    return data.accounts;
  };

  useEffect(() => {
    (async () => {
      const brokers = await getDematAccountData(user ? user.id : "");
      setDematAccounts(brokers);
    })();
  }, [user, success]);
  return (
    <>
      <div className="m-4 space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Add Demat Account</h3>
          <AddDematAccount
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
            error={error}
            success={success}
          />
        </div>

        <h3 className="mb-4 text-lg font-medium">Table Demat Account</h3>
        <TableDematAccount
          onDelete={onDeleteBroker}
          dematAccounts={dematAccounts}
        />
      </div>
    </>
  );
}

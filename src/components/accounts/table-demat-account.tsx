import { Trash2 } from "lucide-react";

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  // TableCaption,
  // TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function TableDematAccount({ onDelete, dematAccounts }: any) {
  // TODO: if no demat account is added show something like "account not added yet" instead of blank table
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Broker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dematAccounts &&
          dematAccounts.map((account: any) => (
            <TableRow key={account._id}>
              <TableCell className="font-medium">{account.broker}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.createdAt}</TableCell>
              <TableCell>
                <Button onClick={() => onDelete(account._id)}>
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}

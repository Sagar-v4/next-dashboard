import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDematAccount() {
  return (
    <Select>
      <SelectTrigger className="border-none shadow-none outline-none">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your accounts</SelectLabel>
          <SelectItem value="Account 1">Account 1</SelectItem>
          <SelectItem value="Account 2">Account 2</SelectItem>
          <SelectItem value="Account 3">Account 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

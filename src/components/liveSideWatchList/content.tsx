import Link from "next/link";

interface ContentProps {
  items: any;
}

export const Content = ({ items }: ContentProps) => {
  return (
    <>
      <div className="space-y-2 py-2">
        {!items
          ? items.map((item: any, index: number) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className="flex w-full cursor-pointer"
                >
                  {item.title}
                </Link>
              );
            })
          : null}
      </div>
    </>
  );
};

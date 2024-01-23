interface HeaderProps {
  label: string;
  logo?: JSX.Element;
}

export const Header = ({ label, logo }: HeaderProps) => {
  return (
    <>
      <div className="flex w-full flex-col ">
        <div className="flex items-center space-x-2">
          {logo ? logo : null}
          <h1 className="inline-block font-bold">{label}</h1>
        </div>
      </div>
    </>
  );
};

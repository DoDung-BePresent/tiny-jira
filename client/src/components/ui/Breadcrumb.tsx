export const Breadcrumb = ({ items }: { items: Array<string> }) => {
  return (
    <div className="text-muted-foreground flex items-center">
      {items.map((item, index) => (
        <div className="mr-2 space-x-2" key={index}>
          {index !== 0 && <span>/</span>}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

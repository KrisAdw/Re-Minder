type CardNoteProps = {
  title: string;
  createdAt: string;
  content: string;
  tags?: string[];
  color: string;
};

const CardNote = ({
  title,  
  content,
  tags,
  color,
}: CardNoteProps) => {
  return (
    <div
      className="card-note-grid hover:cursor-pointer border-graybg px-4 py-6"
      style={{
        backgroundColor:
          color === "default" ? "var(--background)" : `var(--note-${color})`,
        borderColor:
          color === "default" ? "var(--border)" : `var(--note-${color})`,
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col">
          {/* Date */}
          {/* <p className="text-xs text-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p> */}
          {/* Title */}
          <h3 className="font-semibold">{title}</h3>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground text-justify whitespace-pre-line break-words">
          {content}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md text-xs border" // border buat width
                style={{
                  borderWidth: "1px",
                  borderColor:
                    color === "default"
                      ? "var(--graybg)"
                      : `var(--note-${color}-border)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardNote;

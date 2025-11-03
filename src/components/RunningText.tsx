interface RunningTextProps {
  text: string;
}

export const RunningText = ({ text }: RunningTextProps) => {
  return (
    <div className="bg-display-accent overflow-hidden py-3">
      <div className="animate-scroll whitespace-nowrap">
        <span className="text-display-text text-lg font-medium px-4">
          {text} • {text} • {text} • {text}
        </span>
      </div>
    </div>
  );
};

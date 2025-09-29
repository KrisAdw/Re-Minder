import { LucideIcon } from "lucide-react";

type ActionButtonProps = {
    icon: LucideIcon;
    title: string;
    onClick?: () => void;
    variant?: "default" | "color" | "destructive";
}

const ActionButton = ({ icon: Icon, title, onClick, variant = "default" }: ActionButtonProps) => {
  return (
    <button
      title={title}
      className={`p-2 rounded-full hover:bg-black/5 cursor-pointer ${variant}`}
      onClick={onClick}
    >
      <Icon size={16} />
    </button>
  );
};

export default ActionButton;

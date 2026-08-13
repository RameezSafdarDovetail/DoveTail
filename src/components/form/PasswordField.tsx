import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
}

export function PasswordField({
  invalid = false,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(
          ui.fieldControl,
          "pr-11",
          invalid &&
            "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]",
          className
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent text-text-3 hover:text-text-1"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff size={16} strokeWidth={1.8} />
        ) : (
          <Eye size={16} strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}

import { forwardRef } from "react";

type SimpleTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
};

export const SimpleTextarea = forwardRef<HTMLTextAreaElement, SimpleTextareaProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                    {label}
                    {props.required && <span className="text-destructive ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    className={`
            w-full rounded-md border border-input bg-background px-3 py-2 text-sm
            transition-colors placeholder:text-muted-foreground resize-none
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-destructive focus:ring-destructive" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
        );
    }
);

SimpleTextarea.displayName = "SimpleTextarea";

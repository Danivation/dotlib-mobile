import * as React from "react"
import { TextInput, type TextInputProps } from "react-native"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<TextInput, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        className={cn(
          "placeholder:text-muted-foreground border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs text-foreground disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

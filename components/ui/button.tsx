import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonVariants, cn } from "@/lib/utils";

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {}

const ButtonDotlists = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <TouchableOpacity
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, child =>
          typeof child === 'string' ? <Text>{child}</Text> : child
        )}
      </TouchableOpacity>
    );
  }
);
ButtonDotlists.displayName = "Button";

export { ButtonDotlists };


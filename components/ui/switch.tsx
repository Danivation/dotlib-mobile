import * as React from "react"
import { Switch as RNSwitch, type SwitchProps } from "react-native"

const Switch = React.forwardRef<
  RNSwitch,
  SwitchProps & { checked?: boolean; onCheckedChange?: (value: boolean) => void }
>(({ checked, onCheckedChange, ...props }, ref) => {
  return (
    <RNSwitch
      ref={ref}
      value={checked}
      onValueChange={onCheckedChange}
      {...props}
    />
  )
})
Switch.displayName = "Switch"

export { Switch }

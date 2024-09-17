import React from 'react'
import RNText, { IRNTextProps } from '@freakycoder/react-native-custom-text'
/**
 * ? Local Imports
 */

interface ITextWrapperProps extends IRNTextProps {
  color?: string
  fontFamily?: string
  children?: React.ReactNode
}

const TextWrapper: React.FC<ITextWrapperProps> = ({
  color = '#757575',
  children,
  ...rest
}) => {
  return (
    <RNText color={color} {...rest}>
      {children}
    </RNText>
  )
}

export default TextWrapper

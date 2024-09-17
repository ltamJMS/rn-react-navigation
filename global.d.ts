import { theme } from './src/shared/theme/themes'

declare module '@react-navigation/native' {
  export type ExtendedTheme = typeof theme
  export function useTheme(): ExtendedTheme
}

declare module 'native-base' {
  export interface CenterProps {
    w?: any
    h?: any
    rounded?: string | number
  }
  const Center: React.ComponentType<
    CenterProps & { children?: React.ReactNode }
  >
  const Button: React.ComponentType<
    ButtonProps & { children?: React.ReactNode }
  >
  export { Center, Button }
}

import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let variantClass = '';
  switch (type) {
    case 'default':
      variantClass = 'text-base leading-6';
      break;
    case 'title':
      variantClass = 'text-[32px] font-bold leading-8';
      break;
    case 'defaultSemiBold':
      variantClass = 'text-base font-semibold leading-6';
      break;
    case 'subtitle':
      variantClass = 'text-xl font-bold';
      break;
    case 'link':
      variantClass = 'text-base leading-[30px] text-[#0a7ea4]';
      break;
  }

  return (
    <Text
      style={[{ color }, style]}
      className={`${variantClass} ${className || ''}`}
      {...rest}
    />
  );
}

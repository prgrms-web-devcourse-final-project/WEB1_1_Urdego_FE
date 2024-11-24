import {
  StyledButton,
  IconWrapper,
} from '@/components/Common/Button/Button.styles';
import { StaticImageData } from 'next/image';

interface ButtonProps {
  buttonType?: 'purple' | 'gray';
  buttonSize?: 'small' | 'large';
  buttonHeight?: 'default' | 'short';
  styleType?: 'whiteBackground' | 'coloredBackground';
  label: string;
  icon?: string | StaticImageData;
  onClick?: () => void;
}

const Button = ({
  buttonType = 'purple',
  buttonSize = 'large',
  buttonHeight = 'default',
  styleType = 'coloredBackground',
  label,
  icon,
  onClick,
}: ButtonProps) => {
  return (
    <StyledButton
      $buttonType={buttonType}
      $buttonSize={buttonSize}
      $buttonHeight={buttonHeight}
      $styleType={styleType}
      onClick={onClick}
    >
      {icon && (
        <IconWrapper>
          {typeof icon === 'string' ? (
            <img src={icon} alt="" />
          ) : (
            <img src={icon.src} alt="" />
          )}
        </IconWrapper>
      )}
      {label}
    </StyledButton>
  );
};

export default Button;

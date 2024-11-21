import { LogoWrapper, LogoImage } from './LoginLogo.styles';

interface LoginLogoProps {
  src?: string;
}

const LoginLogo = ({ src }: LoginLogoProps) => {
  return <LogoWrapper>{src && <LogoImage src={src} alt="logo" />}</LogoWrapper>;
};

export default LoginLogo;

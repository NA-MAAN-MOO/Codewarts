import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as MicOn } from 'assets/icons/mic_on.svg';

type IconType = {
  color?: string;
  isMute?: boolean;
  handleMic?: () => void;
  size?: string;
};
const MicIcon = ({
  color = 'white',
  isMute = false,
  handleMic,
  size = '30px',
}: IconType) => {
  return isMute ? (
    <MicOff
      width={size}
      height={size}
      fill={color}
      onClick={handleMic || undefined}
      style={{
        transform: 'scaleX(-1)',
        cursor: handleMic ? 'pointer' : 'auto',
      }}
    />
  ) : (
    <MicOn
      width={size}
      height={size}
      fill={color}
      onClick={handleMic || undefined}
      style={{
        transform: 'scaleX(-1)',
        cursor: handleMic ? 'pointer' : 'auto',
      }}
    />
  );
};
export default MicIcon;

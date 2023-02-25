import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as MicOn } from 'assets/icons/mic_on.svg';

type IconType = {
  color?: string;
  isMute?: boolean;
  handleMic?: () => void;
};
const MicIcon = ({ color = 'white', isMute = false, handleMic }: IconType) => {
  return isMute ? (
    <MicOff
      width="30px"
      height="30px"
      fill={color}
      onClick={handleMic || undefined}
      style={{
        transform: 'scaleX(-1)',
        cursor: handleMic ? 'pointer' : 'auto',
      }}
    />
  ) : (
    <MicOn
      width="30px"
      height="30px"
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

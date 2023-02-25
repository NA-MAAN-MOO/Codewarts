import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';
import { ReactComponent as VolOffGray } from 'assets/icons/volume_off_gray.svg';
import { ReactComponent as VolOn } from 'assets/icons/volume_on.svg';
import { ReactComponent as VolOnGray } from 'assets/icons/volume_on_gray.svg';

type IconType = {
  color?: string;
  isMute?: boolean;
  handleVolume?: () => void;
  size?: string;
};

const VolumeIcon = ({
  color = 'white',
  isMute = false,
  handleVolume,
  size = '32px',
}: IconType) => {
  return isMute ? (
    color === 'white' ? (
      <VolOff
        width={size}
        height={size}
        onClick={handleVolume || undefined}
        style={{
          cursor: handleVolume ? 'pointer' : 'auto',
        }}
      />
    ) : (
      <VolOffGray
        width={size}
        fill={color}
        height={size}
        onClick={handleVolume || undefined}
        style={{
          cursor: handleVolume ? 'pointer' : 'auto',
        }}
      />
    )
  ) : color === 'white' ? (
    <VolOn
      width={size}
      height={size}
      onClick={handleVolume || undefined}
      style={{
        cursor: handleVolume ? 'pointer' : 'auto',
      }}
    />
  ) : (
    <VolOnGray
      width={size}
      height={size}
      onClick={handleVolume || undefined}
      style={{
        cursor: handleVolume ? 'pointer' : 'auto',
      }}
    />
  );
};
export default VolumeIcon;

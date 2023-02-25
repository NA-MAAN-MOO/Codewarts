import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';
import { ReactComponent as VolOffGray } from 'assets/icons/volume_off_gray.svg';
import { ReactComponent as VolOn } from 'assets/icons/volume_on.svg';
import { ReactComponent as VolOnGray } from 'assets/icons/volume_on_gray.svg';

type IconType = {
  color?: string;
  isMute?: boolean;
  handleVolume?: () => void;
};

const VolumeIcon = ({
  color = 'white',
  isMute = false,
  handleVolume,
}: IconType) => {
  return isMute ? (
    color === 'white' ? (
      <VolOff
        width="32px"
        height="32px"
        onClick={handleVolume || undefined}
        style={{
          cursor: handleVolume ? 'pointer' : 'auto',
        }}
      />
    ) : (
      <VolOffGray
        width="32px"
        fill={color}
        height="32px"
        onClick={handleVolume || undefined}
        style={{
          cursor: handleVolume ? 'pointer' : 'auto',
        }}
      />
    )
  ) : color === 'white' ? (
    <VolOn
      width="32px"
      height="32px"
      onClick={handleVolume || undefined}
      style={{
        cursor: handleVolume ? 'pointer' : 'auto',
      }}
    />
  ) : (
    <VolOnGray
      width="32px"
      height="32px"
      onClick={handleVolume || undefined}
      style={{
        cursor: handleVolume ? 'pointer' : 'auto',
      }}
    />
  );
};
export default VolumeIcon;

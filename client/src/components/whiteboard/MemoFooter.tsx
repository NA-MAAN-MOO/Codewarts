import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import styled from 'styled-components';

export default function MemoFooter() {
  function stringToColor() {
    let color = '#';

    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    color += randomColor;

    return color;
  }

  function stringAvatar(name: string) {
    return {
      children: `${name[0]}${name[1]}`,
    };
  }

  return (
    <AvatarWrapper>
      <AvatarGroup
        max={6}
        sx={{
          '&': { border: 'none' },
        }}
      >
        <Avatar
          {...stringAvatar('TODO: map 돌려서 사람 추가')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            // background: `${stringToColor()}`,
            '&': {
              border: 'none',
              background: `${stringToColor()}`,
            },
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
      </AvatarGroup>
    </AvatarWrapper>
  );
}

const AvatarWrapper = styled.div`
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  display: flex;
  margin-left: 10px;
  //   border: 1px solid red;
`;

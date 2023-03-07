import firework3 from 'assets/images/firework3.gif';

export const Fireworks = () => {
  return (
    <>
      <img
        className="firework"
        src={firework3}
        alt="GIF"
        style={{
          position: 'fixed',
          zIndex: '9999',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <img
        className="firework"
        src="https://i.gifer.com/WS2k.gif"
        alt="GIF"
        style={{
          position: 'fixed',
          zIndex: '9999',
          left: '30%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <img
        className="firework"
        src="https://i.gifer.com/6SSp.gif"
        alt="GIF"
        style={{
          position: 'fixed',
          zIndex: '9999',
          left: '50%',
          top: '20%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <img
        className="firework"
        src="https://i.gifer.com/Z9pp.gif"
        alt="GIF"
        style={{
          position: 'fixed',
          zIndex: '9999',
          left: '70%',
          top: '70%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

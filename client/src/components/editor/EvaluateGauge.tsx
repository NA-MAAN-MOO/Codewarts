//@ts-nocheck
import './GaugeBar.css';

const GaugeBar = ({ value, min, max, label, shining, totalCases }) => {
  const percent = ((value - min) / (max - min)) * 100;
  const barWidth = `${percent}%`;
  const barStyle = {
    width: barWidth,
    borderRadius: '5px',
    transition: 'width 0.4s border 0.4s',
    animationIterationCount: totalCases,
  };
  return (
    <div className="gauge-bar">
      <div className={`bar ${shining ? 'shine' : ''}`} style={barStyle}></div>
      <div className="label">{label}</div>
    </div>
  );
};

export default GaugeBar;

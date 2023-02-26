//@ts-nocheck
import './GaugeBar.css';

const GaugeBar = ({ value, min, max, label }) => {
  const percent = ((value - min) / (max - min)) * 100;
  const barStyle = { width: `${percent}%` };
  return (
    <div className="gauge-bar">
      <div className="bar" style={barStyle}></div>
      <div className="label">{label}</div>
    </div>
  );
};

export default GaugeBar;

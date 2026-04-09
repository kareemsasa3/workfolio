import "./StaticBackground.css";

const StaticBackground = () => {
  return (
    <div className="static-background" aria-hidden="true">
      <div className="static-background__base" />
      <div className="static-background__grid" />
      <div className="static-background__topology" />
      <div className="static-background__signals" />
    </div>
  );
};

export default StaticBackground;

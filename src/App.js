import FillColors from "./services/fillColors";
const CANVAS_ID = "canvasId";

function App() {

  const onStart = () => {
    const fillColors = new FillColors(CANVAS_ID, 256, 128, 1, 1);
    fillColors.setRandomness(500, 0.30, 0.11, 0.59);
    fillColors.setProccesses(10);
    fillColors.fill();
  }

  return (
    <div className="App">
      <button onClick={onStart}>Start fill color</button>
      <div style={{ margin: 50 }}>
        <canvas id={CANVAS_ID} />
      </div>
    </div>
  );
}

export default App;

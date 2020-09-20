import * as React from 'react';
import WindMouse from 'windmouse';
import { MouseSettings } from 'windmouse/lib/Types';
import { getWindowWidth, getWindowHeight } from '../../util/Browser';
import './Canvas.css';

const Canvas = (): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
  const [settings, setSettings] = React.useState<MouseSettings>({
    startX: Math.ceil(Math.random() * getWindowWidth()),
    startY: Math.ceil(Math.random() * getWindowHeight()),
    endX: Math.ceil(Math.random() * getWindowWidth()),
    endY: Math.ceil(Math.random() * getWindowHeight()),
    gravity: Math.ceil(Math.random() * 10),
    wind: Math.ceil(Math.random() * 10),
    minWait: 2,
    maxWait: Math.ceil(Math.random() * 5),
    maxStep: Math.ceil(Math.random() * 3),
    targetArea: Math.ceil(Math.random() * 10),
  });

  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        setContext(renderCtx);
        drawMouseMovement();
      }
    }
  }, [context]);

  const drawMouseMovement = async () => {
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const windMouse = new WindMouse(Math.ceil(Math.random() * 10));

    const points = await windMouse.GeneratePoints(settings);
    context.beginPath();
    context.lineCap = 'round';
    context.strokeStyle = '#ffffff';
    context.fillStyle = 'red';

    points.forEach((point, index) => {
      const [x, y, time] = point;

      setTimeout(() => {
        context.lineTo(x, y);
        context.stroke();
        if (index === 0 || index === points.length - 1) {
          context.fillRect(x, y, 5, 5);
          context.fillText(`(${x}, ${y})`, x + 10, y + 10);
        }
      }, time);
      context.closePath();
    });
  };

  return (
    <React.Fragment>
      <div id="mouse-data">
        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="startX" className="mouse-data-label">
              Start X
            </label>
            <input
              name="startX"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.startX}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  startX: Number(e.target.value) < getWindowWidth() ? Number(e.target.value) : getWindowWidth(),
                })
              }
            />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="startY" className="mouse-data-label">
              Start Y
            </label>
            <input
              name="startY"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.startY}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  startY: Number(e.target.value) < getWindowHeight() ? Number(e.target.value) : getWindowHeight(),
                })
              }
            />
          </div>
        </div>
        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="endX" className="mouse-data-label">
              End X
            </label>
            <input
              name="endX"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.endX}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  endX: Number(e.target.value) < getWindowWidth() ? Number(e.target.value) : getWindowWidth(),
                })
              }
            />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="endY" className="mouse-data-label">
              End Y
            </label>
            <input
              name="endY"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.endY}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  endY: Number(e.target.value) < getWindowHeight() ? Number(e.target.value) : getWindowHeight(),
                })
              }
            />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="gravity" className="mouse-data-label">
              Gravity
            </label>
            <input
              name="gravity"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.gravity}
              onChange={(e) => setSettings({ ...settings, gravity: Number(e.target.value) })}
            />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="wind" className="mouse-data-label">
              Wind
            </label>
            <input
              name="wind"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.wind}
              onChange={(e) => setSettings({ ...settings, wind: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="minWait" className="mouse-data-label">
              Min Wait
            </label>
            <input
              name="minWait"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.minWait}
              onChange={(e) => setSettings({ ...settings, minWait: Number(e.target.value) })}
            />
          </div>

          <div className="mouse-data-field">
            <label htmlFor="maxWait" className="mouse-data-label">
              Max Wait
            </label>
            <input
              name="maxWait"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.maxWait}
              onChange={(e) => setSettings({ ...settings, maxWait: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="maxStep" className="mouse-data-label">
              Max Step
            </label>
            <input
              name="maxStep"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.maxStep}
              onChange={(e) => setSettings({ ...settings, maxStep: Number(e.target.value) })}
            />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="targetArea" className="mouse-data-label">
              Target Area
            </label>
            <input
              name="targetArea"
              type="number"
              className="mouse-data-input"
              defaultValue={settings.targetArea}
              onChange={(e) => setSettings({ ...settings, targetArea: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mouse-data-row">
          <button className="btn start-btn" onClick={() => drawMouseMovement()}>
            Play
          </button>
        </div>
      </div>

      <canvas id="canvas" ref={canvasRef} height={getWindowHeight()} width={getWindowWidth()} />
      <p id="credits">
        Made with <span className="red">❤</span> by
        <a href="https://github.com/Arevi" className="red">
          Arevi
        </a>
      </p>
    </React.Fragment>
  );
};

export default Canvas;

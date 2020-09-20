import * as React from 'react';
import { useForm } from 'react-hook-form';
import { MouseSettings } from 'windmouse/lib/Types';
import { getWindowWidth, getWindowHeight } from '../../util/Browser';
import { yupResolver } from '@hookform/resolvers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSync } from '@fortawesome/free-solid-svg-icons';
import WindMouse from 'windmouse';
import * as yup from 'yup';
import './Canvas.css';

const schema = yup.object().shape({
  startX: yup.number().required(),
  startY: yup.number().required(),
  endX: yup.number().required(),
  endY: yup.number().required(),
  gravity: yup.number().required(),
  wind: yup.number().required(),
  minWait: yup.number().required(),
  maxWait: yup.number().required(),
  maxStep: yup.number().required(),
  targetArea: yup.number().required(),
});

const Canvas = (): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
  const { register, handleSubmit, setValue } = useForm<MouseSettings>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        setContext(renderCtx);
        randomizeValues();
      }
    }
  }, []);

  const onSubmit = async (values: MouseSettings) => {
    let points = await generatePoints(values);
    await drawCanvas(points);
  };

  const drawCanvas = (points: number[][]): Promise<void> => {
    if (!context) return Promise.reject();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

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
    });

    return Promise.resolve();
  };

  const generatePoints = async (settings: MouseSettings): Promise<number[][]> => {
    const windMouse: WindMouse = new WindMouse(Math.ceil(Math.random() * 10));
    const points: number[][] = await windMouse.GeneratePoints({ ...settings });
    return Promise.resolve(points);
  };

  const randomizeValues = () => {
    setValue('startX', Math.ceil(Math.random() * getWindowWidth()));
    setValue('startY', Math.ceil(Math.random() * getWindowHeight()));
    setValue('endX', Math.ceil(Math.random() * getWindowWidth()));
    setValue('endY', Math.ceil(Math.random() * getWindowHeight()));
    setValue('gravity', Math.ceil(Math.random() * 10));
    setValue('wind', Math.ceil(Math.random() * 10));
    setValue('minWait', 1);
    setValue('maxWait', Math.ceil(Math.random() * 5));
    setValue('maxStep', Math.ceil(Math.random() * 3));
    setValue('targetArea', Math.ceil(Math.random() * 10));
  };

  return (
    <React.Fragment>
      <form id="mouse-data" onSubmit={handleSubmit(onSubmit)}>
        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="startX" className="mouse-data-label">
              Start X
            </label>
            <input name="startX" type="number" className="mouse-data-input" step={0.1} ref={register({})} />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="startY" className="mouse-data-label">
              Start Y
            </label>
            <input name="startY" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
        </div>
        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="endX" className="mouse-data-label">
              End X
            </label>
            <input name="endX" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="endY" className="mouse-data-label">
              End Y
            </label>
            <input name="endY" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="gravity" className="mouse-data-label">
              Gravity
            </label>
            <input name="gravity" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="wind" className="mouse-data-label">
              Wind
            </label>
            <input name="wind" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="minWait" className="mouse-data-label">
              Min Wait
            </label>
            <input name="minWait" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>

          <div className="mouse-data-field">
            <label htmlFor="maxWait" className="mouse-data-label">
              Max Wait
            </label>
            <input name="maxWait" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
        </div>

        <div className="mouse-data-row">
          <div className="mouse-data-field">
            <label htmlFor="maxStep" className="mouse-data-label">
              Max Step
            </label>
            <input name="maxStep" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
          <div className="mouse-data-field">
            <label htmlFor="targetArea" className="mouse-data-label">
              Target Area
            </label>
            <input name="targetArea" type="number" className="mouse-data-input" step={0.1} ref={register} />
          </div>
        </div>
        <div className="mouse-data-row">
          <button className="btn start-btn" type="submit">
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button className="btn start-btn" type="submit" onClick={randomizeValues}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        </div>
      </form>

      <canvas id="canvas" ref={canvasRef} height={getWindowHeight()} width={getWindowWidth()} />
      <p id="credits">
        Made with <span className="red">❤</span> by{' '}
        <a href="https://github.com/Arevi" className="red">
          Arevi
        </a>
      </p>
    </React.Fragment>
  );
};

export default Canvas;

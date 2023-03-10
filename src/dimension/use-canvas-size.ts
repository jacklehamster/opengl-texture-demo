import React, { RefObject, useEffect, useState } from "react";

interface Props {
    gl?: WebGL2RenderingContext;
    canvasRef: RefObject<HTMLCanvasElement>;
    pixelRatio: number;    
}

interface State {
    width: number;
    height: number;
}

export function useCanvasSize({ gl, canvasRef, pixelRatio }: Props): State {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    React.useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const resize = () => {
                const rect = canvas.getBoundingClientRect();
                setWidth(pixelRatio * rect.width);
                setHeight(pixelRatio * rect.height);
            };
            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(canvas);
            const observer = new MutationObserver(resize);
            observer.observe(canvas, { attributes: true, attributeFilter: ["style"] });
        }
    }, []);

    useEffect(() => {
        if (gl) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
    }, [gl, width, height]);

    return {
        width,
        height,
    };
}
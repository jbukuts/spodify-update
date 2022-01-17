import React, { useEffect, useRef, useState } from "react";
import { createPalette } from "../../common/palette";
import { getRandomInt } from "../../common/helper";
import "./Blobs.css";

const Blobs = ({ imageURL }) => {
  const [palette, setPalette] = useState();
  const blobsRef = useRef();
  const blobPositions = ["", "bottomRight", "topRight", "bottomLeft"];

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const min = 0;
      const max = 1000000;
      [...blobsRef.current.children].forEach((blob) => {
        [
          "TopLeftRadius",
          "TopRightRadius",
          "BottomLeftRadius",
          "BottomRightRadius",
        ].forEach((r) => {
          const a = getRandomInt(min, max);
          const b = getRandomInt(min, max);
          blob.style[`border${r}`] = `${a}px ${b}px`;
        });
      });
    }, 1000);

    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    const buildPalette = () => {
      return createPalette(imageURL, 10, 16).then((r) => {
        const colorString = (rgbArray) => {
          return `rgb(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]})`;
        };

        const bgColor = colorString(r.shift());
        r = r
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 4)
          .map((cArr) => colorString(cArr));
        return [bgColor, ...r];
      });
    };

    buildPalette(imageURL).then((p) => setPalette(p));
  }, [imageURL]);

  return (
    <>
      {palette && (
        <>
          <div className="coverBlur"></div>
          <div
            className="blobs"
            ref={blobsRef}
            style={{ backgroundColor: palette[0] }}
          >
            {blobPositions.map((pos, i) => {
              return (
                <div
                  key={i}
                  className={`blob ${pos}`}
                  style={{ background: palette[i + 1] }}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Blobs;

import { registerRoot, Composition } from 'remotion';
import { MyComposition } from './Composition';

const RemotionRoot = () => {
  return (
    <Composition
      id="MainVideo"
      component={MyComposition}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
          images: ["https://picsum.photos/1080/1920"],
          text: 'Testing Hookify'
      }}
    />
  );
};

registerRoot(RemotionRoot);
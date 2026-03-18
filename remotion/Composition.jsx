import { AbsoluteFill, Img, Audio, useCurrentFrame, useVideoConfig } from 'remotion';

export const MyComposition = ({ images, text, audioUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* عرض الصور - تتبدل كل 2.5 ثانية إذا كان هناك أكثر من صورة */}
      {images && images.length > 0 && (
        <AbsoluteFill>
            <Img 
                src={images[Math.floor(frame / (fps * 2.5)) % images.length]} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transform: `scale(${1 + (frame % (fps * 2.5)) / 500})` 
                }} 
            />
        </AbsoluteFill>
      )}

      {/* الصوت */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* النص مع تصميم احترافي */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '30px',
          fontSize: '70px',
          textAlign: 'center',
          fontWeight: 'bold',
          border: '4px solid white'
        }}>
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
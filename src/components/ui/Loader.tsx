export default function LoaderRipple() {
    return (
      <div className="flex justify-center items-center">
        <div className="loader-ripple" />
        <style jsx>{`
          .loader-ripple {
            width: 48px;
            height: 48px;
            border: 4px solid #3b82f6;
            border-radius: 50%;
            animation: ripple 1s infinite ease-in-out;
          }
  
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }
  
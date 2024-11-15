const SpeedoMeterHigh = (props) => {
  return (
    <div style={{ marginTop: "-15px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={142}
        height={48}
        fill="none"
        {...props}
      >
        <g clipPath="url(#a)">
          <path
            fill="#D9D9D9"
            d="M94 48a27 27 0 1 0-54 0h8.82a18.18 18.18 0 1 1 36.36 0H94Z"
          />
          <mask id="b" fill="#fff">
            <path d="M53.507 24.613A27 27 0 0 0 40 47.98l8.82.007a18.18 18.18 0 0 1 9.094-15.735l-4.407-7.639Z" />
          </mask>
          <path
            fill="#17B26A"
            stroke="#fff"
            strokeWidth={2}
            d="M53.507 24.613A27 27 0 0 0 40 47.98l8.82.007a18.18 18.18 0 0 1 9.094-15.735l-4.407-7.639Z"
            mask="url(#b)"
          />
          <mask id="c" fill="#fff">
            <path d="M80.529 24.634a27 27 0 0 0-26.99-.039l4.397 7.645a18.18 18.18 0 0 1 18.174.026l4.419-7.632Z" />
          </mask>
          <path
            fill="#F79009"
            stroke="#fff"
            strokeWidth={2}
            d="M80.529 24.634a27 27 0 0 0-26.99-.039l4.397 7.645a18.18 18.18 0 0 1 18.174.026l4.419-7.632Z"
            mask="url(#c)"
          />
          <mask id="d" fill="#fff">
            <path d="M94 48a27 27 0 0 0-13.49-23.377l-4.413 7.636A18.18 18.18 0 0 1 85.181 48H94Z" />
          </mask>
          <path
            fill="#D92D20"
            stroke="#fff"
            strokeWidth={2}
            d="M94 48a27 27 0 0 0-13.49-23.377l-4.413 7.636A18.18 18.18 0 0 1 85.181 48H94Z"
            mask="url(#d)"
          />
          <circle
            cx={5}
            cy={5}
            r={4.5}
            fill="#000"
            stroke="#fff"
            transform="scale(-1 1) rotate(-72.023 -5.25 73.302)"
          />
          <path
            fill="#000"
            d="M90.834 34.756 65.331 41.21l1.07 3.295 24.433-9.75Z"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h142v48H0z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default SpeedoMeterHigh;

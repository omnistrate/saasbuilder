const SpeedoMeterMedium = (props) => {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={142}
      height={48}
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <mask id="b" fill="#fff">
          <path d="M53.507 24.613a26.999 26.999 0 0 0-13.43 21.35l8.794.665a18.18 18.18 0 0 1 9.043-14.376l-4.407-7.639Z" />
        </mask>
        <path
          fill="#17B26A"
          stroke="#fff"
          strokeWidth={2}
          d="M53.507 24.613a26.999 26.999 0 0 0-13.43 21.35l8.794.665a18.18 18.18 0 0 1 9.043-14.376l-4.407-7.639Z"
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
          <path d="M93.94 46.209a27 27 0 0 0-15.01-22.43l-3.897 7.91A18.182 18.182 0 0 1 85.14 46.795l8.8-.585Z" />
        </mask>
        <path
          fill="#D92D20"
          stroke="#fff"
          strokeWidth={2}
          d="M93.94 46.209a27 27 0 0 0-15.01-22.43l-3.897 7.91A18.182 18.182 0 0 1 85.14 46.795l8.8-.585Z"
          mask="url(#d)"
        />
        <circle cx={67} cy={42} r={4.5} fill="#000" stroke="#fff" />
        <path fill="#000" d="m67 17 1.732 26.25h-3.464L67 17Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h142v48H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SpeedoMeterMedium;

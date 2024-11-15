const SpeedoMeterMedium = (props) => {
  return (
    <div style={{ marginTop: "30px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={54}
        height={54}
        fill="none"
        {...props}
      >
        <mask id="a" fill="#fff">
          <path d="M13.507 3.613a27 27 0 0 0-13.43 21.35l8.794.665a18.181 18.181 0 0 1 9.043-14.376l-4.407-7.639Z" />
        </mask>
        <path
          fill="#17B26A"
          stroke="#fff"
          strokeWidth={2}
          d="M13.507 3.613a27 27 0 0 0-13.43 21.35l8.794.665a18.181 18.181 0 0 1 9.043-14.376l-4.407-7.639Z"
          mask="url(#a)"
        />
        <mask id="b" fill="#fff">
          <path d="M40.529 3.634a27 27 0 0 0-26.99-.039l4.397 7.645a18.18 18.18 0 0 1 18.174.026l4.419-7.632Z" />
        </mask>
        <path
          fill="#F79009"
          stroke="#fff"
          strokeWidth={2}
          d="M40.529 3.634a27 27 0 0 0-26.99-.039l4.397 7.645a18.18 18.18 0 0 1 18.174.026l4.419-7.632Z"
          mask="url(#b)"
        />
        <mask id="c" fill="#fff">
          <path d="M53.94 25.209a27 27 0 0 0-15.01-22.43l-3.897 7.91A18.182 18.182 0 0 1 45.14 25.795l8.8-.585Z" />
        </mask>
        <path
          fill="#D92D20"
          stroke="#fff"
          strokeWidth={2}
          d="M53.94 25.209a27 27 0 0 0-15.01-22.43l-3.897 7.91A18.182 18.182 0 0 1 45.14 25.795l8.8-.585Z"
          mask="url(#c)"
        />
        <circle cx={27} cy={21} r={4.5} fill="#000" stroke="#fff" />
        <path fill="#000" d="m27 1 1.732 21.25h-3.464L27 1Z" />
      </svg>
    </div>
  );
};

export default SpeedoMeterMedium;

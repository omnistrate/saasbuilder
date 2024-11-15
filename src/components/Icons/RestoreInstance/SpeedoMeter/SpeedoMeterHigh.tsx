const SpeedoMeterHigh = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={54}
      height={27}
      fill="none"
      {...props}
    >
      <path
        fill="url(#a)"
        d="M54 27a27 27 0 1 0-54 0h8.818a18.182 18.182 0 0 1 36.364 0H54Z"
      />
      <circle cx={27} cy={22} r={4.5} fill="#000" stroke="#fff" />
      <path
        fill="#000"
        d="m48.233 13.473-21.74 10.455-1.185-2.947 22.925-7.508Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1={6.658}
          x2={46.603}
          y1={22.192}
          y2={22.192}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#17B26A" />
          <stop offset={0.845} stopColor="#D92D20" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SpeedoMeterHigh;

const SpeedoMeterLow = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={54}
      height={27}
      fill="none"
      {...props}
    >
      <path
        fill="#D0D5DD"
        d="M54 27a27 27 0 1 0-54 0h8.818a18.182 18.182 0 0 1 36.364 0H54Z"
      />
      <circle cx={27} cy={22} r={4.5} fill="#000" stroke="#fff" />
      <path fill="#000" d="m3.098 25.227 24.104-.946-.333-3.159-23.77 4.105Z" />
    </svg>
  );
};

export default SpeedoMeterLow;

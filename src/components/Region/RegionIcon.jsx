const RegionIcon = (props) => {
  return (
    <svg
      width={40.909}
      height={40}
      viewBox="0 0 40.909 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_4635_21590)">
        <path
          x={2.5}
          y={1}
          width={40}
          height={40}
          rx={8}
          fill="white"
          d="M9.545 0.909H31.364A7.273 7.273 0 0 1 38.636 8.182V30A7.273 7.273 0 0 1 31.364 37.273H9.545A7.273 7.273 0 0 1 2.273 30V8.182A7.273 7.273 0 0 1 9.545 0.909z"
        />
        <path
          d="M12.879 19.091h15.151m-15.151 0a7.575 7.575 0 0 0 7.575 7.575M12.879 19.091a7.575 7.575 0 0 1 7.575 -7.575M28.03 19.091a7.575 7.575 0 0 1 -7.575 7.575M28.03 19.091a7.575 7.575 0 0 0 -7.575 -7.575m0 0A11.591 11.591 0 0 1 23.484 19.091a11.591 11.591 0 0 1 -3.03 7.575m0 -15.151A11.591 11.591 0 0 0 17.425 19.091a11.591 11.591 0 0 0 3.03 7.575"
          stroke="#7F56D9"
          strokeWidth={1.8181777777777777}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          x={3}
          y={1.5}
          width={39}
          height={39}
          rx={7.5}
          stroke="#EAECF0"
          d="M9.545 1.364H31.364A6.818 6.818 0 0 1 38.182 8.182V30A6.818 6.818 0 0 1 31.364 36.818H9.545A6.818 6.818 0 0 1 2.727 30V8.182A6.818 6.818 0 0 1 9.545 1.364z"
          strokeWidth={0.9090888888888888}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4635_21590"
          x={0.5}
          y={0}
          width={44}
          height={44}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={1} />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4635_21590"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4635_21590"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default RegionIcon;

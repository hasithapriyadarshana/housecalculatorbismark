export function ConstructionIllustration() {
  return (
    <svg
      viewBox="0 0 520 460"
      role="img"
      aria-label="House under construction with tower crane"
      className="h-auto w-full"
    >
      {/* Sky accents */}
      <circle cx={430} cy={90} r={70} fill="#ED9420" opacity={0.12} />
      <circle
        cx={430}
        cy={90}
        r={92}
        fill="none"
        stroke="#ED9420"
        strokeWidth={2}
        strokeDasharray="6 8"
        opacity={0.35}
      />
      <circle cx={112} cy={76} r={22} fill="#ED9420" />
      <g fill="#2D3748">
        <ellipse cx={300} cy={66} rx={34} ry={14} />
        <ellipse cx={326} cy={60} rx={24} ry={12} />
        <ellipse cx={180} cy={128} rx={26} ry={11} opacity={0.8} />
        <ellipse cx={200} cy={122} rx={18} ry={9} opacity={0.8} />
      </g>
      <g stroke="#ED9420" strokeWidth={4} strokeLinecap="round">
        <line x1={52} y1={176} x2={52} y2={196} />
        <line x1={42} y1={186} x2={62} y2={186} />
      </g>
      <circle cx={486} cy={222} r={7} fill="none" stroke="#ED9420" strokeWidth={3} />

      {/* Ground */}
      <rect x={20} y={404} width={480} height={10} rx={5} fill="#2D3748" />

      {/* Tower crane */}
      <g>
        <line x1={448} y1={150} x2={448} y2={404} stroke="#9AA0A6" strokeWidth={6} />
        <line x1={468} y1={150} x2={468} y2={404} stroke="#9AA0A6" strokeWidth={6} />
        {[162, 186, 210, 234, 258, 282, 306, 330, 354, 378].map((y) => (
          <line key={y} x1={448} y1={y} x2={468} y2={y} stroke="#9AA0A6" strokeWidth={4} />
        ))}
        <rect x={440} y={118} width={36} height={32} rx={3} fill="#ED9420" />
        <rect x={446} y={124} width={14} height={12} rx={1} fill="#171717" />
        <line x1={458} y1={118} x2={458} y2={84} stroke="#ED9420" strokeWidth={6} strokeLinecap="round" />
        <line x1={458} y1={124} x2={300} y2={124} stroke="#ED9420" strokeWidth={7} strokeLinecap="round" />
        <line x1={458} y1={124} x2={505} y2={124} stroke="#ED9420" strokeWidth={7} strokeLinecap="round" />
        <line x1={458} y1={84} x2={310} y2={124} stroke="#9AA0A6" strokeWidth={2.5} />
        <line x1={458} y1={84} x2={500} y2={124} stroke="#9AA0A6" strokeWidth={2.5} />
        <rect x={490} y={132} width={18} height={30} rx={2} fill="#2D3748" />
      </g>

      {/* House */}
      <g>
        <rect x={70} y={360} width={220} height={44} rx={2} fill="#2D3748" />
        <rect x={90} y={240} width={180} height={120} fill="#F7FAFC" />
        {[260, 280, 300, 320, 340].map((y) => (
          <line key={y} x1={90} y1={y} x2={270} y2={y} stroke="#D9DEE5" strokeWidth={2} />
        ))}
        {/* Rising brick courses */}
        {[90, 122, 154, 186, 218, 250].map((x) => (
          <rect key={x} x={x} y={226} width={28} height={12} fill="#F7FAFC" />
        ))}
        {[106, 138, 170, 202].map((x) => (
          <rect key={x} x={x} y={212} width={28} height={12} fill="#F7FAFC" opacity={0.85} />
        ))}
        {/* Roof truss */}
        <polyline
          points="100,212 180,140 260,212"
          fill="none"
          stroke="#ED9420"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={180} y1={140} x2={180} y2={212} stroke="#ED9420" strokeWidth={7} strokeLinecap="round" />
        {/* Window + door openings */}
        <rect x={115} y={270} width={44} height={44} rx={2} fill="#171717" />
        <line x1={137} y1={270} x2={137} y2={314} stroke="#F7FAFC" strokeWidth={3} />
        <line x1={115} y1={292} x2={159} y2={292} stroke="#F7FAFC" strokeWidth={3} />
        <rect x={200} y={290} width={44} height={70} rx={2} fill="#171717" />
        <rect x={192} y={360} width={60} height={8} rx={2} fill="#ED9420" />
      </g>

      {/* Hanging wall panel */}
      <g>
        <line x1={280} y1={124} x2={280} y2={180} stroke="#6B7280" strokeWidth={3} />
        <rect x={272} y={172} width={16} height={10} rx={2} fill="#9AA0A6" />
        <rect x={248} y={182} width={64} height={40} rx={2} fill="#F7FAFC" />
        <rect x={248} y={182} width={64} height={8} fill="#ED9420" />
      </g>

      {/* Scaffolding */}
      <g>
        <rect x={322} y={180} width={8} height={224} fill="#9AA0A6" />
        <rect x={390} y={180} width={8} height={224} fill="#9AA0A6" />
        <line x1={322} y1={240} x2={398} y2={370} stroke="#9AA0A6" strokeWidth={6} />
        {[230, 300, 370].map((y) => (
          <rect key={y} x={314} y={y} width={84} height={10} rx={2} fill="#ED9420" />
        ))}
        <rect x={340} y={210} width={24} height={18} rx={2} fill="#2D3748" />
        <rect x={340} y={210} width={24} height={5} fill="#ED9420" />
      </g>

      {/* Traffic cone */}
      <g>
        <rect x={30} y={392} width={46} height={10} rx={3} fill="#C97A15" />
        <polygon points="53,392 35,392 49,338" fill="#ED9420" />
        <polygon points="48.5,366 41.5,366 44,354 46,354" fill="#F7FAFC" />
      </g>

      {/* Hard hat */}
      <g>
        <rect x={86} y={390} width={56} height={9} rx={4.5} fill="#ED9420" />
        <path d="M96 390 a18 18 0 0 1 36 0 z" fill="#ED9420" />
        <rect x={111} y={368} width={6} height={12} rx={3} fill="#C97A15" />
      </g>
    </svg>
  );
}

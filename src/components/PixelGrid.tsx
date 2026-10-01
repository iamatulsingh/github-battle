export function PixelGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="
          absolute inset-0
          opacity-[0.12]
          [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
          [background-size:32px_32px]
          [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]
        "
      />

      <div className="absolute left-[12%] top-[22%] h-1 w-1 bg-[#7cff6b] shadow-[0_0_12px_#7cff6b]" />
      <div className="absolute right-[18%] top-[32%] h-1 w-1 bg-[#58e6ff] shadow-[0_0_12px_#58e6ff]" />
      <div className="absolute bottom-[25%] left-[22%] h-1 w-1 bg-[#a78bfa] shadow-[0_0_12px_#a78bfa]" />
    </div>
  )
}

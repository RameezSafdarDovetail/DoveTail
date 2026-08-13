export function BrandBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-brand-navy bg-[url('/dovetail-blue-background.png')] bg-cover bg-no-repeat bg-[position:right_top] max-[640px]:bg-[position:70%_top]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,12,46,0.82)_0%,rgba(3,21,76,0.46)_28%,rgba(3,24,88,0.1)_58%,rgba(3,18,64,0)_100%),linear-gradient(180deg,rgba(1,10,36,0.22)_0%,rgba(1,10,36,0.03)_32%,rgba(1,10,36,0.48)_100%)]" />
    </div>
  );
}

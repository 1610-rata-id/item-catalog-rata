export default function Features() {
  const features = [
    "Centralized Catalog",
    "Vendor Information",
    "Real-Time Access",
    "Operational Ready",
  ];

  return (
    <section className="py-24 px-6 bg-zinc-950">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Highlights
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {features.map((item) => (
            <div
              key={item}
              className="p-6 rounded-2xl border border-white/10 bg-white/5"
            >
              <h3 className="font-semibold">{item}</h3>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
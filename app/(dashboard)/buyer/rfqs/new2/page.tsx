"use client";

import { useState } from "react";
import { shapeOptions, materialOptions, sizeOptions, thicknessOptions } from "./specs";
import { Button } from "@/components/ui/button";

export default function RFQCreate() {
  // --- STATE --------------------
  const [shape, setShape] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [thickness, setThickness] = useState<string | null>(null);
  const [finish, setFinish] = useState<string | null>(null);
  const [endType, setEndType] = useState<string | null>("PE");
  const [length, setLength] = useState<string | null>("6 MTR");
  const [qty, setQty] = useState<string>("");

  // BRAND SELECTION
  const [brands, setBrands] = useState<string[]>([]);

  const toggleBrand = (b: string) => {
    setBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  // --- SUMMARY OBJECT (real-time JSON) --------------------
  const summary = {
    shape,
    material,
    size,
    thickness,
    finish,
    endType,
    length,
    qty,
    brands,
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Create RFQ (Advanced)</h1>

      {/* SHAPE */}
      <section>
        <h2 className="font-semibold mb-2">Select Shape</h2>
        <div className="flex gap-2 flex-wrap">
          {shapeOptions.map((s) => (
            <Button
              key={s}
              variant={shape === s ? "default" : "outline"}
              onClick={() => {
                setShape(s);
                setSize(null);
                setThickness(null);
              }}
            >
              {s}
            </Button>
          ))}
        </div>
      </section>

      {/* MATERIAL */}
      {shape && (
        <section>
          <h2 className="font-semibold mb-2">Material</h2>
          <div className="flex gap-2 flex-wrap">
            {materialOptions.map((m) => (
              <Button
                key={m}
                variant={material === m ? "default" : "outline"}
                onClick={() => {
                  setMaterial(m);
                  setThickness(null);
                }}
              >
                {m}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* SIZE */}
      {shape && material && (
        <section>
          <h2 className="font-semibold mb-2">Size</h2>
          <div className="flex gap-2 flex-wrap">
            {sizeOptions[shape].map((s) => (
              <Button
                key={s}
                variant={size === s ? "default" : "outline"}
                onClick={() => {
                  setSize(s);
                  setThickness(null);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* THICKNESS */}
      {shape && material && size && (
        <section>
          <h2 className="font-semibold mb-2">Thickness (mm)</h2>

          <div className="flex flex-wrap gap-2">
            {thicknessOptions(material, size).map((t) => (
              <Button
                key={t}
                variant={thickness === t ? "default" : "outline"}
                onClick={() => setThickness(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* SURFACE FINISH (only for MS Round) */}
      {material === "BLACK MS" && shape === "ROUND" && (
        <section>
          <h2 className="font-semibold mb-2">Surface Finish</h2>
          <div className="flex gap-2">
            {["Bare", "Oiled", "Varnished"].map((f) => (
              <Button
                key={f}
                variant={finish === f ? "default" : "outline"}
                onClick={() => setFinish(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* END TYPE */}
      {size && (
        <section>
          <h2 className="font-semibold mb-2">End Type</h2>
          <div className="flex gap-2">
            {["PE", "SWS", "S&S"].map((e) => (
              <Button
                key={e}
                variant={endType === e ? "default" : "outline"}
                onClick={() => setEndType(e)}
              >
                {e}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* LENGTH */}
      {size && (
        <section>
          <h2 className="font-semibold mb-2">Length</h2>
          <div className="flex gap-2 flex-wrap">
            {["6 MTR", "21 FT", "22 FT", "24 FT"].map((l) => (
              <Button
                key={l}
                variant={length === l ? "default" : "outline"}
                onClick={() => setLength(l)}
              >
                {l}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* QUANTITY */}
      <section>
        <h2 className="font-semibold mb-2">Quantity</h2>
        <input
          className="border p-2 w-full max-w-xs"
          placeholder="Enter quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </section>

      {/* BRANDS */}
      <section>
        <h2 className="font-semibold mb-2">Preferred Brands</h2>
        <div className="flex gap-2 flex-wrap">
          {["TATA", "JINDAL", "SURYA", "APL APOLLO", "GENERAL"].map((b) => (
            <Button
              key={b}
              variant={brands.includes(b) ? "default" : "outline"}
              onClick={() => toggleBrand(b)}
            >
              {b}
            </Button>
          ))}
        </div>
      </section>

      {/* LIVE SUMMARY */}
      <section>
        <h2 className="font-semibold mb-2">Summary</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(summary, null, 2)}
        </pre>
      </section>

      {/* SUBMIT */}
      <Button className="bg-blue-600 text-white">Submit RFQ</Button>
    </div>
  );
}

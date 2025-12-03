"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { materials, shapes, roundSizes, shsSizes, rhsSizes, allThickness } from "./specs";

export default function SellerCapabilitiesForm() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [round, setRound] = useState<string[]>([]);
  const [shs, setShs] = useState<string[]>([]);
  const [rhs, setRhs] = useState<string[]>([]);
  const [thickness, setThickness] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [endTypes, setEndTypes] = useState<string[]>([]);
  const [lengths, setLengths] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [customLength, setCustomLength] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [radius, setRadius] = useState<string>("50");
  const [moq, setMoq] = useState<string>("500 kg");
  const [lead, setLead] = useState<string>("Ready Stock");

  const toggle = (list: string[], setter: any, value: string) => {
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
  };

  const summary = {
    materials: selectedMaterials,
    shapes: selectedShapes,
    sizes: {
      round,
      shs,
      rhs,
    },
    thickness,
    end_types: endTypes,
    finishes,
    lengths,
    brands,
    delivery: {
      states,
      radius_km: radius,
    },
    moq,
    lead_time: lead
  };

  async function submit() {
    await fetch("/api/seller/capabilities", {
      method: "POST",
      body: JSON.stringify(summary)
    });
    alert("Capabilities saved!");
  }

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold">Seller Capability Form</h1>

      {/* MATERIALS */}
      <Section title="Materials you sell">
        <Options
          items={materials}
          selected={selectedMaterials}
          setter={setSelectedMaterials}
          allowSelectAll
        />
      </Section>

      {/* SHAPES */}
      <Section title="Shapes supported">
        <Options
          items={shapes}
          selected={selectedShapes}
          setter={setSelectedShapes}
          allowSelectAll
        />
      </Section>

      {/* SIZES */}
      {selectedShapes.includes("ROUND") && (
        <Section title="Round (NB) sizes">
          <Options items={roundSizes} selected={round} setter={setRound} allowSelectAll />
        </Section>
      )}

      {selectedShapes.includes("SHS") && (
        <Section title="SHS Sizes">
          <Options items={shsSizes} selected={shs} setter={setShs} allowSelectAll />
        </Section>
      )}

      {selectedShapes.includes("RHS") && (
        <Section title="RHS Sizes">
          <Options items={rhsSizes} selected={rhs} setter={setRhs} allowSelectAll />
        </Section>
      )}

      {/* THICKNESS */}
      <Section title="Thickness supported (mm)">
        <Options items={allThickness} selected={thickness} setter={setThickness} allowSelectAll />
      </Section>

      {/* END TYPE */}
      <Section title="End Types">
        <Options
          items={["PE", "SWS", "S&S"]}
          selected={endTypes}
          setter={setEndTypes}
          allowSelectAll
        />
      </Section>

      {/* SURFACE FINISH */}
      {selectedMaterials.includes("BLACK MS") && (
        <Section title="Surface Finish">
          <Options
            items={["Bare", "Oiled", "Varnished"]}
            selected={finishes}
            setter={setFinishes}
            allowSelectAll
          />
        </Section>
      )}

      {/* LENGTH */}
      <Section title="Pipe Lengths">
        <Options
          items={["6 MTR", "21 FT", "22 FT", "24 FT"]}
          selected={lengths}
          setter={setLengths}
        />
        <input
          className="border p-2 mt-2"
          placeholder="Custom Length"
          value={customLength}
          onChange={(e) => setCustomLength(e.target.value)}
        />
      </Section>

      {/* BRANDS */}
      <Section title="Brands you sell">
        <Options
          items={["TATA", "JINDAL", "SURYA", "APL APOLLO", "GENERAL", "LOCAL"]}
          selected={brands}
          setter={setBrands}
        />

        {/* ADD YOUR BRAND */}
        <input
          className="border p-2 mt-2"
          placeholder="Add your Brand"
          value={customBrand}
          onChange={(e) => setCustomBrand(e.target.value)}
        />
      </Section>

      {/* DELIVERY */}
      <Section title="Delivery Capability">
        {/* STATES */}
        <h3 className="font-semibold">States Served</h3>
        <Options
          items={["Rajasthan", "Delhi", "Haryana", "Punjab", "UP", "MP", "Gujarat"]}
          selected={states}
          setter={setStates}
          allowSelectAll
        />

        {/* RADIUS */}
        <h3 className="font-semibold mt-4">Delivery Radius (KM)</h3>
        <Options
          items={["50", "100", "200", "300"]}
          selected={[radius]}
          setter={(val: any) => setRadius(val[val.length - 1])}
        />

        <input
          className="border p-2 mt-2"
          placeholder="Custom radius"
          onChange={(e) => setRadius(e.target.value)}
        />
      </Section>

      {/* MOQ */}
      <Section title="Minimum Order Quantity">
        <Options
          items={["500 kg", "1 MT", "2 MT", "3 MT", "5 MT", "10 MT"]}
          selected={[moq]}
          setter={(list: any) => setMoq(list[list.length - 1])}
        />
        <input className="border p-2 mt-2" placeholder="Custom MOQ" />
      </Section>

      {/* LEAD TIME */}
      <Section title="Lead Time">
        <Options
          items={["Ready Stock", "1–2 Days", "3–5 Days", ">5 Days"]}
          selected={[lead]}
          setter={(list: any) => setLead(list[list.length - 1])}
        />
      </Section>

      {/* SUMMARY */}
      <Section title="Summary JSON">
        <pre className="p-4 bg-gray-100 rounded text-sm">
          {JSON.stringify(summary, null, 2)}
        </pre>
      </Section>

      {/* SUBMIT */}
      <Button className="bg-blue-600 text-white" onClick={submit}>
        Save Capabilities
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Options({
  items,
  selected,
  setter,
  allowSelectAll
}: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowSelectAll && (
        <Button
          variant="outline"
          onClick={() =>
            selected.length === items.length
              ? setter([])
              : setter([...items])
          }
        >
          SELECT ALL
        </Button>
      )}
      {items.map((x: string) => (
        <Button
          key={x}
          variant={selected.includes(x) ? "default" : "outline"}
          onClick={() =>
            setter(
              selected.includes(x)
                ? selected.filter((s: string) => s !== x)
                : [...selected, x]
            )
          }
        >
          {x}
        </Button>
      ))}
    </div>
  );
}

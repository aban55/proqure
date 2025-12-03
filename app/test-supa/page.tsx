"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function TestSupa() {
  async function test() {
    const { data, error } = await supabaseBrowser
      .from("profiles")
      .select("*")
      .limit(1);

    console.log({ data, error });
  }

  return <button onClick={test}>Test Supabase</button>;
}

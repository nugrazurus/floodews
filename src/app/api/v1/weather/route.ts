import { getDB } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let data = {};

  await getDB("BME280")
    .get()
    .then((snap: any) => {
      data = snap.val();
    });

  return NextResponse.json({
    success: true,
    data: data,
  });
}

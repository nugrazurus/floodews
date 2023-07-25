import { getDB } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const data: any[] = [];

  const { searchParams } = new URL(request.url);
  const dateReq = searchParams.get("date");

  const [day, month, year] = dateReq ? dateReq.split("-").map(Number) : [];
  const date = dateReq ? new Date(year, month, day) : new Date();
  const startOfDay = date.setHours(0, 0, 0, 0);
  const endOfDay = date.setHours(23, 59, 59, 999);

  await getDB("Cuaca")
    .startAt(startOfDay)
    .endAt(endOfDay)
    .orderByChild("timestamp")
    .get()
    .then((snap: any) => {
      snap.forEach((row: any) => {
        data.push(row.val());
      });
    });

  return NextResponse.json({
    success: true,
    data: data,
  });
}

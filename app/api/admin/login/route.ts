import { NextResponse } from "next/server";
import getPool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const pool = getPool();

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, email, password FROM admin_users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = rows[0] as { id: number; email: string; password: string };

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Create response with cookie
    const res = NextResponse.json({ success: true });

    res.cookies.set("admin_session", "authenticated", {
      httpOnly: true, // keeps it safe from JS access
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      path: "/", // cookie applies to all routes
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

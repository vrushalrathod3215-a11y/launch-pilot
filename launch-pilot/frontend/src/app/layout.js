import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "LaunchPilot — Go-To-Market Strategy & Launch Platform",
  description: "Plan, analyze, validate, and execute your product launches with precision.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}


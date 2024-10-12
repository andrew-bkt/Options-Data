// app/layout.tsx

import './globals.css';

export const metadata = {
  title: 'Stock Options Analysis Tool',
  description: 'Analyze stock options data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
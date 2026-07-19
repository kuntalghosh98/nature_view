import "./globals.css";
import Providers from "./providers";
import Bootstrap from "./Bootstrap";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        {/* Bootstrap component to preload data on app mount */}
        <Bootstrap />
      </body>
    </html>
  );
}


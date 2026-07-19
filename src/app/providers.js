
import { StoreProvider } from "@/store/StoreProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { PublicShell } from "@/components/PublicShell";

export default function Providers({
  children,
}: {
  children;
}) {
  return (
    <StoreProvider>
      <LocaleProvider>
        <PublicShell>{children}</PublicShell>
      </LocaleProvider>
    </StoreProvider>
  );
}

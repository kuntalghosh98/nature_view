
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export function PublicShell({ children }) {
  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-[#f7f7f2]">{children}</div>
      <PublicFooter />
    </>
  );
}

export default PublicShell;

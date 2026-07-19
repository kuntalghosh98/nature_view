
/* eslint-disable no-unused-vars, unicode-bom, jsx-a11y/anchor-is-valid */
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

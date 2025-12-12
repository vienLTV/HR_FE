import Link from "next/link";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[10%] md:w-[5%] lg:w-[10%] xl:w-[12%] border-r-2 bg-[#054FA5]">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 p-4 ">
        {/* <Image src="/logo.png" alt="logo" width={70} height={70}></Image> */}
        <span className="hidden lg:block font-bold text-xl text-white">Cetus</span>
        </Link>

        <Menu />
      </div>

      {/* RIGHT */}
      <div className="w-[90%] md-w[95%] lg-w[90%] xl:w-[88%] bg-[#F7F8FA] overflow-scroll px-4">
        <Navbar />
        {children}
      </div>

    </div>
   );
}
import Image from "next/image";
import Link from "next/link";
import providerConfig from "src/providerConfig";

export default function Logo(props) {
  const { href } = props;
  return (
    <Link href={href}>
      <Image
        src={""}
        width={152}
        height={34.3}
        alt="ferret-logo"
        priority
        style={{ objectFit: "cover", borderRadius: 4 }}
      />
    </Link>
  );
}

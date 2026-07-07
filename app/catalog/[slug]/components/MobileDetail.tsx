import MobileDetailClient from "./MobileDetailClient";

type MobileDetailProps = {
  data: any;
};

export default function MobileDetail({
  data,
}: MobileDetailProps) {
  return (
    <MobileDetailClient
      data={data}
    />
  );
}
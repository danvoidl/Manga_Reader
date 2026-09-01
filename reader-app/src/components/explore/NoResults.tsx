import AppText from "@/components/AppText";

export function NoResults() {
  return (
    <AppText
      text="Nenhum resultado encontrado."
      size="sub"
      className="mt-10 text-center text-gray-400"
    />
  );
}

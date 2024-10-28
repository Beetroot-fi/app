import { Address } from "@ton/core";

export default function useFriendlyAddress(address: string | undefined | null) {
  if (!address) return null;
  try {
    return Address.parse(address).toString({ bounceable: false });
  } catch (err) {
    return address;
  }
}

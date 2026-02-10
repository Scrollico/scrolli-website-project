import { getNavigation } from "@/lib/payload/client";
import Header from "./Header";
import { PayloadNavigation } from "@/lib/payload/types";

/**
 * Server component wrapper for Header
 * Fetches navigation data from Payload CMS and passes it to client Header component
 */
export default async function HeaderWrapper() {
  // getNavigation() now returns null on error instead of throwing
  const navigation = await getNavigation();

  return <Header navigation={navigation} />;
}

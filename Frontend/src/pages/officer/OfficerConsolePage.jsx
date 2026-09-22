import OfficerConsole from "../../loan-officer/OfficerConsole";
import { useAuth } from "../../context/AuthContext";

export default function OfficerConsolePage() {
  const { signOut } = useAuth();
  return <OfficerConsole onSignOut={signOut} />;
}

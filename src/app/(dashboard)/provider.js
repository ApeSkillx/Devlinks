import DevlinksProvider from "@/src/context/devlink-context";
import UserProfileProvider from "@/src/context/user-profile-context";

export default function Provider({ children }) {
  return (
    <DevlinksProvider>
      <UserProfileProvider>
        {children}
      </UserProfileProvider>
    </DevlinksProvider>
  );
}

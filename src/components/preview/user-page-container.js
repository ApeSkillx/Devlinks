
import DisplayUserProfile from "./display-user-profile-detail";
import DisplayDevlinkList from "./display-devlink-list";
import axios from "axios";

export default async function UserPageContainer({ username }) {
  // Since this is a server component I had to use NEXT_PUBLIC_API_BASE_URL here, set it up in .env accordingly
  const user = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/default`); // hardcoding username to default (no auth yet).

  const userData = {
    profile: {
      first_name: user?.data?.user?.first_name,
      last_name: user?.data?.user?.last_name,
      email: user?.data?.user?.email,
      profile_picture: user?.data?.user?.profile_picture,
    },
    devlinks: user?.data?.user.devlinksList
  };

  return (
    <div className="mt-12 gap-14 pb-20 md:pb-10">
      <DisplayUserProfile profile={userData?.profile} />
      {userData?.devlinks ? (
        <DisplayDevlinkList devlinks={userData?.devlinks} />
      ) : (
        <div className="text-center">
          <p className="text-neutral-grey">
            There are no links yet.
          </p>
        </div>
      )}
    </div>
  );
}

import HeadingGroup from "@/src/components/UI/heading/heading-group";
import UserProfileForm from "@/src/components/profile-details/user-profile-form";

export default function ProfileDetailsPage() {
  return (
    <>
      <div className="px-6">
        <HeadingGroup
          title="Customize profile details"
          subtitle="Add your details to your profile."
        />
      </div>
      <UserProfileForm />
    </>
  );
}

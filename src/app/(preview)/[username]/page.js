import UserPageContainer from "@/src/components/preview/user-page-container";

async function ViewUserPage({ params }) {
  const {username} = await params;
  return <UserPageContainer username={username} />;
}

export default ViewUserPage;

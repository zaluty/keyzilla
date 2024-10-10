import Profile from "./profile.client";

export function generateMetadata({ params }: { params: { name: string } }) {
  return {
    title: `Profile Settings - keyzilla`,
  };
}

export default function Page() {
  return <Profile />;
}

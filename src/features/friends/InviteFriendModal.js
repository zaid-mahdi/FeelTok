// The "Invite a friend" pop-up from the Friends mockup: my invite code to
// copy or share, and the box to add a friend with their code.
import AppModal from "../../components/AppModal";
import AddFriendForm from "./AddFriendForm";
import InviteCodeCard from "./InviteCodeCard";
import useInviteCode from "./useInviteCode";

// Takes the logged-in user's ID, a function that closes the pop-up, and an
// optional onFriendAdded function. Mount it only while it is open, so the
// code is loaded fresh each time.
export default function InviteFriendModal({ uid, onClose, onFriendAdded }) {
  const inviteCode = useInviteCode(uid);

  return (
    <AppModal isVisible title="Invite a friend" onClose={onClose} isSheet>
      <InviteCodeCard
        code={inviteCode.code}
        isLoading={inviteCode.isLoading}
        errorMessage={inviteCode.errorMessage}
        onRetry={inviteCode.reload}
      />
      <AddFriendForm uid={uid} onFriendAdded={onFriendAdded} />
    </AppModal>
  );
}

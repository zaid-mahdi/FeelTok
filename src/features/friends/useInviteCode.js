// Hook that loads the logged-in user's invite code for the Invite pop-up.
import { useCallback, useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { getOrCreateInviteCode } from "./inviteCodeService";

// Takes the user's ID. Returns their unused code (made if they have none),
// isLoading, errorMessage, and reload() to try again. It loads once when the
// pop-up opens, so a used code is replaced the next time it opens.
export default function useInviteCode(uid) {
  const [code, setCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setCode(await getOrCreateInviteCode(uid));
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { code, isLoading, errorMessage, reload };
}

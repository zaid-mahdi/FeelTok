// Hook shared by the admin pages: loads data once with a service function,
// and can load it again after a change (a deleted post, a blocked user).
import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../utils/errors";

// Takes a function that returns a promise of the data, and a list of values
// that load it again when they change (like a user ID). Returns data (null
// before the first load), isLoading, errorMessage and reload().
export default function useAdminData(loadData, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const loadDataRef = useRef(loadData);
  loadDataRef.current = loadData;

  const reload = useCallback(async () => {
    setErrorMessage(null);
    try {
      setData(await loadDataRef.current());
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    reload();
    // The dependencies are passed in by the page on purpose.
  }, dependencies);

  return { data, isLoading, errorMessage, reload };
}

import { useEffect } from "react";
import { useRouter } from "next/router";

import { useProfile } from "../context/context";
import ConnectWallet from "../components/ConnectWallet";

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useProfile();

  useEffect(() => {
    if (!isAuthenticated) return;

    const next =
      router.query.next ??
      new URLSearchParams(window.location.search).get("next");

    router.push(next ? `/${next}` : "/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8">
      <div className="space-y-2">
        <h2 className="block font-medium text-4xl text-gray-900">
          Sign in to continue
        </h2>
      </div>
      <ConnectWallet />
    </div>
  );
};

export default LoginPage;

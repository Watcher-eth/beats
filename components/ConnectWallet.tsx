import Link from "next/link";
import { CHAIN } from "../lib/consts";
import useOnce from "../hooks/useOnce";
import useLogin from "../hooks/lens/useLogin";
import { ConnectKitButton } from "connectkit";
import { useProfile } from "../context/context";
import { FC, ReactNode, useCallback, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Button } from "@chakra-ui/react";

const ConnectWallet: FC<{ children?: ({ logout: Function }) => ReactNode }> = ({
  children,
}) => {
  const { login, logout } = useLogin();
  const [loginOnce, reset] = useOnce(login);
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork({ chainId: CHAIN.id });
  const { profile, isAuthenticated } = useProfile();

  const handleLogout = async () => {
    await logout();
    reset();
  };

  useEffect(() => {
    if (!isConnected || chain?.unsupported) return;

    loginOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain?.unsupported]);

  const switchChain = useCallback(() => switchNetwork(), [switchNetwork]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, unsupported, show }) => {
        if (!isConnected) {
          return (
            <Button onClick={show}>
              <span className="uppercase">Sign in</span>
            </Button>
          );
        }

        if (unsupported) {
          return (
            <button
              onClick={switchChain}
              className="flex items-center space-x-2 border border-red-500 text-red-500 rounded-lg px-3 py-1 text-sm"
            >
              <span className="uppercase">Wrong network</span>
            </button>
          );
        }

        if (isConnecting || !isAuthenticated) {
          return (
            <button className="flex items-center space-x-2 border border-red-500 text-red-500 rounded-lg px-3 py-1 text-sm">
              <span className="uppercase">Logging in...</span>
            </button>
          );
        }

        if (!profile) {
          return (
            <Link
              href="createProfile"
              target="_blank"
              onClick={() =>
                alert(
                  "Haven't had time to add creating profiles yet, so go do it in Lenster and then come back :D"
                )
              }
              className="flex items-center space-x-2 border border-red-500 text-red-500 rounded-lg px-3 py-1 text-sm"
            >
              <Button className="uppercase">Create Profile</Button>
            </Link>
          );
        }

        return children?.({ logout: handleLogout });
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWallet;

import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { API_URL } from "./consts";

export const COOKIE_CONFIG = {
  sameSite: "None",
  secure: true,
  expires: 360,
};

const REFRESH_AUTHENTICATION_MUTATION = `
    mutation Refresh($request: RefreshRequest!) {
      refresh(request: $request) {
        accessToken
        refreshToken
      }
    }
  `;

const httpLink = new HttpLink({ uri: API_URL, fetch });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken === "undefined" || !accessToken) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("selectedProfile");

    return forward(operation);
  } else {
    operation.setContext({
      headers: {
        "x-access-token": accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    const { exp }: { exp: number } = jwtDecode(accessToken);

    if (Date.now() >= exp * 1000) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationName: "Refresh",
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: Cookies.get("refreshToken") },
          },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          operation.setContext({
            headers: {
              "x-access-token": accessToken
                ? `Bearer ${res?.data?.refresh?.accessToken}`
                : "",
            },
          });
          Cookies.set(
            "accessToken",
            res?.data?.refresh?.accessToken,
            COOKIE_CONFIG
          );
          Cookies.set(
            "refreshToken",
            res?.data?.refresh?.refreshToken,
            COOKIE_CONFIG
          );
        })
        .catch(() => {
          Cookies.remove("accessToken", COOKIE_CONFIG);
          Cookies.remove("refreshToken", COOKIE_CONFIG);

          toast.error(
            `Something went wrong when authenticating with Lens! Please log out, log back in, and try again.`
          );
        });
    }

    return forward(operation);
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const nodeClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;

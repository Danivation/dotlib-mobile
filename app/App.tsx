import { LandingPage } from "@/components/LandingPage";
import { useConvexAuth } from "convex/react";
import React, { Suspense } from "react";
import { View } from "react-native";
import "./global.css";
//
const AuthenticatedApp = React.lazy(() => import("./AuthenticatedApp"));

export default function App() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <Suspense fallback={<View className="flex items-center justify-center h-screen">Loading...</View>}>
      <AuthenticatedApp />
    </Suspense>
  );
}

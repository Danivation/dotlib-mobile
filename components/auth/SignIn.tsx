import "@/app/global.css";
import { ButtonDotlists } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { Chrome, Github } from "lucide-react";
import { Platform, View } from "react-native";

const redirectTo = makeRedirectUri();

export function SignIn() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const handleSignIn = async () => {
    const { redirect } = await signIn("github", { redirectTo });
    if (Platform.OS === "web") {
      return;
    }
    const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
    if (result.type === "success") {
      const { url } = result;
      const code = new URL(url).searchParams.get("code")!;
      await signIn("github", { code });
    }
  };
  return (
    <View className="flex flex-col items-center justify-center bg-background">
      {!isLoading && !isAuthenticated && (
        <View className="flex flex-col gap-4 w-full">
          <ButtonDotlists 
            onClick={handleSignIn}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-colors font-sans"
          >
            <Github size={24} />
            continue with github
          </ButtonDotlists>
          <ButtonDotlists 
            onClick={handleSignIn}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-colors font-sans"
          >
            <Chrome size={24} />
            continue with google
          </ButtonDotlists>
        </View>
      )}
    </View>
  );
}
